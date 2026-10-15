import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from './utils/audioPlayer';
import { IntroScreen } from './components/IntroScreen';
import { CakeGame } from './components/CakeGame';
import { GiftBoxGame } from './components/GiftBoxGame';
import { QuestSection } from './components/QuestSection';
import { RoadGame } from './components/RoadGame';
import { PhotoAlbum } from './components/PhotoAlbum';
import { YeonSooProfile } from './components/YeonSooProfile';
import { LetterSection } from './components/LetterSection';
import { UsagiMusicPlayer } from './components/UsagiMusicPlayer';
import { musicManager } from './utils/musicManager';
import {
  Cake,
  Gift,
  Compass,
  Camera,
  Mail,
  Home,
  Sparkles,
  Heart,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Music,
} from 'lucide-react';

type Tab = 'intro' | 'home' | 'quest' | 'road' | 'photos' | 'profile' | 'letter';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('intro');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Automatically scroll to the top whenever entering any tab (mission, photo album, letter, etc.)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const frameId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    // Second check after images/layout finish mounting
    const timerId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 60);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
    };
  }, [currentTab]);

  // Mobile Web Audio API unlock on initial user touch or click
  useEffect(() => {
    const unlockOnGesture = () => {
      musicManager.unlockAudio();
    };
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
    window.addEventListener('touchend', unlockOnGesture, { passive: true });
    window.addEventListener('click', unlockOnGesture, { passive: true });
    return () => {
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('touchend', unlockOnGesture);
      window.removeEventListener('click', unlockOnGesture);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = musicManager.subscribe((st) => {
      setIsPlaying(st.isPlaying);
    });
    return () => unsubscribe();
  }, []);

  const handleTabChange = (tab: Tab) => {
    audioEngine.playCutePop();
    setCurrentTab(tab);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const navItems = [
    { id: 'home' as Tab, label: '홈', desktopLabel: '홈 & 케이크', icon: Home },
    { id: 'quest' as Tab, label: '미션', desktopLabel: '미션 & 쿠폰', icon: Gift },
    { id: 'road' as Tab, label: '오는길', desktopLabel: '오는 길', icon: Compass },
    { id: 'photos' as Tab, label: '사진첩', desktopLabel: '사진첩', icon: Camera },
    { id: 'profile' as Tab, label: '도감', desktopLabel: '연수 도감', icon: BookOpen },
    { id: 'letter' as Tab, label: '편지', desktopLabel: '생일 편지', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#fff8fa] text-slate-800 flex flex-col relative selection:bg-pink-300 selection:text-pink-950 font-gowun">
      {/* Background Soft Pastel Aurora Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-pink-100/60 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-rose-100/50 blur-[130px]" />
        <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-purple-100/40 blur-[120px]" />

        {/* Floating gentle sparkles */}
        <div className="absolute top-1/4 left-1/12 text-pink-300 text-xs animate-ping opacity-60">✦</div>
        <div className="absolute top-2/3 right-1/12 text-amber-300 text-xs animate-ping opacity-60" style={{ animationDelay: '1s' }}>✦</div>
        <div className="absolute top-1/2 left-3/4 text-rose-300 text-sm animate-ping opacity-60" style={{ animationDelay: '2s' }}>✦</div>
      </div>

      {/* Floating Usagi Rotating Music Player (Always Available & Sits Above Mobile Bottom Bar) */}
      <UsagiMusicPlayer />

      {/* Render Intro Screen or Main App */}
      {currentTab === 'intro' ? (
        <IntroScreen onEnter={() => handleTabChange('home')} />
      ) : (
        <div className="relative z-10 flex-1 flex flex-col pb-24 md:pb-6">
          {/* Top Header */}
          <header
            className={`sticky top-0 z-30 transition-all duration-300 ${
              scrolled
                ? 'bg-white/95 backdrop-blur-xl border-b border-pink-100 py-2 shadow-[0_4px_20px_rgba(244,114,182,0.08)]'
                : 'bg-transparent py-3'
            }`}
          >
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
              {/* Logo / Title */}
              <div
                onClick={() => handleTabChange('home')}
                className="cursor-pointer flex items-center gap-2 group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-base sm:text-lg shadow-md shadow-pink-200 group-hover:scale-105 transition text-white">
                  🎂
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-gaegu text-lg sm:text-2xl font-bold text-slate-800 group-hover:text-pink-500 transition">
                      연수의 생일
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold">
                      10.16
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400">승원 ♥ 연수</p>
                </div>
              </div>

              {/* Navigation Links for Desktop */}
              <nav className="hidden md:flex items-center gap-1 bg-white/80 p-1.5 rounded-2xl border border-pink-100 shadow-sm backdrop-blur-md">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-pink-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.desktopLabel}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2">
                {/* Header BGM quick toggle (easy on mobile & desktop) */}
                <button
                  onClick={() => musicManager.toggle()}
                  className={`px-2.5 py-1.5 rounded-full border transition text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    isPlaying
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white border-pink-300'
                      : 'bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100'
                  }`}
                  title={isPlaying ? '음악 일시정지' : '음악 재생'}
                >
                  <span className={`text-xs ${isPlaying ? 'animate-spin-slow' : ''}`}>🐰</span>
                  <span className="text-[11px] font-bold">{isPlaying ? 'BGM ON' : 'BGM OFF'}</span>
                </button>

                <button
                  onClick={() => {
                    audioEngine.playConfettiPop();
                    confetti({ particleCount: 60, spread: 65 });
                  }}
                  className="px-2.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-600 hover:bg-pink-100 transition text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95"
                  title="축하 폭죽 터뜨리기"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span className="hidden sm:inline">축하 폭죽</span>
                </button>

                <button
                  onClick={() => setCurrentTab('intro')}
                  className="p-1.5 rounded-full bg-white border border-pink-200 text-slate-400 hover:text-slate-700 transition text-xs shadow-sm active:scale-95"
                  title="첫 인트로 화면으로"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="max-w-6xl mx-auto px-3.5 sm:px-4 py-4 sm:py-8 flex-1 w-full">
            {currentTab === 'home' && (
              <div className="space-y-8 sm:space-y-10">
                {/* Hero Greeting Banner */}
                <div className="relative rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50/60 border border-pink-200/90 p-5 sm:p-8 md:p-10 shadow-[0_15px_35px_rgba(244,114,182,0.12)] overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2.5 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-pink-600 text-[11px] sm:text-xs font-bold border border-pink-200 shadow-sm">
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                      <span>10월 16일 • 연수만을 위한 생일 파티</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight">
                      사랑하는 연수야,<br />
                      <span className="font-gaegu text-3xl sm:text-5xl md:text-6xl text-pink-500">
                        생일 진심으로 축하해! 🎂
                      </span>
                    </h1>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      연수가 활짝 웃는 모습을 상상하면서 손수 만든 작은 공간이야.<br className="hidden sm:inline" />
                      케이크 촛불도 불어보고, 선물 상자랑 미션, 도감도 가볍게 둘러봐 🤍
                    </p>
                  </div>

                  {/* Profile Card */}
                  <div className="p-4 rounded-3xl bg-white/95 border border-pink-200 text-center shrink-0 w-full sm:w-64 shadow-[0_10px_25px_rgba(244,114,182,0.12)]">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-pink-200 to-amber-100 p-1 mb-2 shadow-sm border-2 border-white overflow-hidden">
                      <img
                        src="/images/usagi_sunset.jpg"
                        alt="치이카와 우사기"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">오늘의 생일 주인공</h3>
                    <p className="text-xs text-pink-600 font-bold">연수 공주님 💖</p>
                    <div className="mt-2.5 pt-2.5 border-t border-pink-100 text-[11px] text-slate-500 space-y-0.5">
                      <p>🤍 평생 짝꿍: 최승원</p>
                      <p>✨ 오늘 행복 지수: 100% 완충</p>
                    </div>
                  </div>
                </div>

                {/* Cake Mini-Game & Gift Box Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
                  <CakeGame />
                  <GiftBoxGame onGoToQuests={() => handleTabChange('quest')} />
                </div>

                {/* Navigation Menu Cards Hub */}
                <div className="space-y-4 pt-2">
                  <div className="text-center">
                    <h3 className="text-lg sm:text-2xl font-bold text-slate-800 font-gowun">
                      승원이가 준비한 코너들 둘러보기 🗺️
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      편하게 눌러서 하나씩 구경해 봐!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {/* Card 1: Quests */}
                    <div
                      onClick={() => handleTabChange('quest')}
                      className="group cursor-pointer p-3.5 sm:p-4.5 rounded-2xl bg-white/90 border border-pink-200 hover:border-pink-300 hover:shadow-md transition transform active:scale-95 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg mb-2 shadow-sm">
                          🎮
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">1. 미션 & 쿠폰</h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug line-clamp-2">
                          웃어주기 등 미션 깨고 뽀뽀권 챙기기!
                        </p>
                      </div>
                      <div className="pt-2 flex items-center gap-1 text-[10px] sm:text-[11px] text-pink-600 font-bold">
                        <span>미션 가기 ➔</span>
                      </div>
                    </div>

                    {/* Card 2: Road to me */}
                    <div
                      onClick={() => handleTabChange('road')}
                      className="group cursor-pointer p-3.5 sm:p-4.5 rounded-2xl bg-white/90 border border-amber-200 hover:border-amber-300 hover:shadow-md transition transform active:scale-95 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg mb-2 shadow-sm">
                          🧭
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">2. 걸어오는 길</h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug line-clamp-2">
                          어떤 길을 골라도 승원이 품으로!
                        </p>
                      </div>
                      <div className="pt-2 flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-600 font-bold">
                        <span>길 찾기 ➔</span>
                      </div>
                    </div>

                    {/* Card 3: Photos */}
                    <div
                      onClick={() => handleTabChange('photos')}
                      className="group cursor-pointer p-3.5 sm:p-4.5 rounded-2xl bg-white/90 border border-purple-200 hover:border-purple-300 hover:shadow-md transition transform active:scale-95 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg mb-2 shadow-sm">
                          📸
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">3. 사진 & 예약석</h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug line-clamp-2">
                          함께한 순간과 앞으로의 예약석!
                        </p>
                      </div>
                      <div className="pt-2 flex items-center gap-1 text-[10px] sm:text-[11px] text-purple-600 font-bold">
                        <span>사진 보기 ➔</span>
                      </div>
                    </div>

                    {/* Card 4: YeonSoo Profile */}
                    <div
                      onClick={() => handleTabChange('profile')}
                      className="group cursor-pointer p-3.5 sm:p-4.5 rounded-2xl bg-white/90 border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition transform active:scale-95 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mb-2 shadow-sm">
                          📖
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">4. 연수 도감</h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug line-clamp-2">
                          연수의 귀여운 버릇과 말투 분석!
                        </p>
                      </div>
                      <div className="pt-2 flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-600 font-bold">
                        <span>도감 보기 ➔</span>
                      </div>
                    </div>

                    {/* Card 5: Letter */}
                    <div
                      onClick={() => handleTabChange('letter')}
                      className="col-span-2 sm:col-span-1 group cursor-pointer p-3.5 sm:p-4.5 rounded-2xl bg-white/90 border border-rose-200 hover:border-rose-300 hover:shadow-md transition transform active:scale-95 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-lg mb-2 shadow-sm">
                          💌
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">5. 생일 편지</h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug line-clamp-2">
                          승원이의 진심 가득한 생일 편지.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center gap-1 text-[10px] sm:text-[11px] text-rose-600 font-bold">
                        <span>편지 읽기 ➔</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'quest' && <QuestSection />}
            {currentTab === 'road' && <RoadGame onGoToPhotos={() => handleTabChange('photos')} />}
            {currentTab === 'photos' && <PhotoAlbum onGoToProfile={() => handleTabChange('profile')} />}
            {currentTab === 'profile' && <YeonSooProfile onGoToLetter={() => handleTabChange('letter')} />}
            {currentTab === 'letter' && <LetterSection />}
          </main>

          {/* Sweet Desktop Footer */}
          <footer className="hidden md:block mt-auto py-8 border-t border-pink-100 bg-white/60 text-center text-xs text-slate-500">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>2026. 10. 16 • 연수를 위해 승원이가 온 마음을 다해 만든 공간</span>
              </div>
              <div className="text-slate-500">
                To. <strong className="text-pink-600">세상에서 제일 사랑하는 연수에게</strong>
              </div>
            </div>
          </footer>

          {/* Dedicated Mobile Bottom Navigation Bar (App-like & Super Convenient) */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-pink-200/90 py-1.5 px-2 shadow-[0_-5px_20px_rgba(244,114,182,0.12)] flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition duration-200 active:scale-95 ${
                    isActive ? 'text-pink-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      isActive ? 'bg-pink-100 text-pink-600 shadow-sm' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
