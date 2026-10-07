export type ThemeMode = 'dark-sonic' | 'light-acoustic' | 'graphite-wave';

export type SlideType =
  | 'title'
  | 'agenda'
  | 'team'
  | 'smart-goal'
  | 'audience'
  | 'analogs'
  | 'idea-collage'
  | 'idea-features'
  | 'idea-workflow'
  | 'social-impact'
  | 'roadmap'
  | 'final';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  colorScheme: 'cyan' | 'navy' | 'amber' | 'teal';
  bio?: string;
}

export interface SmartPillar {
  letter: string;
  nameEn: string;
  nameRu: string;
  description: string;
  color: string;
}

export interface MetricItem {
  id: string;
  value: string;
  label: string;
  color?: string;
  detail?: string;
}

export interface AnalogItem {
  id: string;
  title: string;
  tag: string;
  isOurs?: boolean;
  points: string[];
}

export interface ShowcaseImage {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  gradient: string;
  type: string;
}

export interface SlideData {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  notes?: string;
  payload: any;
}

export interface PresentationProject {
  title: string;
  teamName: string;
  tagline: string;
  theme: ThemeMode;
  slides: SlideData[];
}
