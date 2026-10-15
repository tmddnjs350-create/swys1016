import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioPlayer';
import { musicManager } from '../utils/musicManager';
import { Sparkles, Heart, Music, ArrowRight, Stars, Upload, CheckCircle2 } from 'lucide-react';

interface IntroScreenProps {
  onEnter: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [musicState, setMusicState] = useState(musicManager.getState());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = musicManager.subscribe((st) => setMusicState(st));
    return () => unsub();
  }, []);

  const handleEnterClick = async () => {
    await audioEngine.unlock();
    await musicManager.play();
    audioEngine.playConfettiPop();

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fda4af', '#fef08a', '#c084fc', '#ffffff', '#fb7185'],
    });

    onEnter();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setToastMessage('🎵 노래를 서버에 등록하는 중입니다...');
      const res = await musicManager.uploadAndSetCustomTrack(file);
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 5000);
    }
    e.target.value = '';
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-[#fff0f5] via-[#fff5f8] to-[#fdf2f8]">
      {/* Dreamy Pastel Background Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft floating pastel orbs */}
        <div className="absolute top-1/6 left-1/4 w-96 h-96 bg-pink-200/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/5 right-1/4 w-[28rem] h-[28rem] bg-rose-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/6 w-80 h-80 bg-amber-100/60 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-1/8 w-72 h-72 bg-purple-100/50 rounded-full blur-2xl" />

        {/* Delicate floating sparkles */}
        {[
          { top: '12%', left: '15%', delay: '0s', text: '🌸', size: 'text-lg' },
          { top: '22%', left: '82%', delay: '1.2s', text: '✨', size: 'text-base' },
          { top: '68%', left: '12%', delay: '0.8s', text: '🤍', size: 'text-sm' },
          { top: '78%', left: '85%', delay: '2s', text: '🍓', size: 'text-lg' },
          { top: '40%', left: '90%', delay: '0.5s', text: '✨', size: 'text-sm' },
          { top: '15%', left: '65%', delay: '1.7s', text: '🍰', size: 'text-base' },
          { top: '55%', left: '6%', delay: '2.3s', text: '✦', size: 'text-xs text-pink-400' },
        ].map((item, i) => (
          <div
            key={i}
            className={`absolute animate-float opacity-70 ${item.size}`}
            style={{ top: item.top, left: item.left, animationDelay: item.delay }}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Top Right Quick Music Setup Button */}
      <div className="absolute top-4 right-4 z-20">
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-pink-600 border border-pink-200 shadow-sm backdrop-blur-md text-xs font-bold flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer"
          title="배경음악 파일(MP3)을 서버에 업로드/등록합니다"
        >
          <Upload className="w-3.5 h-3.5 text-pink-500" />
          <span>{musicState.isCustom ? '🎵 노래 변경' : '🎵 노래(MP3) 넣기'}</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 z-50 max-w-sm mx-auto px-4 py-3 rounded-2xl bg-white/95 text-slate-800 border-2 border-pink-300 shadow-xl backdrop-blur-md text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-4 fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Pastel Glass Invitation Card */}
      <div className="relative z-10 max-w-xl w-full text-center">
        {/* Floating Chiikawa Usagi Mascot Card */}
        <div className="relative inline-block mb-6 animate-float">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 p-1 shadow-[0_15px_35px_rgba(244,114,182,0.25)] border-4 border-white flex items-center justify-center overflow-hidden">
            <img
              src="/images/usagi_chiikawa.jpg"
              alt="먼작귀 우사기"
              className="w-full h-full object-cover rounded-full transform hover:scale-110 transition duration-300"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold shadow-md shadow-pink-300/60 flex items-center gap-1 border-2 border-white">
            <Sparkles className="w-3 h-3" /> 10월 16일
          </span>
        </div>

        {/* Date Badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-pink-200/80 backdrop-blur-md text-pink-600 text-xs sm:text-sm font-semibold shadow-sm">
          <Stars className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
          <span>세상에서 가장 특별한 연수의 생일날</span>
        </div>

        {/* Celebratory Greeting */}
        <div className="mb-5">
          <h1 className="font-gaegu text-5xl sm:text-6xl md:text-7xl font-bold text-pink-500 leading-tight drop-shadow-sm">
            &ldquo;연수야 연수야~ 생일 축하해!&rdquo;
          </h1>
          <p className="mt-2 text-xl sm:text-2xl font-bold text-slate-800 font-gowun">
            사랑하는 연수를 위해 준비한 작은 선물 💌
          </p>
        </div>

        {/* Natural, Real Couple Intro Body Text */}
        <div className="bg-white/80 backdrop-blur-md border border-pink-200/60 rounded-3xl p-5 sm:p-6 mb-8 shadow-[0_10px_30px_rgba(244,114,182,0.12)] text-slate-700 text-sm sm:text-base leading-relaxed space-y-2">
          <p>
            연수야아~ 생일 진심으로 축하해! 🎂
          </p>
          <p className="text-slate-600 text-xs sm:text-sm">
            오늘 하루 어떻게 축하해 주면 연수가 더 활짝 웃을까 생각하다가, <br className="hidden sm:inline" />
            아기자기한 축하 웹페이지를 하나하나 만들어봤어.<br />
            케이크 촛불도 불어보고, 내가 준비한 쿠폰이랑 장난들도 편하게 둘러봐 🤍
          </p>
        </div>

        {/* Enter Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleEnterClick}
            className="group relative px-8 py-4 sm:px-10 sm:py-4.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-base sm:text-lg shadow-[0_10px_25px_rgba(244,114,182,0.4)] hover:shadow-[0_15px_30px_rgba(244,114,182,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 border-2 border-white/60 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
            <span>승원이가 만든 페이지 둘러보기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-2 text-xs text-pink-500 font-medium mt-1">
            <Music className="w-3.5 h-3.5 animate-pulse text-pink-400" />
            <span>
              {musicState.isCustom
                ? `🎵 ${musicState.trackTitle} (자동 무한 재생)`
                : '들어가면 멜로디가 나와! 🎵'}
            </span>
          </div>
        </div>

        {/* Warm Creator Stamp */}
        <div className="mt-10 pt-5 border-t border-pink-200/60 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>준비한 사람: <strong>최승원</strong></span>
          <span>•</span>
          <span className="text-pink-600 font-medium">To. 가장 사랑하는 연수</span>
        </div>
      </div>
    </div>
  );
};
