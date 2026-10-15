import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioPlayer';
import { Quest, Coupon } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { CheckCircle2, Sparkles, Plus, Gift, Ticket, Check, PartyPopper, Heart } from 'lucide-react';

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: '나 보고 예쁘게 활짝 웃어주기 😊',
    description: '연수 특유의 사랑스러운 미소 보여주기!',
    rewardTitle: '승원이의 무한 뽀뽀 100회 이용권',
    rewardDesc: '언제 어디서든 즉시 사용 가능! 승원이는 절대 거부 불가 (그럴 생각도 없긴해)',
    icon: '💋',
    isCompleted: false,
    tag: '기본 미션',
  },
  {
    id: 'q2',
    title: '내 양 볼 살짝 꼬집기 🤏',
    description: '장난치면서 승원이 볼 말랑하게 꼬집어보기!',
    rewardTitle: '연수가 원하는 디저트 & 카페 전액 지원권',
    rewardDesc: '케이크, 파르페, 츄러스 등 연수가 먹고 싶은 디저트 결제!',
    icon: '🍰',
    isCompleted: false,
    tag: '장난 미션',
  },
  {
    id: 'q3',
    title: '오늘 하루 나한테 마음껏 투정 부리기 🥺',
    description: '귀여운 투정이나 서운했던 거, 어리광 전부 털어놓기!',
    rewardTitle: '무한 어리광 수용 & 전속 토닥토닥권',
    rewardDesc: '승원이가 무조건 "연수 말이 다 맞아~" 하면서 부둥부둥 안아주기',
    icon: '🧸',
    isCompleted: false,
    tag: '애교 미션',
  },
  {
    id: 'q4',
    title: '내 눈 3초 동안 지그시 바라보기 👀',
    description: '눈 마주치고 심장 쿵쾅거리게 만들어주기!',
    rewardTitle: '심쿵 보증! 따뜻한 백허그 1시간 충전권',
    rewardDesc: '연수가 쉬고 싶을 때 승원이 품에서 푹 쉴 수 있는 권리',
    icon: '🤗',
    isCompleted: false,
    tag: '심쿵 미션',
  },
  {
    id: 'q5',
    title: '10월 16일 오늘 제일 행복하기 🥳',
    description: '오늘 하루 지구상에서 가장 행복하기!',
    rewardTitle: '365일 평생 사랑받을 권리 (종신 보증서)',
    rewardDesc: '유효기간 평생! 항상 연수를 1순위로 아껴주고 사랑해 주기',
    icon: '💍',
    isCompleted: false,
    tag: '평생 약속',
  },
  {
    id: 'q6',
    title: '내 손 꼭 잡고 비밀 소원 속삭이기 🤝',
    description: '귓가에 연수가 바라는 진짜 소망 말해주기!',
    rewardTitle: '승원이의 무조건 소원 들어주기 1회권',
    rewardDesc: '어떤 소원이든 승원이가 온 힘을 다해 이뤄주기!',
    icon: '⭐',
    isCompleted: false,
    tag: '소원 미션',
  },
];

