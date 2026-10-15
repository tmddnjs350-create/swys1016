export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardTitle: string;
  rewardDesc: string;
  icon: string;
  isCompleted: boolean;
  completedAt?: string;
  tag: string;
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  icon: string;
  issuedAt: string;
  isUsed: boolean;
  usedAt?: string;
}

export interface MemoryPhoto {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  caption: string;
  isFuturePlaceholder?: boolean;
}

export interface MusicTrack {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  melodyType: 'birthday' | 'lofi' | 'musicbox' | 'romantic' | 'usagi';
}
