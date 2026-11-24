import { db, doc, getDoc, onSnapshot, setDoc, isFirestoreOnline } from '../firebase';

const STORAGE_PUBLIC_API_URL = 'ze_public_api_url';
export const DEFAULT_PREVIEW_API_BASE = 'https://ais-pre-rqsarmzw7lqlotpdbln6rq-937635165738.asia-southeast1.run.app';

let cachedFirestorePublicUrl = '';
let configWatcherStarted = false;

export function isValidHttpUrl(value: string): boolean {
  const trimmed = String(value || '').trim();
  if (!trimmed) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isAiStudioAuthProtectedUrl(url: string): boolean {
  const lower = String(url || '').toLowerCase();
  return lower.includes('ais-pre-') && lower.includes('.run.app');
}

export function isNativeApkEnv(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname === 'appassets.androidplatform.net' ||
    Boolean((window as any).AndroidInterface) ||
    Boolean((window as any).ZeNative)
  );
}

export function getSavedPublicApiUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_PUBLIC_API_URL) || '';
    if (saved && isValidHttpUrl(saved)) {
      return saved.replace(/\/+$/, '');
    }
  } catch {}
  if (cachedFirestorePublicUrl && isValidHttpUrl(cachedFirestorePublicUrl)) {
    return cachedFirestorePublicUrl.replace(/\/+$/, '');
  }
  return '';
}

export function setSavedPublicApiUrl(url: string): void {
  const clean = String(url || '').trim().replace(/\/+$/, '');
  try {
    if (clean && isValidHttpUrl(clean)) {
      localStorage.setItem(STORAGE_PUBLIC_API_URL, clean);
      cachedFirestorePublicUrl = clean;
    } else if (!clean) {
      localStorage.removeItem(STORAGE_PUBLIC_API_URL);
      cachedFirestorePublicUrl = '';
    }
  } catch {}
}

export function getApiBaseUrl(): string {
  const customPublic = getSavedPublicApiUrl();
  if (customPublic) return customPublic;

  if (typeof window !== 'undefined') {
    const nativeBridge = (window as any).ZeNative;
    const nativeBase =
      typeof nativeBridge?.getApiBaseUrl === 'function' ? String(nativeBridge.getApiBaseUrl() || '').trim() : '';
    if (nativeBase && isValidHttpUrl(nativeBase) && !isAiStudioAuthProtectedUrl(nativeBase)) {
      return nativeBase.replace(/\/+$/, '');
    }
    if (window.location.hostname !== 'appassets.androidplatform.net') {
      return window.location.origin.replace(/\/+$/, '');
    }
    if (nativeBase && isValidHttpUrl(nativeBase)) {
      return nativeBase.replace(/\/+$/, '');
    }
  }
  return DEFAULT_PREVIEW_API_BASE;
}

export function hasReachablePublicAiServer(): boolean {
  if (!isNativeApkEnv()) return true;
  const base = getApiBaseUrl();
  return Boolean(base) && !isAiStudioAuthProtectedUrl(base);
}

export function startServerUrlSync(): void {
  if (configWatcherStarted || !isFirestoreOnline() || !db) return;
  configWatcherStarted = true;
  try {
    const ref = doc(db, 'ze_config', 'server');
    onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as { publicApiUrl?: string };
          const url = String(data?.publicApiUrl || '').trim().replace(/\/+$/, '');
          if (url && isValidHttpUrl(url)) {
            cachedFirestorePublicUrl = url;
            try {
              localStorage.setItem(STORAGE_PUBLIC_API_URL, url);
            } catch {}
          } else if (data && 'publicApiUrl' in data && !url) {
            cachedFirestorePublicUrl = '';
            try {
              localStorage.removeItem(STORAGE_PUBLIC_API_URL);
            } catch {}
          }
        }
      },
      () => {
        // Non-fatal offline tolerance
      }
    );
  } catch {}
}

export async function fetchServerUrlFromFirestore(): Promise<string> {
  if (!isFirestoreOnline() || !db) return getSavedPublicApiUrl();
  try {
    const snap = await getDoc(doc(db, 'ze_config', 'server'));
    if (snap.exists()) {
      const url = String((snap.data() as any)?.publicApiUrl || '').trim().replace(/\/+$/, '');
      if (url && isValidHttpUrl(url)) {
        setSavedPublicApiUrl(url);
        return url;
      }
    }
  } catch {}
  return getSavedPublicApiUrl();
}

