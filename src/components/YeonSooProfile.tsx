import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioPlayer';
import { ConfirmModal } from './ConfirmModal';
import { Sparkles, Heart, Zap, Award, BookOpen, Edit3, Plus, Trash2, Check, RefreshCw, ArrowRight, Shield, Flame, Smile } from 'lucide-react';

interface ProfileItem {
  id: string;
  category: string;
  title: string;
  content: string;
  icon: string;
  tagColor: string;
}

const DEFAULT_PROFILE_ITEMS: ProfileItem[] = [
  {
    id: 'item-1',
    category: '습관 & 버릇',
    title: '승원이 꼬시기',
    content: '존재만으로도 꼬셔대서 힘들다 힘들어~ 예쁜게 죄긴해.',
    icon: '🍓',
    tagColor: 'bg-pink-100 text-pink-600 border-pink-200',
  },
  {
    id: 'item-2',
    category: '시그니처 말투',
    title: '연수 전용 어록 🗣️',
    content: '"굳이?", "솔직히 나는 ~하긴해", "엥!?", "쪼아!", "승원아 승원아~"',
    icon: '💬',
    tagColor: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    id: 'item-3',
    category: '좋아하는 것',
    title: '연수를 행복하게 만드는 치트키 💖',
    content: '승원이(반박 안 받음), 꼬기! & 바닐라 라떼랑 헤이즐넛, 게임, 푹신한 침대 속에서 뒹굴거리기, 잠.',
    icon: '🤍',
    tagColor: 'bg-rose-100 text-rose-600 border-rose-200',
  },
  {
    id: 'item-4',
    category: '싫어하는 것',
    title: '주의! 연수 게이지 급감 요소 🚫',
    content: '귀찮은거, 답답한거, 심심한거, 생선(날것?), 토마토, 깻잎(향이강한거), 곱창이랑 막창?, 승원이가 거짓말 하는거, 승원이랑 떨어지는거~',
    icon: '😤',
    tagColor: 'bg-purple-100 text-purple-600 border-purple-200',
  },
  {
    id: 'item-5',
    category: '필살기',
    title: '승원이 무장해제 애교빔 💫',
    content: '특유의 눈웃음과 함께 "승원아~ 승원아~" 하고 부르면 승원이는 모든 논리적 사고가 정지되고 원하는 걸 다 들어주게 됨. (사기캐네 ㅡㅡ)',
    icon: '✨',
    tagColor: 'bg-blue-100 text-blue-600 border-blue-200',
  },
  {
    id: 'item-6',
    category: '약점',
    title: '미확인',
    content: '확인중이지만 꽤 만만치 않은 상대이다. 하지만 현재로썬 머리만 기대면...',
    icon: '🧸',
    tagColor: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  },
];

export interface HexStat {
  key: string;
  name: string;
  icon: string;
  value: number; // 0-100
  maxValue: number;
  grade: string;
  desc: string;
  color: string;
  badgeBg: string;
}

