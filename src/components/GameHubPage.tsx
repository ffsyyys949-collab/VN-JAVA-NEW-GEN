import React, { useState } from 'react';
import { ArrowLeft, Gamepad2, Play, Search, Swords, X } from 'lucide-react';
import { DotGameLogo } from './DotGameLogo';
import { StickmanWarApp } from './stickman/StickmanWarApp';

interface GameHubPageProps {
  onBack: () => void;
  initialGame?: string;
  currentUser?: any;
  diamondBalance?: number;
}

export function GameHubPage({
  onBack,
  initialGame,
  currentUser,
  diamondBalance = 0
}: GameHubPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState<string | null>(
    initialGame === 'stickman-war' ? 'stickman-war' : null
  );

  if (activeGame === 'stickman-war') {
    return (
      <StickmanWarApp
        currentUser={currentUser}
        initialDiamondBalance={diamondBalance}
        onExit={() => setActiveGame(null)}
      />
    );
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesStickman =
    !normalizedQuery ||
    'stickman war'.includes(normalizedQuery) ||
    'stickman'.includes(normalizedQuery) ||
    'war'.includes(normalizedQuery) ||
    'duel'.includes(normalizedQuery) ||
    'boss'.includes(normalizedQuery) ||
    'pvp'.includes(normalizedQuery);

  return (
    <div className="fixed inset-0 z-[10010] bg-[#070b14] flex flex-col text-white select-none">
      {/* Header Game */}
      <header className="px-4 py-3.5 bg-[#0a0f1c] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition active:scale-95 cursor-pointer shrink-0"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <DotGameLogo size={24} glow={true} />
            <h1 className="text-base font-black tracking-wide text-white truncate">
              Game
            </h1>
          </div>
        </div>
      </header>

      {/* Halaman Pencarian Game */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5 bg-[#070b14] shrink-0">
        <div className="max-w-md mx-auto relative flex items-center">
          <Search
            size={16}
            className="absolute left-3.5 text-zinc-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari game..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white/[0.06] border border-white/12 text-xs sm:text-sm text-white placeholder-zinc-400 outline-none focus:border-white/30 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 cursor-pointer"
              title="Hapus pencarian"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Daftar Game */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        {matchesStickman ? (
          <div className="max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveGame('stickman-war')}
              className="w-full text-left rounded-3xl overflow-hidden border border-amber-400/35 bg-gradient-to-br from-[#160f0c] via-[#0c111d] to-[#080b12] shadow-[0_14px_40px_rgba(0,0,0,0.65)] hover:border-amber-300 transition active:scale-[0.99] cursor-pointer group"
            >
              {/* Banner Ilustrasi Stickman War */}
              <div className="relative h-44 w-full overflow-hidden bg-[#070a12] flex items-center justify-center border-b border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(234,88,12,0.32),rgba(15,23,42,0.88)_65%,#05070c_100%)]" />
                <svg
                  viewBox="0 0 400 180"
                  className="relative z-10 w-full h-full"
                  aria-label="Ilustrasi Stickman War"
                >
                  {/* Silhouettes of fortress ruins */}
                  <path
                    d="M0 180 L0 120 L35 120 L35 98 L55 98 L55 128 L120 142 L280 142 L335 110 L360 110 L360 130 L400 130 L400 180 Z"
                    fill="#04060a"
                    opacity="0.85"
                  />
                  {/* Red-Black Flaming Wings */}
                  <path
                    d="M196 95 C160 55, 118 44, 102 68 C118 82, 146 92, 186 105 Z"
                    fill="#dc2626"
                    opacity="0.82"
                  />
                  <path
                    d="M204 95 C240 55, 282 44, 298 68 C282 82, 254 92, 214 105 Z"
                    fill="#dc2626"
                    opacity="0.82"
                  />
                  <path
                    d="M196 98 C166 72, 134 65, 116 82 C136 92, 162 100, 188 106 Z"
                    fill="#18181b"
                  />
                  <path
                    d="M204 98 C234 72, 266 65, 284 82 C264 92, 238 100, 212 106 Z"
                    fill="#18181b"
                  />
                  {/* Stickman Warrior Center */}
                  <circle cx="200" cy="64" r="14" fill="#09090b" stroke="#f59e0b" strokeWidth="2.5" />
                  <path d="M195 62 L201 64 L205 62" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <line x1="200" y1="78" x2="200" y2="118" stroke="#f8fafc" strokeWidth="5.5" strokeLinecap="round" />
                  <line x1="200" y1="118" x2="180" y2="152" stroke="#f8fafc" strokeWidth="5.5" strokeLinecap="round" />
                  <line x1="200" y1="118" x2="222" y2="152" stroke="#f8fafc" strokeWidth="5.5" strokeLinecap="round" />
                  <line x1="200" y1="88" x2="174" y2="104" stroke="#f8fafc" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="200" y1="88" x2="228" y2="102" stroke="#f8fafc" strokeWidth="4.5" strokeLinecap="round" />
                  {/* Flaming Gold Sword */}
                  <line x1="226" y1="103" x2="282" y2="56" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
                  <line x1="222" y1="97" x2="233" y2="110" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
                  <path
                    d="M242 90 C256 72, 272 56, 288 48 C280 68, 266 84, 246 95 Z"
                    fill="#fb923c"
                    opacity="0.85"
                  />
                  {/* Water Splash Accents */}
                  <circle cx="255" cy="96" r="3" fill="#38bdf8" />
                  <circle cx="272" cy="78" r="2.5" fill="#7dd3fc" />
                </svg>

                <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-[10px] font-black uppercase tracking-wider text-amber-200">
                  Action 2D · Landscape
                </div>
              </div>

              {/* Info & Tombol Mainkan */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Swords size={17} className="text-amber-400 shrink-0" />
                    <h2 className="text-base font-black tracking-wide text-white uppercase truncate">
                      STICKMAN WAR
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1 leading-snug">
                    1vs1 Online, Duel vs AI &amp; Petualangan Boss. Koleksi senjata, putar Gacha &amp; raih Skin Legendaris!
                  </p>
                </div>

                <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_6px_20px_rgba(249,115,22,0.45)] group-hover:brightness-110 shrink-0">
                  <Play size={14} fill="currentColor" />
                  <span>Main</span>
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-400 mb-3">
              <Gamepad2 size={30} />
            </div>
            <p className="text-sm font-bold text-zinc-300">Game tidak ditemukan</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default GameHubPage;