export async function savePublicApiUrlToFirestore(url: string): Promise<{ ok: boolean; error?: string }> {
  const clean = String(url || '').trim().replace(/\/+$/, '');
  if (clean && !isValidHttpUrl(clean)) {
    return { ok: false, error: 'URL harus diawali https:// atau http://' };
  }
  setSavedPublicApiUrl(clean);
  if (!isFirestoreOnline() || !db) {
    return { ok: true };
  }
  try {
    await setDoc(
      doc(db, 'ze_config', 'server'),
      { publicApiUrl: clean, updatedAt: Date.now() },
      { merge: true }
    );
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Gagal menyimpan URL ke Firestore' };
  }
}

export interface SafeJsonResult<T = any> {
  ok: boolean;
  status: number;
  isHtmlAuthBridge: boolean;
  data: T | null;
  error?: string;
}

export async function safeFetchJson<T = any>(
  input: string,
  init?: RequestInit
): Promise<SafeJsonResult<T>> {
  try {
    const res = await fetch(input, init);
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('text/html')) {
      return {
        ok: false,
        status: res.status || 401,
        isHtmlAuthBridge: true,
        data: null,
        error: 'Server preview memerlukan autentikasi atau URL publik belum dikonfigurasi.',
      };
    }
    const text = await res.text();
    const trimmed = text.trim();
    if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.startsWith('<HTML')) {
      return {
        ok: false,
        status: res.status || 401,
        isHtmlAuthBridge: true,
        data: null,
        error: 'Respons HTML diterima (Server AI Studio Auth Bridge / Offline).',
      };
    }
    if (!trimmed) {
      return { ok: res.ok, status: res.status, isHtmlAuthBridge: false, data: null };
    }
    try {
      const parsed = JSON.parse(trimmed) as T;
      return { ok: res.ok, status: res.status, isHtmlAuthBridge: false, data: parsed };
    } catch {
      return {
        ok: false,
        status: res.status,
        isHtmlAuthBridge: false,
        data: null,
        error: 'Format respons server bukan JSON yang valid.',
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      isHtmlAuthBridge: false,
      data: null,
      error: err?.message || 'Gagal menghubungi server',
    };
  }
}

// IndexedDB local media store for videos / large blobs (>850KB) that exceed Firestore 1MB document limit
const MEDIA_DB_NAME = 'ze_local_media_v1';
const MEDIA_STORE_NAME = 'media_blobs';

function openLocalMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(MEDIA_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const database = req.result;
      if (!database.objectStoreNames.contains(MEDIA_STORE_NAME)) {
        database.createObjectStore(MEDIA_STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB open error'));
  });
}

export async function saveLocalMediaBlob(key: string, dataUrl: string): Promise<boolean> {
  if (!key || !dataUrl) return false;
  try {
    const database = await openLocalMediaDb();
    await new Promise<void>((resolve, reject) => {
      const tx = database.transaction(MEDIA_STORE_NAME, 'readwrite');
      tx.objectStore(MEDIA_STORE_NAME).put(dataUrl, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    database.close();
    return true;
  } catch {
    return false;
  }
}

export async function getLocalMediaBlob(key: string): Promise<string | null> {
  if (!key) return null;
  try {
    const database = await openLocalMediaDb();
    const result = await new Promise<string | null>((resolve, reject) => {
      const tx = database.transaction(MEDIA_STORE_NAME, 'readonly');
      const req = tx.objectStore(MEDIA_STORE_NAME).get(key);
      req.onsuccess = () => resolve(typeof req.result === 'string' ? req.result : null);
      req.onerror = () => reject(req.error);
    });
    database.close();
    return result;
  } catch {
    return null;
  }
}

export async function deleteLocalMediaBlob(key: string): Promise<void> {
  if (!key) return;
  try {
    const database = await openLocalMediaDb();
    await new Promise<void>((resolve) => {
      const tx = database.transaction(MEDIA_STORE_NAME, 'readwrite');
      tx.objectStore(MEDIA_STORE_NAME).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
    database.close();
  } catch {}
}
