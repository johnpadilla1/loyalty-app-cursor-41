import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'campaign',
        loadComponent: () => import('./features/campaign/pages/campaign-list/campaign-list.component').then(m => m.CampaignListComponent)
      },
      {
        path: 'loyalty',
        loadComponent: () => import('./features/loyalty/pages/loyalty-list/loyalty-list.component').then(m => m.LoyaltyListComponent)
      },
      {
        path: 'reward',
        loadComponent: () => import('./features/reward/pages/reward-list/reward-list.component').then(m => m.RewardListComponent)
      },
      { path: '', redirectTo: 'campaign', pathMatch: 'full' },
      { path: '**', redirectTo: 'campaign' }
    ]
  }
];
