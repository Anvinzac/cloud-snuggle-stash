export interface BusinessCardData {
  id?: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  monogram?: string;
  website?: string;
  social?: string;
}

export type CardTheme = 
  | 'avant-garde'
  | 'swiss-grid'
  | 'fintech'
  | 'geometric'
  | 'architect'
  | 'creator'
  | 'watercolor'
  | 'oil-portrait'
  | 'ink-fusion';

export interface BusinessCardProps {
  data: BusinessCardData;
  className?: string;
}
