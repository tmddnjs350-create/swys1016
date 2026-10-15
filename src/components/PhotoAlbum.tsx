import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioPlayer';
import { MemoryPhoto } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { Camera, ImagePlus, Heart, Sparkles, Calendar, MapPin, X, ArrowRight, Edit3, Trash2, RefreshCw } from 'lucide-react';

const INITIAL_PHOTOS: MemoryPhoto[] = [
  {
    id: 'p1',
    title: '연수를 처음 봤던 날',
    date: '추운 어느 날',
    location: '승원이 집 앞',
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
    caption: '얼굴이 개연성이긴해 🌸',
  },
  {
    id: 'p2',
    title: '연수 얼굴에 행복 가득했던 식사 타임',
    date: '맛있는 식당',
    location: '연수가 좋아하는 식당',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    caption: '맛있는 거 먹을 때 볼 뽈록해지면서 행복해하는 연수 표정이 제일 귀여워 🍓',
  },
  {
    id: 'p3',
    title: '손 꼭 잡고 밤공기 마시던 날',
    date: '선선한 가을 저녁',
    location: '가로등 아래 조용한 길',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
    caption: '손만 잡고 걸어도 하루 피로가 사르르 녹아내리던 밤 ✨',
  },
  {
    id: 'p4',
    title: '[예약석] 우리가 함께 떠날 푸른 바다 여행',
    date: '우리의 다음 여행지에서 ✈️',
    location: '파도 소리 들리는 바닷가',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    caption: '아직 채우지 못했지만, 곧 연수 손잡고 시원한 바다 보러 가서 예쁘게 찍어올 자리! 🌊',
    isFuturePlaceholder: true,
  },
  {
    id: 'p5',
    title: '[예약석] 내년 10월 16일 생일 사진',
    date: '2027년 10월 16일',
    location: '승원이 곁에서',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
    caption: '내년에도, 내후년에도 연수 생일은 무조건 내가 세상에서 제일 행복하게 만들어 줄게 🎂',
    isFuturePlaceholder: true,
  },
  {
    id: 'p6',
    title: '[예약석] 10년 뒤에도 장난치고 있을 우리 둘',
    date: '먼 훗날 어느 날',
    location: '우리의 따뜻한 보금자리',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    caption: '10년은 너무 짧긴해 그치? 💍',
    isFuturePlaceholder: true,
  },
];

interface PhotoAlbumProps {
  onGoToProfile: () => void;
}

