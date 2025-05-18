import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

interface LoyaltyTier {
  name: string;
  description: string;
  pointsRequired: number;
  benefits: string;
}

@Component({
  selector: 'app-loyalty-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './loyalty-list.component.html',
  styleUrl: './loyalty-list.component.scss'
})
export class LoyaltyListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'pointsRequired', 'benefits', 'actions'];
  dataSource = new MatTableDataSource<LoyaltyTier>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.fetchTiers();
  }

  fetchTiers(): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      const mockTiers: LoyaltyTier[] = [
        {
          name: 'Silver',
          description: 'Entry level tier',
          pointsRequired: 0,
          benefits: 'Basic rewards',
        },
        {
          name: 'Gold',
          description: 'Mid level tier',
          pointsRequired: 1000,
          benefits: 'Better rewards',
        },
        {
          name: 'Platinum',
          description: 'Top tier',
          pointsRequired: 5000,
          benefits: 'Premium rewards',
        },
      ];
      this.dataSource.data = mockTiers;
      this.loading = false;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 800);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreateDialog(): void {
    // TODO: Open create tier dialog
    alert('Open create tier dialog');
  }

  openEditDialog(tier: LoyaltyTier): void {
    // TODO: Open edit tier dialog
    alert('Open edit tier dialog for ' + tier.name);
  }

  confirmDelete(tier: LoyaltyTier): void {
    // TODO: Confirm and delete tier
    if (confirm(`Are you sure you want to delete tier: ${tier.name}?`)) {
      this.dataSource.data = this.dataSource.data.filter((t: LoyaltyTier) => t.name !== tier.name);
    }
  }
}
