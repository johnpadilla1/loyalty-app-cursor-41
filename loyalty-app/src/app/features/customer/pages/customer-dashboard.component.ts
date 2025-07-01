import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { CustomerDashboardService, CustomerProfile, Reward, Activity } from '../services/customer-dashboard.service';

interface CustomerDashboardData {
  name: string;
  avatarUrl?: string;
  points: number;
  totalPoints: number;
  tier: string;
  nextTier: string;
  tierProgress: number; // 0-100
  tierBenefits: string;
  nextTierPoints: number;
  availableRewards: Array<{
    id: number;
    name: string;
    description: string;
    pointsCost: number;
    exclusive: boolean;
    expiryDate: string;
    isNew?: boolean;
  }>;
  recentActivity: Array<{
    type: 'earn' | 'redeem';
    description: string;
    date: string;
    points: number;
  }>;
}

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
  standalone: true,
  imports: [
    MatCardModule, MatProgressBarModule, MatListModule, MatButtonModule, MatIconModule, MatTableModule,
    MatChipsModule, MatBadgeModule, MatTooltipModule, MatSnackBarModule, MatProgressSpinnerModule
  ]
})
export class CustomerDashboardComponent implements OnInit {
  dashboardData: any = null;
  displayedColumns: string[] = ['name', 'description', 'pointsCost', 'exclusive', 'expiryDate', 'actions'];
  loading = false;
  customerId = 1; // TODO: Replace with real user context

  constructor(
    private snackBar: MatSnackBar,
    private dashboardService: CustomerDashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    forkJoin({
      profile: this.dashboardService.getProfile(this.customerId),
      rewards: this.dashboardService.getAvailableRewards(this.customerId),
      activity: this.dashboardService.getRecentActivity(this.customerId)
    }).subscribe({
      next: ({ profile, rewards, activity }) => {
        this.dashboardData = {
          ...profile,
          availableRewards: rewards,
          recentActivity: activity
        };
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load dashboard data', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getPointsToNextTier(): number {
    if (!this.dashboardData) return 0;
    return Math.max(0, this.dashboardData.nextTierPoints - this.dashboardData.points);
  }

  getCurrentDate(): string {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getTierIcon(tier: string): string {
    switch (tier?.toLowerCase()) {
      case 'gold':
        return 'workspace_premium';
      case 'silver':
        return 'military_tech';
      case 'bronze':
        return 'emoji_events';
      case 'platinum':
        return 'diamond';
      default:
        return 'emoji_events';
    }
  }

  redeemReward(rewardId: number) {
    this.dashboardService.redeemReward(this.customerId, rewardId).subscribe({
      next: () => {
        this.snackBar.open('Reward redeemed successfully!', 'Close', { duration: 2500 });
        this.loadDashboard();
      },
      error: () => {
        this.snackBar.open('Failed to redeem reward', 'Close', { duration: 3000 });
      }
    });
  }
}
