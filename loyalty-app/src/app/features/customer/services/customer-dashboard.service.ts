import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerProfile {
  id: number;
  name: string;
  avatarUrl?: string;
  points: number;
  totalPoints: number;
  tier: string;
  nextTier: string;
  tierProgress: number;
  tierBenefits: string;
  nextTierPoints: number;
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  exclusive: boolean;
  expiryDate: string;
  isNew?: boolean;
}

export interface Activity {
  type: 'earn' | 'redeem';
  description: string;
  date: string;
  points: number;
}

@Injectable({ providedIn: 'root' })
export class CustomerDashboardService {
  constructor(private http: HttpClient) {}

  getProfile(customerId: number): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(`/api/customers/${customerId}`);
  }

  getAvailableRewards(customerId: number): Observable<Reward[]> {
    return this.http.get<Reward[]>(`/api/customers/${customerId}/rewards`);
  }

  getRecentActivity(customerId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`/api/customers/${customerId}/activity`);
  }

  redeemReward(customerId: number, rewardId: number): Observable<any> {
    return this.http.post(`/api/customers/${customerId}/redeem`, { rewardId });
  }
} 