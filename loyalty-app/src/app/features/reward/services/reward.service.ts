import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reward } from '../models/reward.model';

@Injectable({ providedIn: 'root' })
export class RewardService {
  private apiUrl = '/api/rewards'; // Adjust base URL as needed

  constructor(private http: HttpClient) {}

  getRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(this.apiUrl);
  }

  createReward(reward: Partial<Reward>): Observable<Reward> {
    return this.http.post<Reward>(this.apiUrl, reward);
  }

  updateReward(id: number, reward: Partial<Reward>): Observable<Reward> {
    return this.http.put<Reward>(`${this.apiUrl}/${id}`, reward);
  }

  deleteReward(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 