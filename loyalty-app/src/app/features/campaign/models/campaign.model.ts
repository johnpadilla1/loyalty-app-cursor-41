export interface Campaign {
  id?: number;
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  active: boolean;
  
  // UI-specific property for display purposes
  status?: 'Active' | 'Inactive';
}

export interface CampaignResponse {
  content: Campaign[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} 