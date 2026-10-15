import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioPlayer';
import { Compass, MapPin, Sparkles, Heart, RefreshCw, ArrowRight, Footprints } from 'lucide-react';

interface Stage {
  title: string;
  subtitle: string;
  optionA: {
    title: string;
    description: string;
    icon: string;
    flavor: string;
  };
  optionB: {
    title: string;
    description: string;
    icon: string;
    flavor: string;
  };
}

const STAGES: Stage[] = [
  {
    title: '1단계: 연수의 퇴근길 / 데이트 가는 길 🐾',
    subtitle: '문밖을 나선 연수! 첫 번째 갈림길이 나왔어. 어디로 걸어가 볼래?',
    optionA: {
      title: '오른쪽 길로 갈래',
      description: '☕ 달콤한 바닐라 라떼 향이 솔솔 풍기는 아늑한 카페 골목',
      icon: '☕',
      flavor: '달콤한 커피 향에 기분이 몽글몽글해졌어.',
    },
    optionB: {
      title: '왼쪽 길로 갈래',
      description: '🐱 뽀송뽀송 귀여운 아기 치즈 고양이가 "야옹~" 반겨주는 길',
      icon: '🐱',
      flavor: '고양이의 귀여움에 심장이 사르르 녹아내렸어.',
    },
  },
  {
    title: '2단계: 주변이 은은하게 설레는 두 번째 갈림길 ✨',
    subtitle: '길을 걷다 보니 주변이 핑크빛으로 반짝거리기 시작했어!',
    optionA: {
      title: '오른쪽 길로 갈래',
      description: '🍓 연수가 제일 좋아하는 딸기 생크림 케이크랑 마카롱이 가득한 길',
      icon: '🍓',
      flavor: '달콤한 디저트 생각에 절로 미소가 지어졌어.',
    },
    optionB: {
      title: '왼쪽 길로 갈래',
      description: '☁️ 솜사탕 구름이 둥실 떠 있고 별빛이 반짝이는 낭만적인 밤하늘 길',
      icon: '☁️',
      flavor: '동화 속 세상으로 걸어 들어온 것 같아.',
    },
  },
  {
    title: '3단계: 마지막 갈림길! 심장이 콩닥콩닥 💓',
    subtitle: '저 멀리서 연수를 부르는 듯한 익숙하고 다정한 목소리가 들려와.',
    optionA: {
      title: '오른쪽 꽃길로 갈래',
      description: '🌸 은은한 꽃향기가 흩날리고 따뜻한 가로등이 비추는 낭만 꽃길',
      icon: '🌸',
      flavor: '한 걸음 내딛을 때마다 꽃잎이 살랑살랑 흩날려.',
    },
    optionB: {
      title: '왼쪽 지름길로 갈래',
      description: '🌌 별들이 쏟아질 것만 같은 신비롭고 반짝이는 지름길',
      icon: '🌌',
      flavor: '별빛들이 발걸음을 환하게 비춰주고 있어.',
    },
  },
];

interface RoadGameProps {
  onGoToPhotos: () => void;
}

