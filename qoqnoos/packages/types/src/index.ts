export type Language = 'EN' | 'FA';
export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'CLINICAL' | 'RETREAT';
export type SessionType = 'TEXT' | 'VOICE' | 'VIDEO';
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';
export type ContentType = 'MEDITATION' | 'PODCAST' | 'BOOK_RECOMMENDATION' | 'ARTICLE' | 'VIDEO' | 'BREATHWORK' | 'SOUND_BATH' | 'EXERCISE' | 'WORKSHOP';
export type Goal = 'TRAUMA_HEALING' | 'RELATIONSHIP_HEALTH' | 'ANXIETY_MANAGEMENT' | 'GRIEF_PROCESSING' | 'CULTURAL_IDENTITY' | 'SELF_DISCOVERY' | 'FAMILY_DYNAMICS' | 'CAREER_BURNOUT' | 'SPIRITUAL_GROWTH';
export type PsychFramework = 'gabor_mate' | 'esther_perel' | 'byron_katie' | 'rumi_sufi' | 'persian_cultural' | 'cbt_mindfulness';

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  language: Language;
  isRTL: boolean;
  persianHeritage: boolean;
  subscriptionTier: SubscriptionTier;
}

export interface CompanionMessage {
  id: string;
  role: MessageRole;
  content: string;
  contentFa?: string;
  framework?: PsychFramework;
  emotion?: string;
  timestamp: Date;
}

export interface MoodEntry {
  mood: number;
  energy: number;
  anxiety: number;
  notes?: string;
  createdAt: Date;
}
