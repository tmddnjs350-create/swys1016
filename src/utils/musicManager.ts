import { audioEngine } from './audioPlayer';
import { loadCustomAudio, saveCustomAudio, removeCustomAudio } from './customAudio';

type Listener = (state: {
  isPlaying: boolean;
  isCustom: boolean;
  trackTitle: string;
  subtitle: string;
  trackIndex: number;
}) => void;

class MusicManager {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isCustom: boolean = false;
  private customBlobUrl: string | null = null;
  private customTitle: string = '';
  private listeners: Set<Listener> = new Set();
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initPromise = this.init();
    }
  }

  private async init() {
    if (this.initialized) return;
    this.initialized = true;

    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.preload = 'auto';

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.notify();
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notify();
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.isCustom && this.audioElement) {
        this.audioElement.currentTime = 0;
        this.audioElement.play().catch(() => {});
      }
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio playback error, falling back cleanly:', e);
      this.isPlaying = false;
      this.notify();
    });

    // 1. Check for pre-bundled static song on server (/music/bgm.mp3, etc.)
    const loadedStatic = await this.checkAndLoadStaticTrack();

    // 2. If no server static song, check browser IndexedDB for previously uploaded audio
    if (!loadedStatic) {
      try {
        const stored = await loadCustomAudio();
        if (stored && stored.blob && stored.blob.size > 500) {
          await this.setCustomTrack(stored.blob, stored.fileName, false, false);
        }
      } catch (e) {
        console.warn('Could not read IndexedDB custom audio:', e);
      }
    }

    // 3. Synth engine subscription for default fallback background music
    audioEngine.subscribe((synthPlaying) => {
      if (!this.isCustom) {
        this.isPlaying = synthPlaying;
        this.notify();
      }
    });
  }

  // Safe check for static audio files on server
  public async checkAndLoadStaticTrack(): Promise<boolean> {
    const rawBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
      ? import.meta.env.BASE_URL
      : '/';
    const cleanBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

    const candidatePaths = [
      `${cleanBase}music/bgm.mp3`,
      `${cleanBase}music/BGM.mp3`,
      `${cleanBase}music/bgm.MP3`,
      `${cleanBase}music/birthday.mp3`,
      `${cleanBase}music/song.mp3`,
      '/music/bgm.mp3',
      '/music/BGM.mp3',
      'music/bgm.mp3',
      './music/bgm.mp3',
    ];

    // Remove duplicates
    const uniquePaths = Array.from(new Set(candidatePaths));

    for (const url of uniquePaths) {
      try {
        const headOrGet = await fetch(url, {
          method: 'GET',
          headers: { Range: 'bytes=0-16' },
        });

        if (!headOrGet.ok && headOrGet.status !== 206) continue;

        const contentType = (headOrGet.headers.get('content-type') || '').toLowerCase();

        // Reject if server responded with SPA fallback index.html
        if (contentType.includes('text/html')) {
          continue;
        }

        // Double check response text doesn't start with HTML
        const textSample = await headOrGet.clone().text().catch(() => '');
        if (textSample.trim().startsWith('<!DOCTYPE') || textSample.trim().startsWith('<html')) {
          continue;
        }

        // Valid audio file detected on server!
        this.isCustom = true;
        this.customTitle = '승원이가 준비한 생일 축하 노래 🎵';
        if (this.audioElement) {
          this.audioElement.src = url;
          this.audioElement.loop = true;
          this.audioElement.preload = 'auto';
          this.audioElement.load();
        }
        this.notify();
        return true;
      } catch {
        // Continue checking other candidates
      }
    }
    return false;
  }

  public subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn(this.getState());
    return () => {
      this.listeners.delete(fn);
    };
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isCustom: this.isCustom,
      trackTitle: this.isCustom ? this.customTitle : '연수 생일 축하 오르골 🎂',
      subtitle: this.isCustom ? '승원이가 올린 연수의 특별한 노래 (무한 반복 중 🔁)' : '기본 생일 축하 멜로디 (무한 반복 중 🔁)',
      trackIndex: 0,
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  public async setCustomTrack(blob: Blob, fileName: string, autoPlay: boolean = true, persistToDb: boolean = true) {
    audioEngine.pause();

    if (this.customBlobUrl) {
      URL.revokeObjectURL(this.customBlobUrl);
    }

    this.customBlobUrl = URL.createObjectURL(blob);
    this.customTitle = fileName;
    this.isCustom = true;

    if (this.audioElement) {
      this.audioElement.src = this.customBlobUrl;
      this.audioElement.loop = true;
      this.audioElement.load();
      if (autoPlay) {
        try {
          await this.audioElement.play();
          this.isPlaying = true;
        } catch {
          this.isPlaying = false;
        }
      }
    }

    if (persistToDb) {
      await saveCustomAudio(blob, fileName);
    }
    this.notify();
  }

  // Upload to server API (/api/upload-bgm) so it is permanently saved as public/music/bgm.mp3
  public async uploadAndSetCustomTrack(file: File): Promise<{ success: boolean; message: string }> {
    audioEngine.pause();

    let serverSaved = false;
    try {
      const res = await fetch('/api/upload-bgm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: file,
      });
      if (res.ok) {
        serverSaved = true;
      }
    } catch (e) {
      console.warn('Server upload not reachable, saving to local browser storage:', e);
    }

    // Save to IndexedDB as browser cache
    try {
      await saveCustomAudio(file, file.name);
    } catch (e) {
      console.warn('Could not save to IndexedDB:', e);
    }

    // Immediately play the uploaded file
    const displayName = file.name.replace(/\.[^/.]+$/, '');
    await this.setCustomTrack(file, displayName || file.name, true, false);

    return {
      success: true,
      message: serverSaved
        ? '서버(/public/music/bgm.mp3)에 저장 완료! 이제 모든 폰과 기기에서 이 노래가 자동 재생됩니다 🎵'
        : '노래가 성공적으로 등록되었습니다 🎵',
    };
  }

  public async removeCustomTrack() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }
    if (this.customBlobUrl) {
      URL.revokeObjectURL(this.customBlobUrl);
      this.customBlobUrl = null;
    }
    this.isCustom = false;
    this.customTitle = '';
    await removeCustomAudio();
    this.isPlaying = false;
    this.notify();
  }

  public async unlockAudio() {
    await audioEngine.unlock();
    if (this.audioElement && this.audioElement.src && this.isPlaying) {
      this.audioElement.play().catch(() => {});
    }
  }

  public async play() {
    if (this.initPromise) {
      await this.initPromise;
    }
    await audioEngine.unlock();

    if (this.isCustom && this.audioElement && this.audioElement.src) {
      audioEngine.pause();
      try {
        await this.audioElement.play();
        this.isPlaying = true;
      } catch (err) {
        console.warn('Audio play failed, falling back to synth:', err);
        audioEngine.play();
        this.isPlaying = true;
      }
      this.notify();
    } else {
      if (this.audioElement) {
        this.audioElement.pause();
      }
      audioEngine.play();
      this.isPlaying = true;
      this.notify();
    }
  }

  public pause() {
    if (this.isCustom && this.audioElement) {
      this.audioElement.pause();
    }
    audioEngine.pause();
    this.isPlaying = false;
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public restartTrack() {
    if (this.isCustom && this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.play().catch(() => {});
      this.isPlaying = true;
      this.notify();
    } else {
      audioEngine.resetTrack();
      audioEngine.play();
      this.isPlaying = true;
      this.notify();
    }
  }

  public setVolume(volume: number) {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  public getVolume(): number {
    return this.audioElement ? this.audioElement.volume : 1;
  }
}

export const musicManager = new MusicManager();