export const RoadGame: React.FC<RoadGameProps> = ({ onGoToPhotos }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [choiceHistory, setChoiceHistory] = useState<string[]>([]);
  const [flavorText, setFlavorText] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleChoice = (direction: '오른쪽' | '왼쪽', flavor: string) => {
    audioEngine.playCutePop();
    setFlavorText(flavor);
    const newHistory = [...choiceHistory, direction];
    setChoiceHistory(newHistory);

    if (currentStep < STAGES.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setCurrentStep(STAGES.length);
        audioEngine.playConfettiPop();
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#fda4af', '#fde047', '#38bdf8', '#ffffff'],
        });
      }, 700);
    }
  };

  const handleReset = () => {
    audioEngine.playCutePop();
    setCurrentStep(0);
    setChoiceHistory([]);
    setFlavorText('');
    setIsCalculating(false);
  };

  const isFinal = currentStep >= STAGES.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner */}
      <div className="relative rounded-3xl bg-white/85 backdrop-blur-xl border border-pink-200/90 p-6 md:p-8 text-center shadow-[0_15px_35px_rgba(244,114,182,0.1)] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-32 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-3 shadow-sm">
          <Compass className="w-3.5 h-3.5 animate-spin-slow text-amber-500" />
          <span>승원이가 기다리는 곳 찾기</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 font-gowun">
          연수가 걸어오는 길 🧭
        </h2>
        <p className="text-slate-600 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
          연수가 끌리는 길을 골라봐! 과연 어디에 도착하게 될까?
        </p>
      </div>

      {/* Game Content Box */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-pink-200/90 p-6 md:p-8 shadow-[0_15px_35px_rgba(244,114,182,0.12)] relative overflow-hidden">
        {/* Progress tracker */}
        {!isFinal && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
              <span className="flex items-center gap-1 text-pink-600 font-bold">
                <Footprints className="w-3.5 h-3.5" />
                {currentStep + 1} / {STAGES.length} 번째 갈림길
              </span>
              <span>선택 경로: {choiceHistory.length > 0 ? choiceHistory.join(' ➔ ') : '출발 준비 완료'}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500"
                style={{ width: `${((currentStep + 1) / (STAGES.length + 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Calculating state */}
        {isCalculating ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin flex items-center justify-center">
              <Compass className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">연수의 발자국을 따라 목적지 찾는 중...</h3>
            <p className="text-xs text-slate-500">두구두구... 과연 어디로 도착했을까요? 🧭</p>
          </div>
        ) : !isFinal ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                {STAGES[currentStep].title}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 max-w-lg mx-auto">
                {STAGES[currentStep].subtitle}
              </p>
            </div>

            {flavorText && (
              <div className="text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs font-medium animate-pulse">
                  ✨ {flavorText}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => handleChoice('오른쪽', STAGES[currentStep].optionA.flavor)}
                className="group p-5 rounded-2xl bg-pink-50/50 border border-pink-200 hover:border-pink-400 hover:bg-white hover:shadow-[0_10px_25px_rgba(244,114,182,0.18)] text-left transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{STAGES[currentStep].optionA.icon}</span>
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-bold group-hover:bg-pink-500 group-hover:text-white transition">
                    👉 오른쪽 선택
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-pink-600 transition">
                  {STAGES[currentStep].optionA.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {STAGES[currentStep].optionA.description}
                </p>
              </button>

              <button
                onClick={() => handleChoice('왼쪽', STAGES[currentStep].optionB.flavor)}
                className="group p-5 rounded-2xl bg-purple-50/50 border border-purple-200 hover:border-purple-400 hover:bg-white hover:shadow-[0_10px_25px_rgba(192,132,252,0.18)] text-left transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{STAGES[currentStep].optionB.icon}</span>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-bold group-hover:bg-purple-500 group-hover:text-white transition">
                    👈 왼쪽 선택
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-purple-600 transition">
                  {STAGES[currentStep].optionB.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {STAGES[currentStep].optionB.description}
                </p>
              </button>
            </div>
          </div>
        ) : (
          /* Final Reveal View (Destination: Seung-won!) */
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-500">
            <div className="relative inline-block">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-pink-400 via-rose-400 to-amber-200 p-1 shadow-[0_10px_25px_rgba(244,114,182,0.35)] flex items-center justify-center animate-bounce">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl">
                  💖
                </div>
              </div>
              <div className="absolute -bottom-2 -right-1 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-md flex items-center gap-1 border-2 border-white">
                <MapPin className="w-3.5 h-3.5" /> 도착 완료!
              </div>
            </div>

            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-xs font-bold mb-3 border border-pink-200">
                📍 최종 목적지 확인
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3 font-gowun">
                도착지: 세상에서 널 가장 사랑하는{' '}
                <span className="text-rose-500 underline decoration-pink-300 underline-offset-8">
                  '승원이 품 안'
                </span>
                에 도착했습니다!
              </h3>
              <p className="text-slate-600 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                연수가 왼쪽을 선택하든, 오른쪽을 선택하든, 어디로 발걸음을 옮기든...<br />
                <strong className="text-pink-600">결국 연수의 모든 길 끝에는 언제나 승원이가 기다리고 있어 🤍</strong><br />
                (이 정도면 완벽한 운명 맞지?)
              </p>
            </div>

            {/* Couple Route Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
              <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-200/80">
                <div className="text-[10px] text-slate-500">연수의 선택 경로</div>
                <div className="text-xs font-bold text-pink-600 mt-0.5">
                  {choiceHistory.join(' ➔ ')}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="text-[10px] text-slate-500">걸어온 거리</div>
                <div className="text-xs font-bold text-amber-700 mt-0.5">1016 m (생일)</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="text-[10px] text-slate-500">행복 게이지</div>
                <div className="text-xs font-bold text-emerald-600 mt-0.5">100% 가득 참 🤍</div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80">
                <div className="text-[10px] text-slate-500">기다리는 사람</div>
                <div className="text-xs font-bold text-rose-600 mt-0.5">평생 짝꿍 승원이</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-pink-50 text-slate-600 hover:text-slate-900 text-xs md:text-sm font-semibold border border-pink-200 transition flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다른 길로 다시 걸어보기 (또 승원이 나옴)</span>
              </button>

              <button
                onClick={onGoToPhotos}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white text-xs md:text-sm font-bold shadow-[0_5px_15px_rgba(244,114,182,0.35)] hover:scale-105 active:scale-95 transition flex items-center gap-2 border border-white/60"
              >
                <span>우리의 사진첩 보러 가기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
