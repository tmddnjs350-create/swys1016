import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioPlayer';
import { Sparkles, Flame, Wind, Star, Heart, Check, RefreshCw, Send, Edit3, Trash2 } from 'lucide-react';

export const CakeGame: React.FC = () => {
  const [candles, setCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [allBlown, setAllBlown] = useState<boolean>(false);
  const [userWish, setUserWish] = useState<string>('');
  const [savedWish, setSavedWish] = useState<string>('');
  const [showWishInput, setShowWishInput] = useState<boolean>(false);
  const [cakeSlicesEaten, setCakeSlicesEaten] = useState<number>(0);
  const [biteReaction, setBiteReaction] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('yeon_soo_birthday_wish');
    if (saved) {
      setSavedWish(saved);
    }
  }, []);

  const handleCandleClick = (index: number) => {
    const newCandles = [...candles];
    newCandles[index] = !newCandles[index];
    setCandles(newCandles);
    audioEngine.playCutePop();

    const isAllOut = newCandles.every((c) => !c);
    if (isAllOut && !allBlown) {
      triggerBlownCelebration();
    }
  };

  const blowAllCandles = () => {
    setCandles([false, false, false, false, false]);
    triggerBlownCelebration();
  };

  const triggerBlownCelebration = () => {
    setAllBlown(true);
    audioEngine.playCandleBlow();

    confetti({
      particleCount: 130,
      spread: 95,
      origin: { y: 0.55 },
      colors: ['#f472b6', '#fda4af', '#fde047', '#c084fc', '#ffffff', '#fb7185'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#fda4af', '#f43f5e', '#fbbf24', '#ffffff'],
      });
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#fda4af', '#f43f5e', '#fbbf24', '#ffffff'],
      });
    }, 250);

    setShowWishInput(true);
  };

  const relightCandles = () => {
    setCandles([true, true, true, true, true]);
    setAllBlown(false);
    audioEngine.playCutePop();
  };

  const handleSaveWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userWish.trim()) return;
    localStorage.setItem('yeon_soo_birthday_wish', userWish.trim());
    setSavedWish(userWish.trim());
    setShowWishInput(false);
    setUserWish('');
    audioEngine.playConfettiPop();
    confetti({
      particleCount: 60,
      spread: 65,
      origin: { y: 0.6 },
    });
  };

  const handleDeleteWish = () => {
    localStorage.removeItem('yeon_soo_birthday_wish');
    setSavedWish('');
    setUserWish('');
    setShowWishInput(true);
    audioEngine.playCutePop();
  };

  const eatSlice = () => {
    const count = cakeSlicesEaten + 1;
    setCakeSlicesEaten(count);
    audioEngine.playCutePop();
    const reactions = [
      '🍓 달콤한 딸기랑 생크림 냠! 연수가 맛있게 먹는 모습이 제일 좋아',
      '🍰 승원이도 한 입 아~ "연수가 챙겨주니까 오늘따라 100배 더 달콤하네!"',
      '✨ 연수가 빈 소원은 내가 무슨 일이 있어도 꼭 다 이뤄줄게!',
      '😋 너무 달콤해서 연수 얼굴에 행복 미소가 가득 (볼 콕 찌르기)',
      '🎂 케이크 완판! 진짜 맛있는 생일 케이크 또 사줄게 🤍',
    ];
    setBiteReaction(reactions[(count - 1) % reactions.length]);
  };

  return (
    <div className="relative rounded-3xl bg-white/85 backdrop-blur-xl border border-pink-200/90 p-6 md:p-8 shadow-[0_15px_35px_rgba(244,114,182,0.12)] text-center overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-pink-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Header Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs font-bold mb-3 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
        <span>승원이가 준비한 생일 케이크</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 font-gowun">
        소원 빌고 촛불을 꺼봐 🎂
      </h2>
      <p className="text-slate-600 text-xs md:text-sm max-w-md mx-auto mb-6 leading-relaxed">
        촛불을 톡톡 누르거나 아래 버튼으로 후~ 불어봐!<br />
        연수가 비는 소원은 내가 무슨 일이 있어도 꼭 이뤄줄게 🤍
      </p>

      {/* Interactive Birthday Cake Container */}
      <div className="relative my-7 flex flex-col items-center justify-center">
        {/* Candle Glow Floor */}
        <div
          className={`absolute bottom-6 w-60 h-16 rounded-full blur-xl transition-opacity duration-700 pointer-events-none ${
            candles.some((c) => c) ? 'bg-amber-300/35 opacity-100' : 'bg-transparent opacity-0'
          }`}
        />

        {/* Candles Row */}
        <div className="flex items-end justify-center gap-4 md:gap-6 z-20 mb-[-12px]">
          {candles.map((isLit, idx) => {
            const candleColors = ['#fb7185', '#f472b6', '#c084fc', '#60a5fa', '#f59e0b'];
            return (
              <div
                key={idx}
                onClick={() => handleCandleClick(idx)}
                className="cursor-pointer group flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
                title={isLit ? '클릭해서 촛불 끄기' : '클릭해서 촛불 켜기'}
              >
                {/* Flame or Smoke */}
                <div className="h-9 flex items-center justify-center">
                  {isLit ? (
                    <div className="relative animate-flame">
                      <div className="w-4 h-6 rounded-full bg-gradient-to-t from-amber-400 via-orange-400 to-yellow-200 shadow-[0_0_15px_rgba(251,146,60,0.85)]" />
                      <div className="absolute top-1 left-1 w-1.5 h-2.5 rounded-full bg-white/90" />
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs animate-bounce">💨</div>
                  )}
                </div>

                {/* Wick */}
                <div className="w-0.5 h-2 bg-slate-500" />

                {/* Candle Stick */}
                <div
                  className="w-3 md:w-3.5 h-12 md:h-14 rounded-t-sm shadow-sm flex flex-col justify-between py-1 relative overflow-hidden"
                  style={{ backgroundColor: candleColors[idx] }}
                >
                  <div className="w-full h-1 bg-white/60 transform -rotate-12" />
                  <div className="w-full h-1 bg-white/60 transform -rotate-12" />
                  <div className="w-full h-1 bg-white/60 transform -rotate-12" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Cake Structure */}
        <div className="relative z-10 w-64 md:w-80">
          {/* Top Layer Cream & Strawberries */}
          <div className="relative h-14 md:h-16 rounded-t-3xl bg-gradient-to-b from-white via-rose-50 to-pink-100 border-t-2 border-pink-200 shadow-sm flex items-center justify-around px-4">
            <span className="text-xl md:text-2xl filter drop-shadow-sm">🍓</span>
            <span className="text-lg md:text-xl filter drop-shadow-sm">🤍</span>
            <span className="text-xl md:text-2xl filter drop-shadow-sm">🍓</span>
            <span className="text-lg md:text-xl filter drop-shadow-sm">🤍</span>
            <span className="text-xl md:text-2xl filter drop-shadow-sm">🍓</span>

            {/* Frosting drips */}
            <div className="absolute -bottom-2 inset-x-0 flex justify-between px-2 pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full bg-white shadow-sm"
                  style={{ transform: `scale(${0.8 + (i % 3) * 0.2})` }}
                />
              ))}
            </div>
          </div>

          {/* Middle Sponge Layer */}
          <div className="h-10 md:h-12 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-y border-pink-200/60 flex items-center justify-center">
            <span className="font-gaegu text-pink-500 font-bold text-lg md:text-xl tracking-wider">
              💖 연수야 생일 축하해 💖
            </span>
          </div>

          {/* Bottom Cake Base Layer */}
          <div className="h-14 md:h-16 rounded-b-2xl bg-gradient-to-b from-pink-100 via-rose-100 to-pink-200 border-b-4 border-pink-300 shadow-md flex items-center justify-around px-3">
            <span className="text-sm">🌸</span>
            <span className="text-xs text-rose-500 font-bold">10월 16일</span>
            <span className="text-sm">✨</span>
            <span className="text-xs text-rose-500 font-bold">승원이가</span>
            <span className="text-sm">🌸</span>
          </div>

          {/* Cake Stand Tray */}
          <div className="w-[115%] -ml-[7.5%] h-4 rounded-full bg-gradient-to-r from-slate-100 via-white to-slate-200 shadow-md border border-pink-200 mt-1" />
          <div className="w-24 h-4 mx-auto bg-gradient-to-b from-slate-200 to-slate-300 rounded-b-lg shadow-sm" />
        </div>
      </div>

      {/* Bite Reaction Toast */}
      {biteReaction && (
        <div className="my-3 inline-block px-4 py-2 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 text-xs md:text-sm animate-in fade-in zoom-in-95 duration-200 font-medium shadow-sm">
          {biteReaction}
        </div>
      )}

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        {candles.some((c) => c) ? (
          <button
            onClick={blowAllCandles}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-sm md:text-base shadow-[0_8px_20px_rgba(244,114,182,0.35)] hover:scale-105 active:scale-95 transition flex items-center gap-2 border-2 border-white/60"
          >
            <Wind className="w-4 h-4 animate-pulse" />
            <span>촛불 한번에 후~ 불기 💨</span>
          </button>
        ) : (
          <button
            onClick={relightCandles}
            className="px-5 py-2.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-medium text-xs md:text-sm border border-pink-200 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>촛불 다시 켜기 🔥</span>
          </button>
        )}

        <button
          onClick={eatSlice}
          className="px-5 py-2.5 rounded-full bg-white hover:bg-pink-50 text-slate-700 font-medium text-xs md:text-sm border border-pink-200 transition flex items-center gap-1.5 shadow-sm"
        >
          <span>🍰</span>
          <span>케이크 한 조각 먹기 ({cakeSlicesEaten}조각)</span>
        </button>
      </div>

      {/* Saved Wish or Wish Recording Box */}
      {showWishInput ? (
        <form onSubmit={handleSaveWish} className="mt-6 max-w-md mx-auto p-4 rounded-2xl bg-white border border-pink-200 shadow-md animate-in zoom-in-95 duration-200">
          <p className="text-xs text-pink-600 font-bold mb-2">⭐ 연수가 빈 소원을 적어줘! 내가 꼭 기억할게</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={userWish}
              onChange={(e) => setUserWish(e.target.value)}
              placeholder="예: 올해도 승원이랑 맛있는 거 많이 먹고 행복하기!"
              className="flex-1 bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-400"
              maxLength={60}
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs md:text-sm hover:bg-pink-600 transition flex items-center gap-1 shadow-sm shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>저장</span>
            </button>
            {savedWish && (
              <button
                type="button"
                onClick={() => setShowWishInput(false)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition"
              >
                취소
              </button>
            )}
          </div>
        </form>
      ) : savedWish ? (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200/80 max-w-md mx-auto shadow-sm">
          <div className="flex items-center justify-center gap-1 text-xs text-pink-600 font-bold mb-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
            <span>연수가 적어둔 10월 16일 생일 소원</span>
          </div>
          <p className="text-slate-800 text-base md:text-lg font-gaegu font-bold my-1">
            "{savedWish}"
          </p>
          <div className="flex items-center justify-center gap-2.5 mt-2.5">
            <button
              type="button"
              onClick={() => {
                setUserWish(savedWish);
                setShowWishInput(true);
                audioEngine.playCutePop();
              }}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-pink-200 text-xs text-pink-600 font-bold transition flex items-center gap-1 shadow-sm active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>소원 수정하기</span>
            </button>
            <button
              type="button"
              onClick={handleDeleteWish}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-rose-50 border border-pink-200 text-xs text-slate-500 hover:text-rose-500 font-medium transition flex items-center gap-1 shadow-sm active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>지우고 새로 적기</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