export const QuestSection: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('yeon_soo_quests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_QUESTS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('yeon_soo_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'quests' | 'wallet'>('quests');
  const [showAddCustom, setShowAddCustom] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customReward, setCustomReward] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('yeon_soo_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('yeon_soo_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const completeQuest = (questId: string) => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest || targetQuest.isCompleted) return;

    audioEngine.playQuestClear();

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fda4af', '#fde047', '#34d399', '#a78bfa', '#ffffff'],
    });

    const now = new Date().toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isCompleted: true, completedAt: now } : q))
    );

    const newCoupon: Coupon = {
      id: 'cp-' + Date.now(),
      title: targetQuest.rewardTitle,
      description: targetQuest.rewardDesc,
      icon: targetQuest.icon,
      issuedAt: now,
      isUsed: false,
    };

    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const useCoupon = (couponId: string) => {
    audioEngine.playCutePop();
    const now = new Date().toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isUsed: true, usedAt: now } : c))
    );
  };

  const handleAddCustomQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customReward.trim()) return;

    const newQ: Quest = {
      id: 'custom-' + Date.now(),
      title: customTitle.trim(),
      description: '연수가 직접 적은 우리 둘만의 미션!',
      rewardTitle: customReward.trim(),
      rewardDesc: '연수가 요청한 승원이의 특급 공약!',
      icon: '✨',
      isCompleted: false,
      tag: '연수의 미션',
    };

    setQuests((prev) => [...prev, newQ]);
    setCustomTitle('');
    setCustomReward('');
    setShowAddCustom(false);
    audioEngine.playCutePop();
  };

  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const executeResetQuestsAndCoupons = () => {
    audioEngine.playCutePop();
    setQuests(INITIAL_QUESTS);
    setCoupons([]);
    localStorage.removeItem('yeon_soo_quests');
    localStorage.removeItem('yeon_soo_coupons');
  };

  const completedCount = quests.filter((q) => q.isCompleted).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-white/85 backdrop-blur-xl border border-pink-200/90 p-6 md:p-8 text-center shadow-[0_15px_35px_rgba(244,114,182,0.1)] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-32 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs font-bold mb-3 shadow-sm">
          <PartyPopper className="w-3.5 h-3.5 text-pink-400" />
          <span>승원이가 준비한 소소한 미션과 쿠폰함</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 font-gowun">
          연수를 위한 미션 & 쿠폰함 🎟️
        </h2>
        <p className="text-slate-600 text-xs md:text-sm max-w-md mx-auto mb-4 leading-relaxed">
          재미 삼아 웃으면서 하나씩 깨봐! 완료할 때마다 내가 직접 해주는<br />
          깜짝 쿠폰이 바로 쿠폰함에 쏙 들어와
        </p>

        {/* Tab switchers & Reset Button */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex p-1 rounded-2xl bg-pink-50 border border-pink-200/80 shadow-sm">
            <button
              onClick={() => setActiveTab('quests')}
              className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'quests'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>미션 목록</span>
              <span className="px-2 py-0.5 rounded-full bg-white/30 text-[11px]">
                {completedCount}/{quests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'wallet'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>내 쿠폰함</span>
              <span className="px-2 py-0.5 rounded-full bg-white/30 text-[11px]">
                {coupons.length}개
              </span>
            </button>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 text-slate-500 hover:text-slate-800 text-xs font-semibold border border-pink-200 shadow-sm transition flex items-center gap-1.5"
            title="미션과 쿠폰을 처음 상태로 되돌리기"
          >
            <span>🔄</span>
            <span>미션 & 쿠폰 초기화</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'quests' ? (
        <div className="space-y-4">
          {/* Quest Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`relative rounded-2xl p-5 border transition duration-300 flex flex-col justify-between ${
                  quest.isCompleted
                    ? 'bg-pink-50/50 border-emerald-300 shadow-sm'
                    : 'bg-white/90 border-pink-200 hover:border-pink-300 hover:shadow-[0_8px_25px_rgba(244,114,182,0.15)]'
                }`}
              >
                {/* Completed Stamp Overlay */}
                {quest.isCompleted && (
                  <div className="absolute top-3 right-3 transform rotate-12 pointer-events-none select-none">
                    <div className="border-2 border-emerald-500/80 rounded-lg px-2.5 py-0.5 text-emerald-600 font-bold text-xs uppercase tracking-wider bg-emerald-50 shadow-sm flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 완료! 참 잘했어요 🤍
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{quest.icon}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-600 font-bold">
                      {quest.tag}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-800 mb-1">{quest.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{quest.description}</p>

                  {/* Reward Box */}
                  <div className="p-3 rounded-xl bg-pink-50/70 border border-pink-200/60 text-xs mb-4">
                    <div className="flex items-center gap-1 text-pink-600 font-bold mb-0.5">
                      <Gift className="w-3.5 h-3.5 text-rose-500" />
                      <span>보상: {quest.rewardTitle}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{quest.rewardDesc}</p>
                  </div>
                </div>

                {/* Action button */}
                <div>
                  {quest.isCompleted ? (
                    <div className="text-center py-2 text-xs text-emerald-600 font-bold flex items-center justify-center gap-1 bg-emerald-50 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>미션 완료! 쿠폰함에 쏙 들어갔어 🤍</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => completeQuest(quest.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition shadow-[0_5px_15px_rgba(244,114,182,0.3)] flex items-center justify-center gap-1.5 border border-white/60"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>미션 완료하고 쿠폰 받기!</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add custom quest card */}
          <div className="pt-2 text-center">
            {!showAddCustom ? (
              <button
                onClick={() => setShowAddCustom(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-pink-200 text-pink-600 hover:text-pink-700 text-xs md:text-sm font-semibold shadow-sm hover:bg-pink-50 transition"
              >
                <Plus className="w-4 h-4" />
                <span>연수가 나한테 바라는 미션 직접 만들기</span>
              </button>
            ) : (
              <form
                onSubmit={handleAddCustomQuest}
                className="max-w-md mx-auto p-5 rounded-2xl bg-white border border-pink-200 text-left space-y-3 shadow-lg"
              >
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>새로운 미션 만들기</span>
                </h4>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">미션 내용</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="예: 승원이한테 머리 쓰담쓰담해달라고 하기"
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">보상 (승원이가 해줄 것)</label>
                  <input
                    type="text"
                    value={customReward}
                    onChange={(e) => setCustomReward(e.target.value)}
                    placeholder="예: 맛있는 떡볶이 사주기 & 마사지 30분"
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 transition shadow-sm"
                  >
                    미션 등록하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCustom(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs hover:bg-slate-200 transition"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* Coupon Wallet Tab */
        <div className="space-y-4">
          {coupons.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-white/70 border border-dashed border-pink-200 p-8">
              <Ticket className="w-12 h-12 text-pink-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700 mb-1">아직 모은 쿠폰이 없어!</h4>
              <p className="text-xs text-slate-500 mb-4">
                미션 목록 탭에서 미션을 깨면 내가 보증하는 특별 쿠폰들이 채워져
              </p>
              <button
                onClick={() => setActiveTab('quests')}
                className="px-5 py-2 rounded-xl bg-pink-500 text-white text-xs font-bold hover:bg-pink-600 transition shadow-sm"
              >
                미션 깨러 가기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`relative rounded-2xl border p-4 transition overflow-hidden shadow-sm ${
                    coupon.isUsed
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-gradient-to-r from-white via-pink-50/40 to-rose-50/50 border-pink-200 shadow-[0_5px_15px_rgba(244,114,182,0.1)]'
                  }`}
                >
                  {/* Perforated ticket edge decoration */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fff8fa] border border-pink-200" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fff8fa] border border-pink-200" />

                  {/* Stamp if used */}
                  {coupon.isUsed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] z-10 pointer-events-none">
                      <div className="border-4 border-rose-500 rounded-2xl px-4 py-1 text-rose-500 font-extrabold text-base transform -rotate-12 tracking-wider shadow-sm">
                        사용 완료 🤍
                      </div>
                    </div>
                  )}

                  <div className="pl-3 pr-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{coupon.icon}</span>
                      <span className="text-[10px] text-pink-500 font-mono font-bold">
                        NO. {coupon.id.slice(-6)}
                      </span>
                    </div>

                    <h4 className="text-sm md:text-base font-bold text-slate-800 mb-1">
                      {coupon.title}
                    </h4>
                    <p className="text-xs text-slate-600 mb-3">{coupon.description}</p>

                    <div className="pt-2 border-t border-pink-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>발급: {coupon.issuedAt}</span>
                      {!coupon.isUsed ? (
                        <button
                          onClick={() => useCoupon(coupon.id)}
                          className="px-3.5 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold transition text-xs shadow-sm"
                        >
                          승원이한테 사용하기!
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium">{coupon.usedAt} 사용됨</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="미션 & 쿠폰 초기화"
        message="완료된 미션과 발급받은 쿠폰들을 처음 상태로 되돌릴까요?"
        confirmText="초기화하기"
        cancelText="취소"
        isDestructive={true}
        onConfirm={executeResetQuestsAndCoupons}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
