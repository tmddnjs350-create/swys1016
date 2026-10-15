import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioPlayer';
import { Gift, Sparkles, Heart, PackageOpen, ArrowRight } from 'lucide-react';

interface GiftBoxGameProps {
  onGoToQuests: () => void;
}

export const GiftBoxGame: React.FC<GiftBoxGameProps> = ({ onGoToQuests }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const handleOpenBox = () => {
    if (isOpen) {
      setIsOpen(false);
      audioEngine.playCutePop();
      return;
    }

    setIsShaking(true);
    audioEngine.playCutePop();

    setTimeout(() => {
      setIsShaking(false);
      setIsOpen(true);
      audioEngine.playConfettiPop();

      confetti({
        particleCount: 95,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fda4af', '#fde047', '#c084fc', '#ffffff'],
      });
    }, 450);
  };

  return (
    <div className="relative rounded-3xl bg-white/85 backdrop-blur-xl border border-pink-200/90 p-6 md:p-8 shadow-[0_15px_35px_rgba(244,114,182,0.12)] text-center overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-600 text-xs font-bold mb-3 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
        <span>승원이가 준비한 깜짝 선물 상자</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 font-gowun">
        상자를 톡톡 열어봐 🎁
      </h2>
      <p className="text-slate-600 text-xs md:text-sm max-w-md mx-auto mb-6 leading-relaxed">
        상자를 누르면 오늘 하루 연수를 위해 준비한<br />
        소소하고 특별한 혜택들이 쏟아져 나와!
      </p>

      {/* Interactive 3D Gift Box */}
      <div className="relative my-6 flex flex-col items-center justify-center">
        <div
          onClick={handleOpenBox}
          className={`cursor-pointer group relative select-none transition-transform duration-300 ${
            isShaking ? 'animate-bounce' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {isOpen ? (
            /* Opened Box View */
            <div className="relative flex flex-col items-center">
              <div className="text-5xl md:text-6xl animate-bounce mb-2">🎉</div>

              <div className="w-48 md:w-56 h-32 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-400 to-pink-500 border-2 border-white shadow-[0_10px_25px_rgba(244,114,182,0.3)] p-4 flex flex-col items-center justify-center text-white relative">
                <div className="absolute -top-3 left-6 w-8 h-8 rounded-full bg-amber-300 shadow-md flex items-center justify-center text-xs">
                  ✨
                </div>
                <div className="absolute -top-3 right-6 w-8 h-8 rounded-full bg-amber-300 shadow-md flex items-center justify-center text-xs">
                  💖
                </div>
                <PackageOpen className="w-10 h-10 text-amber-200 mb-1" />
                <span className="font-bold text-sm md:text-base">선물 상자 개봉 완료!</span>
                <span className="text-[11px] text-pink-100">연수만을 위한 특별 바우처</span>
              </div>
            </div>
          ) : (
            /* Closed Box with Ribbons */
            <div className="relative w-44 md:w-52 h-44 md:h-52 flex flex-col items-center justify-center">
              {/* Ribbon Bow */}
              <div className="relative z-20 flex items-center justify-center -mb-3">
                <div className="w-10 h-7 rounded-full bg-amber-300 border border-amber-400 shadow-sm -mr-1 rotate-[-25deg]" />
                <div className="w-5 h-5 rounded-full bg-amber-400 z-10 shadow-inner flex items-center justify-center text-[10px]">
                  🎀
                </div>
                <div className="w-10 h-7 rounded-full bg-amber-300 border border-amber-400 shadow-sm -ml-1 rotate-[25deg]" />
              </div>

              {/* Box Lid */}
              <div className="relative z-10 w-44 md:w-52 h-10 rounded-t-2xl bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 border-2 border-white shadow-sm flex items-center justify-center">
                <div className="w-7 h-full bg-amber-300 shadow-sm" />
              </div>

              {/* Box Main Body */}
              <div className="w-40 md:w-48 h-32 rounded-b-2xl bg-gradient-to-b from-rose-300 via-pink-400 to-rose-400 border-2 border-t-0 border-white shadow-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-x-0 h-6 bg-amber-300 shadow-sm" />
                <div className="absolute inset-y-0 w-6 bg-amber-300 shadow-sm" />

                {/* Gift tag */}
                <div className="relative z-10 px-3 py-1.5 rounded-lg bg-white/95 text-slate-800 text-[11px] font-bold shadow-md border border-amber-200 transform rotate-[-6deg] group-hover:rotate-0 transition">
                  <span className="text-pink-600">To. 연수</span> ❤️
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-pink-500 font-medium mt-3">
          {isOpen ? '상자를 다시 닫으려면 클릭해봐' : '👆 상자를 눌러서 열어봐!'}
        </p>
      </div>

      {/* Revealed Gift Cards Content */}
      {isOpen && (
        <div className="mt-6 space-y-3 max-w-lg mx-auto text-left animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="p-3.5 rounded-2xl bg-pink-50/80 border border-pink-200/90 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-xl shrink-0">
              👑
            </div>
            <div className="flex-1">
              <h4 className="text-xs md:text-sm font-bold text-slate-800">1. 오늘 하루 '연수 공주님 프리패스권'</h4>
              <p className="text-[11px] text-slate-600">먹고 싶은 것, 가고 싶은 곳 전부 승원이가 군말 없이 다 맞춰주기</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl shrink-0">
              💳
            </div>
            <div className="flex-1">
              <h4 className="text-xs md:text-sm font-bold text-slate-800">2. 승원이 소유권 </h4>
              <p className="text-[11px] text-slate-600">연수가 하고 싶은거 다해!</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200/90 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl shrink-0">
              🤗
            </div>
            <div className="flex-1">
              <h4 className="text-xs md:text-sm font-bold text-slate-800">3. 따뜻한 포옹 무제한 이용권</h4>
              <p className="text-[11px] text-slate-600">연수가 충전 필요할 땐 언제든 승원이 품으로 쏙 안길 수 있는 권리</p>
            </div>
          </div>

          {/* CTA to Quest Page */}
          <div className="pt-2 text-center">
            <button
              onClick={onGoToQuests}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs md:text-sm shadow-md hover:scale-105 active:scale-95 transition border border-white"
            >
              <span>내가 준비한 미션 쿠폰들도 보러 가기!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
