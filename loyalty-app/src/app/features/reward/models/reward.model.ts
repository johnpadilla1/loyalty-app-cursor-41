export interface Reward {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  exclusive: boolean;
  expiryDate: string; // ISO date string
  customerId?: number;
} 