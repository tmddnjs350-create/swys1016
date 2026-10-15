import React, { useEffect, useState, useRef } from 'react';
import { musicManager } from '../utils/musicManager';
import { Play, Pause, Music, Upload, Trash2, X, RotateCcw, Volume2, VolumeX, Repeat } from 'lucide-react';

export const UsagiMusicPlayer: React.FC = () => {
  const [playerState, setPlayerState] = useState(() => ({
    isPlaying: false,
    isCustom: false,
    trackTitle: '',
    subtitle: '',
    trackIndex: 0,
  }));

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.9);

  // Position is null by default so rock-solid CSS (bottom / right) positions it perfectly on all screens!
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number; hasMoved: boolean }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
    hasMoved: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const vinylRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = musicManager.subscribe((state) => {
      setPlayerState(state);
    });
    return () => unsubscribe();
  }, []);

  // Helper to get current coordinates
  const getCurrentCoords = () => {
    if (position) return position;
    if (vinylRef.current) {
      const rect = vinylRef.current.getBoundingClientRect();
      return { x: rect.left, y: rect.top };
    }
    return { x: window.innerWidth - 80, y: window.innerHeight - 140 };
  };

  // Mouse drag handlers (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    const current = getCurrentCoords();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: current.x,
      posY: current.y,
      hasMoved: false,
    };
    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;
      if (Math.hypot(dx, dy) > 5) {
        dragStartRef.current.hasMoved = true;
      }
      const newX = Math.min(Math.max(10, dragStartRef.current.posX + dx), window.innerWidth - 75);
      const newY = Math.min(Math.max(10, dragStartRef.current.posY + dy), window.innerHeight - 75);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Touch drag handlers (Mobile) - using window listeners for flawless dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    const current = getCurrentCoords();
    const touch = e.touches[0];
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      posX: current.x,
      posY: current.y,
      hasMoved: false,
    };
    setIsDragging(true);

    const handleWindowTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const dx = moveTouch.clientX - dragStartRef.current.startX;
      const dy = moveTouch.clientY - dragStartRef.current.startY;
      if (Math.hypot(dx, dy) > 7) {
        dragStartRef.current.hasMoved = true;
      }
      const maxW = window.innerWidth - 68;
      const maxH = window.innerHeight - 75;
      const newX = Math.min(Math.max(10, dragStartRef.current.posX + dx), maxW);
      const newY = Math.min(Math.max(10, dragStartRef.current.posY + dy), maxH);
      setPosition({ x: newX, y: newY });
    };

    const handleWindowTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowTouchEnd);
    };

    window.addEventListener('touchmove', handleWindowTouchMove, { passive: true });
    window.addEventListener('touchend', handleWindowTouchEnd);
  };

  // Tapping the vinyl: only toggles expand if it was NOT dragged
  const handleVinylClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    musicManager.unlockAudio();
    if (!dragStartRef.current.hasMoved) {
      setIsExpanded((prev) => !prev);
    }
  };

  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadNotice('노래 저장 중...');
      const res = await musicManager.uploadAndSetCustomTrack(file);
      setUploadNotice(res.message);
      setTimeout(() => setUploadNotice(null), 5000);
    }
    e.target.value = '';
  };

  const handleRemoveCustomAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await musicManager.removeCustomTrack();
    setUploadNotice('기본 축하곡으로 변경되었습니다.');
    setTimeout(() => setUploadNotice(null), 3000);
  };

  const handleResetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPosition(null);
  };

  return (
    <>
      {/* Hidden file picker input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Floating Container (Draggable) - Visible on ALL screens with safe mobile offset */}
      <div
        ref={vinylRef}
        style={
          position
            ? {
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 9999,
                touchAction: 'none',
              }
            : {
                position: 'fixed',
                zIndex: 9999,
                touchAction: 'none',
              }
        }
        className={
          !position
            ? 'fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] right-3.5 sm:bottom-6 sm:right-6 select-none pointer-events-auto'
            : 'select-none pointer-events-auto'
        }
      >
        {/* Expanded Control Sleeve */}
        {isExpanded && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-20 right-0 sm:right-auto sm:left-0 mb-2 w-[calc(100vw-28px)] max-w-xs sm:w-80 bg-white/95 backdrop-blur-xl border border-pink-200/90 rounded-3xl p-4 shadow-[0_15px_40px_rgba(244,114,182,0.25)] text-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">🐰</span>
                <div>
                  <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Usagi's Music Box</p>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[170px]">
                    {playerState.trackTitle || '연수의 생일 멜로디'}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {position && (
                  <button
                    onClick={handleResetPosition}
                    className="p-1 rounded-full text-slate-400 hover:text-pink-600 transition"
                    title="위치 초기화 (기본 우측 하단으로)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-7 h-7 rounded-full bg-pink-50 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition"
                  title="닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="py-2.5">
              <div className="flex items-center justify-between text-xs text-pink-500/90 mb-2">
                <span className="font-medium text-slate-500 truncate max-w-[180px]">
                  {playerState.subtitle}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 font-semibold text-[10px]">
                  {playerState.isCustom ? '내 노래' : '오르골'}
                </span>
              </div>

              {/* Visualizer bars */}
              <div className="flex items-end justify-center gap-1.5 h-7 py-1">
                {[40, 75, 95, 60, 85, 50, 90, 75, 45, 80, 65, 90].map((height, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      playerState.isPlaying
                        ? 'bg-gradient-to-t from-pink-400 to-rose-300 animate-pulse'
                        : 'bg-pink-100 h-2'
                    }`}
                    style={{
                      height: playerState.isPlaying ? `${(height * (0.6 + (i % 3) * 0.2)).toFixed(0)}%` : '6px',
                      animationDelay: `${i * 90}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Play controls: Restart, Play/Pause, Loop indicator */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <button
                  onClick={() => {
                    musicManager.unlockAudio();
                    musicManager.restartTrack();
                  }}
                  className="p-2.5 rounded-full text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition hover:scale-105 active:scale-95"
                  title="곡 처음부터 다시 재생"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => musicManager.toggle()}
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 via-rose-400 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-300/60 hover:scale-105 active:scale-95 transition border-2 border-white"
                  title={playerState.isPlaying ? '일시정지' : '재생'}
                >
                  {playerState.isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <div
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-600 text-[11px] font-bold shadow-xs select-none"
                  title="노래가 끝나면 자동으로 처음부터 무한 반복됩니다"
                >
                  <Repeat className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>무한반복</span>
                </div>
              </div>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-2 mt-3 px-2 py-1.5 bg-pink-50/60 rounded-xl border border-pink-100">
                <button
                  onClick={() => {
                    if (isMuted) {
                      setIsMuted(false);
                      musicManager.setVolume(volume);
                    } else {
                      setIsMuted(true);
                      musicManager.setVolume(0);
                    }
                  }}
                  className="text-pink-500 hover:text-pink-700 transition"
                  title={isMuted ? '음소거 해제' : '음소거'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    setIsMuted(newVol === 0);
                    musicManager.setVolume(newVol);
                  }}
                  className="w-full accent-pink-500 h-1.5 bg-pink-200 rounded-lg cursor-pointer"
                  title="볼륨 조절"
                />
                <span className="text-[10px] text-pink-500 font-bold shrink-0 w-7 text-right">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            </div>

            {/* User Custom Audio Upload Section */}
            <div className="pt-2 border-t border-pink-100">
              {playerState.isCustom ? (
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate max-w-[190px]">
                    <div className="w-7 h-7 rounded-xl bg-pink-200/80 text-pink-600 flex items-center justify-center shrink-0">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate text-left">
                      <p className="text-[10px] text-pink-500 font-bold">등록된 BGM</p>
                      <span className="truncate font-bold text-slate-800 text-xs block">{playerState.trackTitle}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2 py-1 rounded-lg bg-white border border-pink-200 text-pink-600 hover:bg-pink-100 text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                      title="노래 파일 변경"
                    >
                      <Upload className="w-3 h-3" />
                      <span>변경</span>
                    </button>
                    <button
                      onClick={handleRemoveCustomAudio}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                      title="내 노래 삭제 (기본 축하곡으로 변경)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-pink-200 active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>내 노래(MP3) 넣기 & 등록</span>
                </button>
              )}
            </div>

            {uploadNotice && (
              <div className="mt-2 p-2 rounded-xl bg-pink-100/90 text-rose-600 text-[11px] font-medium leading-tight text-center animate-in fade-in">
                {uploadNotice}
              </div>
            )}

            {/* Explanatory text */}
            <div className="mt-2 text-[10px] text-slate-500 text-center leading-relaxed">
              인트로에서 홈으로 넘어갈 때부터 이 노래가 자동으로 <strong>무한 반복</strong> 재생돼요! 🎶
            </div>

            {/* Mobile Audio Tip */}
            <div className="mt-2 pt-2 border-t border-pink-100/70 text-[10px] text-pink-400/90 leading-tight text-center">
              💡 스마트폰(아이폰 등)에서 소리가 안 들린다면 기기 옆면의 <strong>무음(진동) 스위치를 해제</strong>해 주세요!
            </div>
          </div>
        )}

        {/* Pure Clean Rotating Circular Vinyl Badge (Only Chiikawa Usagi, Draggable!) */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleVinylClick}
          className={`relative group cursor-grab active:cursor-grabbing transition-transform ${
            isDragging ? 'scale-105' : 'hover:scale-105'
          }`}
          title="손가락이나 마우스로 끌어서 이동할 수 있어요!"
        >
          {/* Gentle musical note floating when playing */}
          {playerState.isPlaying && (
            <div className="absolute -top-7 -left-3 pointer-events-none">
              <span className="absolute text-pink-500 text-xs animate-bounce" style={{ animationDelay: '0ms' }}>
                🎵
              </span>
              <span className="absolute -top-2 left-6 text-amber-400 text-[10px] animate-bounce" style={{ animationDelay: '300ms' }}>
                ✨
              </span>
            </div>
          )}

          {/* Soft pastel glow halo */}
          <div
            className={`absolute -inset-1 rounded-full bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 opacity-60 blur-md transition duration-500 group-hover:opacity-100 ${
              playerState.isPlaying ? 'animate-pulse' : 'opacity-30'
            }`}
          />

          {/* Pure Rotating Circular Vinyl Body - ONLY Chiikawa Usagi inside, ZERO clutter buttons */}
          <div
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-pink-50 via-white to-pink-100 border-2 border-pink-300 shadow-[0_8px_25px_rgba(244,114,182,0.35)] flex items-center justify-center overflow-hidden transition-transform duration-200 ${
              playerState.isPlaying ? 'animate-spin-slow' : 'animate-spin-slow-paused'
            }`}
          >
            {/* Vinyl concentric groove rings */}
            <div className="absolute inset-1.5 rounded-full border border-pink-200/50" />
            <div className="absolute inset-3 rounded-full border border-pink-300/40" />

            {/* Chiikawa Usagi Center Disc Image */}
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden p-0.5 border border-pink-300/60 shadow-inner bg-pink-100">
              <img
                src="/images/usagi_scooter.jpg"
                alt="치이카와 우사기"
                className="w-full h-full object-cover rounded-full pointer-events-none select-none"
                draggable={false}
              />
              {/* Center spindle hole */}
              <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white border border-pink-400 shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