export const PhotoAlbum: React.FC<PhotoAlbumProps> = ({ onGoToProfile }) => {
  const [photos, setPhotos] = useState<MemoryPhoto[]>(() => {
    const saved = localStorage.getItem('yeon_soo_photos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_PHOTOS;
  });

  const [likes, setLikes] = useState<{ [id: string]: number }>({});
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<MemoryPhoto | null>(null);

  // New photo form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newCaption, setNewCaption] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('yeon_soo_photos', JSON.stringify(photos));
  }, [photos]);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playCutePop();
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playCutePop();
    setDeleteTargetId(id);
  };

  const executeDeletePhoto = () => {
    if (!deleteTargetId) return;
    audioEngine.playCutePop();
    setPhotos((prev) => prev.filter((p) => p.id !== deleteTargetId));
    if (selectedPhoto && selectedPhoto.id === deleteTargetId) {
      setSelectedPhoto(null);
    }
    setDeleteTargetId(null);
  };

  const handleOpenEdit = (photo: MemoryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playCutePop();
    setEditingPhoto({ ...photo });
  };

  const executeResetPhotos = () => {
    audioEngine.playCutePop();
    setPhotos(INITIAL_PHOTOS);
    localStorage.removeItem('yeon_soo_photos');
    setShowResetConfirm(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit && editingPhoto) {
          setEditingPhoto({ ...editingPhoto, imageUrl: reader.result as string });
        } else {
          setNewImageUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl) return;

    audioEngine.playConfettiPop();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    const newPhoto: MemoryPhoto = {
      id: 'photo-' + Date.now(),
      title: newTitle.trim(),
      date: newDate.trim() || '2026년 10월 16일',
      location: newLocation.trim() || '승원이와 연수의 추억 속',
      imageUrl: newImageUrl,
      caption: newCaption.trim() || '우리 둘만의 소중한 한 컷 🤍',
      isFuturePlaceholder: false,
    };

    setPhotos([newPhoto, ...photos]);
    setShowUploadModal(false);
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewCaption('');
    setNewImageUrl('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    audioEngine.playCutePop();
    setPhotos((prev) =>
      prev.map((p) => (p.id === editingPhoto.id ? editingPhoto : p))
    );
    if (selectedPhoto && selectedPhoto.id === editingPhoto.id) {
      setSelectedPhoto(editingPhoto);
    }
    setEditingPhoto(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-white/85 backdrop-blur-xl border border-pink-200/90 p-6 md:p-8 text-center shadow-[0_15px_35px_rgba(244,114,182,0.1)] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-32 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs font-bold mb-3 shadow-sm">
          <Camera className="w-3.5 h-3.5 text-pink-400" />
          <span>우리의 추억 & 앞으로 채워갈 이야기</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 font-gowun">
          연수와 승원이의 폴라로이드 갤러리 📸
        </h2>
        <p className="text-slate-600 text-xs md:text-sm max-w-lg mx-auto mb-5 leading-relaxed">
          "우리 아직 못 가본 곳도, 못 찍은 사진도 너무 많잖아.<br />
          여기 빈자리들, 앞으로 사계절 내내 손잡고 다니면서 예쁜 추억으로 다 채우자 🤍"
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs md:text-sm shadow-md hover:scale-105 active:scale-95 transition border border-white"
          >
            <ImagePlus className="w-4 h-4" />
            <span>우리 사진 직접 올리기 / 추억 채우기</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 text-slate-500 hover:text-slate-800 text-xs font-semibold border border-pink-200 transition shadow-sm"
            title="기본 사진 6장으로 되돌리기"
          >
            <RefreshCw className="w-3.5 h-3.5 text-pink-400" />
            <span>사진첩 초기화</span>
          </button>
        </div>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {photos.map((item) => {
          const isLiked = (likes[item.id] || 0) > 0;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group cursor-pointer bg-white rounded-2xl p-3.5 pb-5 shadow-[0_10px_30px_rgba(244,114,182,0.12)] hover:shadow-[0_15px_35px_rgba(244,114,182,0.22)] transform transition-all duration-300 hover:-translate-y-2 hover:rotate-1 relative select-none border border-pink-100"
            >
              {/* Tape sticker on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-100/80 border border-pink-200 shadow-sm transform -rotate-2 pointer-events-none backdrop-blur-sm" />

              {/* Action buttons (Edit & Delete) on card top right */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-full px-2 py-1 shadow-md border border-pink-100 opacity-80 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => handleOpenEdit(item, e)}
                  className="p-1 rounded-full text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition"
                  title="사진/설명 수정"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDeletePhoto(item.id, e)}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                  title="사진 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Future Badge if placeholder */}
              {item.isFuturePlaceholder && (
                <div className="absolute top-5 left-5 z-10 px-2.5 py-1 rounded-full bg-purple-500/90 text-white text-[10px] font-bold shadow-md flex items-center gap-1 backdrop-blur-sm border border-white">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>앞으로 채워갈 예약석</span>
                </div>
              )}

              {/* Photo Image Frame */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-pink-50 mb-3 shadow-inner">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-medium">클릭해서 크게 보기 🔍</span>
                </div>
              </div>

              {/* Caption & Handwritten Note */}
              <div className="space-y-1.5 px-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-pink-400" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.location}
                  </span>
                </div>

                <h3 className="font-gaegu text-xl font-bold text-slate-800 leading-tight">
                  {item.title}
                </h3>

                <p className="font-gaegu text-slate-600 text-sm leading-snug line-clamp-2">
                  {item.caption}
                </p>

                {/* Bottom interaction row */}
                <div className="pt-2 border-t border-pink-50 flex items-center justify-between">
                  <span className="text-[10px] text-pink-400 font-bold">Yeon-soo & Seung-won</span>
                  <button
                    onClick={(e) => handleLike(item.id, e)}
                    className="flex items-center gap-1 text-xs text-rose-500 hover:scale-110 active:scale-90 transition font-medium"
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`}
                    />
                    <span>{likes[item.id] || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA to YeonSoo Profile Section */}
      <div className="pt-6 text-center">
        <button
          onClick={onGoToProfile}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-sm md:text-base shadow-[0_10px_25px_rgba(244,114,182,0.35)] hover:scale-105 active:scale-95 transition flex items-center gap-2 mx-auto border border-white/60"
        >
          <span>📖 다음으로 승원이가 쓴 '김연수 특별 도감' 보러 가기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Photo Detail Zoom Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-white rounded-3xl p-5 shadow-2xl relative text-slate-800 animate-in zoom-in-95 duration-200 border border-pink-100"
          >
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  handleOpenEdit(selectedPhoto, e);
                  setSelectedPhoto(null);
                }}
                className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 flex items-center justify-center transition"
                title="수정하기"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-pink-50 text-slate-500 hover:bg-pink-100 flex items-center justify-center transition"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-pink-50 mb-4 shadow-inner">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>🗓️ {selectedPhoto.date}</span>
                <span>📍 {selectedPhoto.location}</span>
              </div>
              <h3 className="font-gaegu text-2xl font-bold text-slate-800">
                {selectedPhoto.title}
              </h3>
              <p className="font-gaegu text-base text-slate-700 leading-relaxed bg-pink-50/60 p-3.5 rounded-xl border border-pink-100">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Photo Modal */}
      {editingPhoto && (
        <div
          onClick={() => setEditingPhoto(null)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-white border border-pink-200 rounded-3xl p-6 shadow-2xl text-slate-800 relative animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setEditingPhoto(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 text-slate-400 hover:text-slate-800 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-pink-500" />
              <span>사진 정보 및 사진 수정하기</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              제목, 날짜, 장소, 사진 파일이나 메모를 자유롭게 바꿔봐!
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">사진 파일 또는 이미지 URL</label>
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-pink-200">
                    <img src={editingPhoto.imageUrl} alt="Edit preview" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="flex-1 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-semibold border border-pink-200 transition"
                    >
                      새 사진 파일로 변경
                    </button>
                  </div>
                  <input
                    type="url"
                    value={editingPhoto.imageUrl}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value })}
                    placeholder="또는 이미지 URL 직접 입력"
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">제목</label>
                <input
                  type="text"
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">날짜</label>
                  <input
                    type="text"
                    value={editingPhoto.date}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">장소</label>
                  <input
                    type="text"
                    value={editingPhoto.location}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">폴라로이드 메모</label>
                <textarea
                  value={editingPhoto.caption}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                  rows={2}
                  className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 transition shadow-sm"
                >
                  수정 사항 저장하기
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs hover:bg-slate-200 transition"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload New Photo Modal */}
      {showUploadModal && (
        <div
          onClick={() => setShowUploadModal(false)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-white border border-pink-200 rounded-3xl p-6 shadow-2xl text-slate-800 relative animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 text-slate-400 hover:text-slate-800 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span>새로운 추억 사진 등록하기</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              연수와 승원이의 사진을 올리고 짧은 메모를 남겨봐 🤍
            </p>

            <form onSubmit={handleAddPhoto} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">사진 파일 선택</label>
                {newImageUrl ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2 border border-pink-200">
                    <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('')}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 text-[10px] text-white hover:bg-black"
                    >
                      다시 고르기
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, false)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-6 rounded-2xl border-2 border-dashed border-pink-300 hover:border-pink-400 bg-pink-50/40 hover:bg-pink-50 text-pink-600 text-xs font-semibold flex flex-col items-center justify-center gap-2 transition"
                    >
                      <Camera className="w-6 h-6 text-pink-400" />
                      <span>핸드폰 / 컴퓨터에서 사진 가져오기</span>
                    </button>

                    <div className="text-center text-[11px] text-slate-400">또는</div>

                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="이미지 주소(URL) 직접 붙여넣기"
                      className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">추억 제목</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 연수랑 맛있는 거 먹었던 날!"
                  className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">날짜</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="예: 2026.10.16"
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">장소</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="예: 한강 공원, 예쁜 카페"
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">폴라로이드 메모</label>
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="연수와 승원이에게 남기고 싶은 따뜻한 한 줄"
                  rows={2}
                  className="w-full bg-pink-50/40 border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-400"
                />
              </div>

              <button
                type="submit"
                disabled={!newImageUrl || !newTitle.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none mt-2 shadow-md"
              >
                폴라로이드 갤러리에 저장하기 ✨
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Photo Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="사진 삭제하기"
        message="정말 이 소중한 사진을 사진첩에서 삭제할까요?"
        confirmText="삭제하기"
        cancelText="취소"
        isDestructive={true}
        onConfirm={executeDeletePhoto}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Reset Photos Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="사진첩 초기화"
        message="사진첩을 기본 사진 6장 구성으로 초기화할까요?"
        confirmText="초기화하기"
        cancelText="취소"
        isDestructive={true}
        onConfirm={executeResetPhotos}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
