import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoyaltyTierService } from '../services/loyalty-tier.service';
import { LoyaltyTier } from '../models/loyalty-tier.model';
import { LoyaltyTierDialogComponent } from '../components/loyalty-tier-dialog.component';
import { DeleteConfirmDialogComponent } from '../components/delete-confirm-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-loyalty-tier-list',
  templateUrl: './loyalty-tier-list.component.html',
  styleUrls: ['./loyalty-tier-list.component.scss'],
  standalone: true,
  imports: [
    MatDialog, MatTableDataSource, MatSnackBar,
    MatCardModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressSpinnerModule,
    MatPaginatorModule, MatSortModule
  ]
})
export class LoyaltyTierListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'minPoints', 'maxPoints', 'multiplier', 'benefits', 'actions'];
  dataSource = new MatTableDataSource<LoyaltyTier>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private loyaltyTierService: LoyaltyTierService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTiers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: LoyaltyTier, filter: string) => {
      const dataStr = [data.name, data.minPoints, data.maxPoints, data.multiplier, data.benefits].join(' ').toLowerCase();
      return dataStr.includes(filter.trim().toLowerCase());
    };
  }

  loadTiers() {
    this.loading = true;
    this.loyaltyTierService.getTiers().subscribe({
      next: (tiers: LoyaltyTier[]) => {
        this.dataSource.data = tiers;
        this.loading = false;
        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;
      },
      error: () => {
        this.snackBar.open('Failed to load loyalty tiers', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(LoyaltyTierDialogComponent, {
      width: '400px',
      data: { isEdit: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loyaltyTierService.createTier(result).subscribe({
          next: () => {
            this.snackBar.open('Loyalty tier created', 'Close', { duration: 2000 });
            this.loadTiers();
          },
          error: () => {
            this.snackBar.open('Failed to create loyalty tier', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openEditDialog(tier: LoyaltyTier) {
    const dialogRef = this.dialog.open(LoyaltyTierDialogComponent, {
      width: '400px',
      data: { tier, isEdit: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loyaltyTierService.updateTier(tier.id, result).subscribe({
          next: () => {
            this.snackBar.open('Loyalty tier updated', 'Close', { duration: 2000 });
            this.loadTiers();
          },
          error: () => {
            this.snackBar.open('Failed to update loyalty tier', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  confirmDelete(tier: LoyaltyTier) {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '320px',
      data: { name: tier.name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteTier(tier);
      }
    });
  }

  deleteTier(tier: LoyaltyTier) {
    this.loyaltyTierService.deleteTier(tier.id).subscribe({
      next: () => {
        this.snackBar.open('Loyalty tier deleted', 'Close', { duration: 2000 });
        this.loadTiers();
      },
      error: () => {
        this.snackBar.open('Failed to delete loyalty tier', 'Close', { duration: 3000 });
      }
    });
  }
}
