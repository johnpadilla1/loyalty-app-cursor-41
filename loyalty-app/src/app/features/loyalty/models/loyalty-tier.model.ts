export interface LoyaltyTier {
  id: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  multiplier: number;
  benefits: string;
} 