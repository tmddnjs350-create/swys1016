import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioPlayer';
import { Heart, Sparkles, Send, Star, Feather } from 'lucide-react';

export const LetterSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [savedReply, setSavedReply] = useState<string>('');
  const [replySavedAt, setReplySavedAt] = useState<string>('');

  useEffect(() => {
    const reply = localStorage.getItem('yeon_soo_letter_reply');
    const time = localStorage.getItem('yeon_soo_reply_time');
    if (reply) {
      setSavedReply(reply);
      setReplySavedAt(time || '2026년 10월 16일');
    }
  }, []);

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      setIsOpen(true);
      audioEngine.playCandleBlow();

      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fda4af', '#f43f5e', '#fef08a', '#ffffff', '#f472b6'],
      });
    }
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const now = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    localStorage.setItem('yeon_soo_letter_reply', replyText.trim());
    localStorage.setItem('yeon_soo_reply_time', now);
    setSavedReply(replyText.trim());
    setReplySavedAt(now);
    setReplyText('');

    audioEngine.playConfettiPop();
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#f472b6', '#fb7185', '#a855f7', '#ffffff'],
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-white/85 backdrop-blur-xl border border-pink-200/90 p-6 md:p-8 text-center shadow-[0_15px_35px_rgba(244,114,182,0.1)] overflow-hidden">
        <div className="absolute top-0 left-1/3 w-64 h-32 bg-rose-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold mb-3 shadow-sm">
          <Feather className="w-3.5 h-3.5 text-rose-500" />
          <span>승원이가 마음을 담아 쓴 편지</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 font-gowun">
          연수에게 전하는 생일 편지 💌
        </h2>
        <p className="text-slate-600 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
          지금까지 재미있게 웃으며 둘러봤다면,<br />
          마지막은 정말 해주고 싶었던 진심 어린 마음이야.
        </p>
      </div>

      {/* Wax Sealed Envelope View or Unfolded Letter */}
      {!isOpen ? (
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-pink-200/90 p-8 md:p-12 text-center shadow-[0_15px_35px_rgba(244,114,182,0.12)] relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-6">
            {/* Visual Envelope */}
            <div
              onClick={handleOpenEnvelope}
              className="cursor-pointer group relative w-full aspect-[16/11] rounded-2xl bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200 border-2 border-pink-300 shadow-[0_15px_35px_rgba(244,114,182,0.2)] p-6 flex flex-col justify-between items-center transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {/* Envelope Flap line */}
              <div className="absolute top-0 inset-x-0 h-1/2 border-b-2 border-pink-300/60 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-2xl" />

              <div className="w-full flex items-center justify-between text-xs text-rose-600 font-mono font-semibold">
                <span>POST: 1016</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-300" /> FOR YEON SOO
                </span>
              </div>

              {/* Rosy Golden Wax Seal */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-300 p-1 shadow-xl border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-full h-full rounded-full border border-white/60 flex flex-col items-center justify-center text-white">
                  <Heart className="w-5 h-5 fill-current text-white mb-0.5" />
                  <span className="text-[10px] font-bold tracking-tighter">SW & YS</span>
                </div>
              </div>

              {/* Envelope Addressee */}
              <div className="text-center">
                <p className="font-gaegu text-xl md:text-2xl font-bold text-slate-800 tracking-wide">
                  To. 세상에서 가장 소중한 연수에게
                </p>
                <p className="text-[11px] text-rose-500 font-semibold mt-1">From. 승원이가</p>
              </div>
            </div>

            <p className="text-xs text-pink-600 font-medium animate-pulse">
              💌 실링 왁스를 톡 눌러서 편지를 열어봐
            </p>
          </div>
        </div>
      ) : (
        /* Opened Heartfelt Letter Presentation */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="relative rounded-3xl bg-white text-slate-800 p-6 md:p-12 shadow-[0_20px_45px_rgba(244,114,182,0.15)] border-2 border-pink-200/90 overflow-hidden font-gowun">
            {/* Letter Head */}
            <div className="border-b-2 border-pink-100 pb-4 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-pink-500 font-bold uppercase tracking-wider">
                  Birthday Letter
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1 font-gaegu text-rose-500">
                  사랑하는 연수에게,
                </h3>
              </div>
              <div className="text-right text-xs text-slate-500 font-mono">
                <div>2026. 10. 16</div>
                <div className="text-pink-500 font-semibold">연수의 생일날</div>
              </div>
            </div>

            {/* Genuine, Intimate, Loving Letter Body */}
            <div className="space-y-4 text-sm md:text-base leading-relaxed text-slate-700 tracking-wide font-normal">
              <p>
                안녕, 연수야. 승원이야!
              </p>

              <p>
                일단 이런 편지는 처음 써 봐. (진짜니까 믿어 줭~)
              </p>

              <p>
                내가 말을 엄청 잘하는 편도 아니고, 이런 데 센스가 좋은 것도 아니라서 내가 하고 싶은 말과 마음을 잘 표현할 수 있을지는 모르겠어. 그래도 귀엽게 봐 줘!
              </p>

              <p>
                아마 편지가 조금 길어질 수도 있으니까, 편한 곳에서 천천히 읽어 줬으면 좋겠어.
              </p>

              <p>
                과연 지금 이걸 보여 주는 나는 뭐 하고 있을까?
              </p>

              <p>
                연수 옆에서 힐끔힐끔 보고 있으려나? 아니면 같이 웃고 있으려나? 그것도 아니면 부끄럽다고 이미 도망갔으려나?
              </p>

              <p>
                이런 걸 준비하는 것조차 부끄러워서, 대부분은 연수가 그냥 재미있게 웃고 즐길 수 있도록 준비했어~<br />
                내가 준비한 것들을 보면서 연수가 한 번이라도 웃었다면, 그것만으로도 나는 정말 좋아.
              </p>

              <p>
                예전부터 이런 말들을 꽤 자주 들었어.
              </p>

              <p className="font-medium text-slate-800">
                가벼워 보인다, 능청스럽다, 진정성이 없어 보인다, 나를 사랑하긴 하는 거냐고.
              </p>

              <p>
                솔직히 그동안은 그냥 &apos;이게 나니까&apos;라고 생각하면서, 그런 모습 뒤에 내 진짜 마음을 숨겨 왔던 것 같아.
              </p>

              <p>
                그런데 연수를 만나고 나서 조금씩 달라지더라.
              </p>

              <p>
                더 잘해 주고 싶고, 뭘 하든 행복했으면 좋겠고, 연수 앞에서만큼은 언제나 진심이었어.
              </p>

              <p>
                연수를 만나면서 배우고 깨닫는 것도 정말 많아. 나도 내가 누군가를 이렇게 진심으로 사랑할 수 있다는 게 신기하고 놀랍거든.
              </p>

              <p>
                아직 많이 부족한 나지만, 연수 곁에서 조금씩 더 좋은 사람이 되도록 노력할게. 앞으로도 지켜봐 줄 거지?
              </p>

              <p>
                매년 10월 16일이 돌아와도 별생각 없이 지나갔는데, 올해는 정말 특별하네.
              </p>

              <p>
                세상에서 가장 예쁘고 다정한 연수가 태어난 날이기도 하고, 그런 연수와 함께할 수 있으니까.
              </p>

              <p>
                연수는 항상 자기는 착하지도 않고 예쁘지도 않다고 하지만, 난 그렇게 생각하지 않아.
              </p>

              <p>
                연수가 나를 위해 노력해 주고, 배려해 주고, 나에게 맞춰 주는 그 모든 모습이 나한테는 너무 예뻐 보여.
              </p>

              <p>
                그리고 연수 덕분에 매일이 즐겁고 행복해.
              </p>

              <p>
                연수는 정말 좋은 사람이야. 그래서 가끔은 내가 연수 곁에 있기엔 아직 부족한 사람 같기도 해. 그래도 나도 열심히 따라가 볼게!
              </p>

              <p>
                대신 연수도 언제든 나한테 편하게 기대 줬으면 좋겠어. 나도 연수에게 힘이 되고 기댈 수 있는 사람이 되어 줄게~
              </p>

              <p>
                너무 길어지면 나도 부끄럽고 연수도 힘들 테니까, 나머지는 옆에 있는 승원이랑 이야기 나누자.
              </p>

              <div className="pt-4 mt-6 border-t border-pink-100/90 space-y-2">
                <p className="font-semibold text-rose-500">
                  10월 16일.
                </p>
                <p className="text-slate-800 font-medium">
                  세상에 태어나 줘서, 그리고 내 곁에 있어 줘서 진심으로 고마워.
                </p>
                <p className="font-bold text-rose-600 text-base md:text-lg">
                  생일 정말 축하해.
                </p>
                <p className="font-bold text-rose-600 text-base md:text-lg">
                  정말 많이 사랑해, 연수야~
                </p>
              </div>
            </div>

            {/* Letter Sign-off */}
            <div className="mt-8 pt-6 border-t-2 border-pink-100 flex flex-col items-end">
              <p className="text-xs text-slate-400">2026년 10월 16일</p>
              <p className="font-gaegu text-xl md:text-2xl font-bold text-slate-900 mt-1">
                너를 가장 사랑하는 <span className="text-rose-500">승원이가</span>
              </p>
            </div>
          </div>

          {/* Interactive Reply Sticky Note */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-pink-200/90 p-6 md:p-8 shadow-[0_10px_30px_rgba(244,114,182,0.1)]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <h4 className="text-sm md:text-base font-bold text-slate-800">
                답장 남기기 💌
              </h4>
            </div>

            {savedReply ? (
              <div className="p-5 rounded-2xl bg-pink-50/80 text-slate-800 border-2 border-pink-200 shadow-sm relative transform rotate-[-0.5deg]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-rose-400 text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
                  📌
                </div>
                <div className="flex items-center justify-between text-[11px] text-pink-600 mb-2 font-mono font-medium">
                  <span>To. 연수의 답장</span>
                  <span>{replySavedAt}</span>
                </div>
                <p className="font-gaegu text-lg md:text-xl text-slate-800 font-bold leading-relaxed whitespace-pre-wrap">
                  "{savedReply}"
                </p>
                <div className="text-right mt-3">
                  <button
                    onClick={() => setSavedReply('')}
                    className="text-[11px] text-pink-600 hover:text-rose-600 underline font-sans font-medium"
                  >
                    답장 다시 적기
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveReply} className="space-y-3">
                <p className="text-xs text-slate-500">
                  편지를 읽고 하고 싶은 말이 있다면 여기에 편하게 적어줘 🤍
                </p>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="예: 승원아 편지 너무 감동이야... 항상 고맙고 나도 많이 사랑해! 오늘 맛있는 거 먹으러 가자 🤍"
                  rows={3}
                  className="w-full bg-pink-50/40 border border-pink-200 rounded-2xl p-3.5 text-xs md:text-sm text-slate-800 focus:outline-none focus:border-pink-400 resize-none"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs md:text-sm hover:scale-105 active:scale-95 transition flex items-center gap-2 shadow-md shadow-pink-300/50 border border-white"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>승원이에게 답장 남기기</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
