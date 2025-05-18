import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoyaltyTier } from '../models/loyalty-tier.model';

@Injectable({ providedIn: 'root' })
export class LoyaltyTierService {
  private apiUrl = '/api/loyalty-tiers'; // Adjust base URL as needed

  constructor(private http: HttpClient) {}

  getTiers(): Observable<LoyaltyTier[]> {
    return this.http.get<LoyaltyTier[]>(this.apiUrl);
  }

  createTier(tier: Partial<LoyaltyTier>): Observable<LoyaltyTier> {
    return this.http.post<LoyaltyTier>(this.apiUrl, tier);
  }

  updateTier(id: number, tier: Partial<LoyaltyTier>): Observable<LoyaltyTier> {
    return this.http.put<LoyaltyTier>(`${this.apiUrl}/${id}`, tier);
  }

  deleteTier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 