export const DEFAULT_HEX_STATS: HexStat[] = [
  {
    key: 'aegyo',
    name: '사랑스러움',
    icon: '💖',
    value: 100,
    maxValue: 100,
    grade: 'SS+',
    desc: '숨만 쉬어도 뿜어져 나오는 극상의 귀여움. 승원이 좋아죽음',
    color: '#f43f5e',
    badgeBg: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  {
    key: 'usagi',
    name: '텐션',
    icon: '🐰',
    value: 96,
    maxValue: 100,
    grade: 'S+',
    desc: '기분 최고일 때 터지는 에너지',
    color: '#f59e0b',
    badgeBg: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    key: 'sweet',
    name: '먹방력',
    icon: '🍰',
    value: 98,
    maxValue: 100,
    grade: 'S+',
    desc: '숟가락에 야무지게 올려서 냠냠!',
    color: '#ec4899',
    badgeBg: 'bg-pink-100 text-pink-700 border-pink-200',
  },
  {
    key: 'tame',
    name: '승원이 조련술',
    icon: '🥺',
    value: 100,
    maxValue: 100,
    grade: 'MAX',
    desc: '반달 눈웃음과 필살 애교빔으로 승원이 3초 만에 무장해제',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    key: 'recover',
    name: '회복속도',
    icon: '⚡',
    value: 92,
    maxValue: 100,
    grade: 'S',
    desc: '승원이가 꼭 안아주고 머리 쓰다듬어 주면 사르르 미소 만발',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  },
  {
    key: 'monopoly',
    name: '승원이 독점욕(승원이 희망)',
    icon: '👑',
    value: 99,
    maxValue: 100,
    grade: 'SS',
    desc: '승원이는 영원히 연수 전용! 1초도 다른 곳 못 보게 찜해줘!!',
    color: '#10b981',
    badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
];

interface YeonSooProfileProps {
  onGoToLetter: () => void;
}

export const YeonSooProfile: React.FC<YeonSooProfileProps> = ({ onGoToLetter }) => {
  const [profileItems, setProfileItems] = useState<ProfileItem[]>(() => {
    const saved = localStorage.getItem('yeon_soo_pokedex_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_PROFILE_ITEMS;
  });

  const [selectedStatKey, setSelectedStatKey] = useState<string>('aegyo');
  const [isStatBoosted, setIsStatBoosted] = useState<boolean>(false);
  const [boostMessage, setBoostMessage] = useState<string>('');

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ProfileItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New item form
  const [newCategory, setNewCategory] = useState<string>('특성 & 설정');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newIcon, setNewIcon] = useState<string>('⭐');

  useEffect(() => {
    localStorage.setItem('yeon_soo_pokedex_items', JSON.stringify(profileItems));
  }, [profileItems]);

  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const executeReset = () => {
    audioEngine.playCutePop();
    setProfileItems(DEFAULT_PROFILE_ITEMS);
    localStorage.removeItem('yeon_soo_pokedex_items');
    setShowResetConfirm(false);
  };

  const executeDelete = () => {
    if (!deleteTargetId) return;
    audioEngine.playCutePop();
    setProfileItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    audioEngine.playCutePop();
    setProfileItems((prev) =>
      prev.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    audioEngine.playConfettiPop();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    const newItem: ProfileItem = {
      id: 'pokedex-' + Date.now(),
      category: newCategory.trim() || '연수 특별 설정',
      title: newTitle.trim(),
      content: newContent.trim(),
      icon: newIcon,
      tagColor: 'bg-pink-100 text-pink-600 border-pink-200',
    };

    setProfileItems((prev) => [...prev, newItem]);
    setShowAddModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-white/85 backdrop-blur-xl border border-pink-200/90 p-6 md:p-8 text-center shadow-[0_15px_35px_rgba(244,114,182,0.1)] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-32 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs font-bold mb-3 shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-pink-500" />
          <span>승원이가 직접 분석한 공식 인물 도감</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 font-gowun">
          연수 특별 인물 도감 📖
        </h2>
        <p className="text-slate-600 text-xs md:text-sm max-w-lg mx-auto mb-4 leading-relaxed">
          승원이가 지난 시간 동안 관찰하고 기록한 연수 총정리!<br />
          언제든 수정하거나 연수가 생각하는 항목을 새로 추가할 수도 있어
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 도감 항목 추가</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-pink-50 text-slate-500 hover:text-slate-800 text-xs font-semibold border border-pink-200 transition shadow-sm"
            title="기본 설정으로 되돌리기"
          >
            <RefreshCw className="w-3.5 h-3.5 text-pink-400" />
            <span>도감 초기화</span>
          </button>
        </div>
      </div>

      {/* Pokédex Main Summary Card */}
      <div className="rounded-3xl bg-white/95 border-2 border-pink-200/90 p-6 md:p-8 shadow-[0_15px_35px_rgba(244,114,182,0.12)]">
        <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-pink-100">
          {/* Avatar frame with Chiikawa Usagi */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 p-1 shadow-md border-4 border-white flex items-center justify-center overflow-hidden">
              <img
                src="/images/usagi_chiikawa.jpg"
                alt="연수 캐릭터 우사기"
                className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition duration-300"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-[11px] font-bold shadow border border-white">
              No. 1016
            </div>
          </div>

          {/* Profile Basic Info */}
          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
                희귀도: ★★★★★ (우주 유일)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                타입: 페어리 / 사랑스러움 🌸
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-gowun">
              김연수 <span className="text-base font-normal text-slate-500 font-gaegu">(Kim Yeon-soo)</span>
            </h3>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              <strong>서식지:</strong> 승원이 곁, 따뜻한 침대 속 <br />
              <strong>주요 특징:</strong> 배부르고 따뜻하면 온순해짐. 웃을 때 너무 예뻐서 승원이 심장을 마비시키는 무시무시한 패시브 스킬 보유.
            </p>
          </div>
        </div>

        {/* Hexagon Stat Radar Chart & Ability Matrix Section */}
        <div className="pt-6 border-t border-pink-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>연수 공식 능력치 레이더 (Hexagon Stat)</span>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-slate-800 font-gowun">
                캐릭터 6대 핵심 스탯 분석 📊
              </h4>
            </div>

            <button
              onClick={() => {
                audioEngine.playConfettiPop();
                confetti({
                  particleCount: 60,
                  spread: 70,
                  origin: { y: 0.5 },
                  colors: ['#f43f5e', '#ec4899', '#f59e0b', '#8b5cf6', '#ffffff'],
                });
                setIsStatBoosted(true);
                const msgs = [
                  '💖 삐빅! 사랑스러움 측정 불가 (한도 초과)',
                  '🐰 에너지 200% 폭발! 승원이 자동 심쿵',
                  '🍰 디저트 흡입력 MAX! 딸기 케이크 대기 중',
                  '🥺 승원이 조련술 9999pt! 무조건적인 항복',
                ];
                setBoostMessage(msgs[Math.floor(Math.random() * msgs.length)]);
                setTimeout(() => setBoostMessage(''), 3500);
              }}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs font-bold transition shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>능력치 재측정 (스탯 부스트!)</span>
            </button>
          </div>

          {/* Boost Toast Notification */}
          {boostMessage && (
            <div className="mb-4 p-2.5 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-amber-100 border border-pink-300 text-pink-800 text-xs md:text-sm font-bold text-center animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm flex items-center justify-center gap-2">
              <span className="text-base animate-bounce">✨</span>
              <span>{boostMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Hexagonal Radar Chart (SVG) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 rounded-3xl bg-gradient-to-b from-pink-50/70 via-rose-50/40 to-white border border-pink-200/90 shadow-inner">
              <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
                <svg
                  viewBox="0 0 320 320"
                  className="w-full h-full drop-shadow-sm select-none"
                >
                  <defs>
                    <radialGradient id="hexRadarFill" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fda4af" stopOpacity="0.75" />
                      <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#e11d48" stopOpacity="0.2" />
                    </radialGradient>
                    <linearGradient id="hexStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <filter id="hexGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Concentric Hexagonal Grids */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, idx) => {
                    const radius = 95 * level;
                    const cx = 160;
                    const cy = 160;
                    const points = [0, 1, 2, 3, 4, 5]
                      .map((i) => {
                        const angle = ((i * 60 - 90) * Math.PI) / 180;
                        return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`;
                      })
                      .join(' ');

                    return (
                      <polygon
                        key={idx}
                        points={points}
                        fill={idx === 4 ? 'rgba(253, 242, 248, 0.5)' : 'none'}
                        stroke={idx === 4 ? '#f472b6' : '#fbcfe8'}
                        strokeWidth={idx === 4 ? '1.8' : '1'}
                        strokeDasharray={idx < 4 ? '3 3' : 'none'}
                      />
                    );
                  })}

                  {/* Radial Axis Lines */}
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const angle = ((i * 60 - 90) * Math.PI) / 180;
                    const x2 = 160 + 95 * Math.cos(angle);
                    const y2 = 160 + 95 * Math.sin(angle);
                    return (
                      <line
                        key={i}
                        x1="160"
                        y1="160"
                        x2={x2}
                        y2={y2}
                        stroke="#f9a8d4"
                        strokeWidth="1.2"
                      />
                    );
                  })}

                  {/* Filled Data Polygon */}
                  {(() => {
                    const cx = 160;
                    const cy = 160;
                    const maxR = 95;
                    const statPoints = DEFAULT_HEX_STATS.map((stat, i) => {
                      const angle = ((i * 60 - 90) * Math.PI) / 180;
                      const r = (stat.value / stat.maxValue) * maxR;
                      return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
                    }).join(' ');

                    return (
                      <g filter="url(#hexGlow)">
                        <polygon
                          points={statPoints}
                          fill="url(#hexRadarFill)"
                          stroke="url(#hexStrokeGrad)"
                          strokeWidth="2.8"
                          strokeLinejoin="round"
                        />
                      </g>
                    );
                  })()}

                  {/* Data Points on vertices */}
                  {DEFAULT_HEX_STATS.map((stat, i) => {
                    const angle = ((i * 60 - 90) * Math.PI) / 180;
                    const maxR = 95;
                    const r = (stat.value / stat.maxValue) * maxR;
                    const x = 160 + r * Math.cos(angle);
                    const y = 160 + r * Math.sin(angle);
                    const isSelected = selectedStatKey === stat.key;

                    return (
                      <g
                        key={stat.key}
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => {
                          audioEngine.playCutePop();
                          setSelectedStatKey(stat.key);
                        }}
                      >
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? '6.5' : '4.5'}
                          fill={stat.color}
                          stroke="#ffffff"
                          strokeWidth="2.2"
                        />
                        {isSelected && (
                          <circle
                            cx={x}
                            cy={y}
                            r="9"
                            fill="none"
                            stroke={stat.color}
                            strokeWidth="1.5"
                            className="animate-ping"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Stat Vertex Labels around the Hexagon */}
                  {DEFAULT_HEX_STATS.map((stat, i) => {
                    const angle = ((i * 60 - 90) * Math.PI) / 180;
                    const labelDistance = 125;
                    const x = 160 + labelDistance * Math.cos(angle);
                    const y = 160 + labelDistance * Math.sin(angle);
                    const isSelected = selectedStatKey === stat.key;

                    return (
                      <g
                        key={`label-${stat.key}`}
                        className="cursor-pointer"
                        onClick={() => {
                          audioEngine.playCutePop();
                          setSelectedStatKey(stat.key);
                        }}
                      >
                        <text
                          x={x}
                          y={y - 6}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={`text-[11px] font-bold transition-all ${
                            isSelected ? 'fill-rose-600 font-extrabold text-[12px]' : 'fill-slate-700'
                          }`}
                        >
                          {stat.icon} {stat.name}
                        </text>
                        <text
                          x={x}
                          y={y + 8}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-[10px] font-bold fill-pink-500"
                        >
                          {stat.value}pt ({stat.grade})
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <p className="text-[11px] text-pink-500/80 mt-1 font-semibold flex items-center gap-1">
                <span>👆 꼭짓점이나 이름을 터치하면 스탯 설명이 보여요!</span>
              </p>
            </div>

            {/* Stat Progress Bars & Selected Details */}
            <div className="lg:col-span-6 space-y-3">
              {/* Selected Stat Highlight Card */}
              {(() => {
                const currentStat =
                  DEFAULT_HEX_STATS.find((s) => s.key === selectedStatKey) || DEFAULT_HEX_STATS[0];

                return (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border-2 border-pink-200/90 shadow-sm animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{currentStat.icon}</span>
                        <div>
                          <h5 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-1.5">
                            {currentStat.name}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${currentStat.badgeBg}`}>
                              등급: {currentStat.grade}
                            </span>
                          </h5>
                          <p className="text-xs text-slate-500 font-medium">
                            공식 측정치: <strong className="text-pink-600">{currentStat.value} / {currentStat.maxValue} pt</strong>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white font-bold text-pink-600 border border-pink-200 shadow-xs">
                        승원이 인증 완료 ✅
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 bg-white/70 rounded-xl p-2.5 border border-pink-100 leading-relaxed font-medium">
                      "{currentStat.desc}"
                    </p>
                  </div>
                );
              })()}

              {/* All 6 Stat Bars */}
              <div className="space-y-2 pt-1">
                {DEFAULT_HEX_STATS.map((stat) => {
                  const isSelected = selectedStatKey === stat.key;
                  return (
                    <div
                      key={stat.key}
                      onClick={() => {
                        audioEngine.playCutePop();
                        setSelectedStatKey(stat.key);
                      }}
                      className={`p-2 rounded-xl transition cursor-pointer border ${
                        isSelected
                          ? 'bg-pink-100/60 border-pink-300 shadow-xs'
                          : 'bg-white/60 hover:bg-pink-50/50 border-pink-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1 font-bold">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <span>{stat.icon}</span>
                          <span>{stat.name}</span>
                        </span>
                        <span className="text-pink-600 flex items-center gap-1">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-100 text-pink-600 font-extrabold">
                            {stat.grade}
                          </span>
                          <span>{stat.value} / {stat.maxValue}</span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(stat.value / stat.maxValue) * 100}%`,
                            backgroundColor: stat.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pokédex Detailed Traits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl bg-white/90 border border-pink-200 p-5 shadow-[0_5px_20px_rgba(244,114,182,0.08)] hover:shadow-[0_10px_25px_rgba(244,114,182,0.15)] transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.tagColor}`}>
                  {item.category}
                </span>

                {/* Edit & Delete Controls */}
                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1 rounded-md text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition"
                    title="항목 내용 수정하기"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                    title="항목 삭제하기"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <span>{item.title}</span>
              </h4>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-gowun bg-pink-50/30 p-3 rounded-xl border border-pink-100/60">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to the Final Letter */}
      <div className="pt-6 text-center">
        <button
          onClick={onGoToLetter}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-sm md:text-base shadow-[0_10px_25px_rgba(244,114,182,0.35)] hover:scale-105 active:scale-95 transition flex items-center gap-2 mx-auto border border-white/60"
        >
          <span>💌 이제 마지막으로 승원이가 쓴 생일 편지 보러 가기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div
          onClick={() => setEditingItem(null)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-pink-200 text-slate-800 animate-in zoom-in-95 duration-200"
          >
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-pink-500" />
              <span>도감 내용 수정하기</span>
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">카테고리</label>
                <input
                  type="text"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">제목</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">내용 및 설명</label>
                <textarea
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  rows={3}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-pink-400 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 transition shadow-sm"
                >
                  수정 완료
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs hover:bg-slate-200 transition"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-pink-200 text-slate-800 animate-in zoom-in-95 duration-200"
          >
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-pink-500" />
              <span>새로운 연수 도감 항목 추가</span>
            </h3>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">카테고리 구분</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="예: 귀여운 버릇, 승원이 전용 스킬 등"
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">제목</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 졸릴 때 눈 깜빡거리는 습관"
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">설명 및 디테일</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="재미있고 귀여운 연수만의 특징을 자세하게 적어봐!"
                  rows={3}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-pink-400 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 transition shadow-sm"
                >
                  도감에 등록하기 ✨
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs hover:bg-slate-200 transition"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="도감 항목 삭제"
        message="정말 이 도감 항목을 삭제할까요?"
        confirmText="삭제하기"
        cancelText="취소"
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Reset Profile Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="도감 초기화"
        message="연수 도감 항목을 최초 기본 설정으로 되돌릴까요?"
        confirmText="초기화하기"
        cancelText="취소"
        isDestructive={true}
        onConfirm={executeReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
