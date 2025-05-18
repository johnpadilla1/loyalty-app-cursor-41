import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RewardService } from '../../services/reward.service';
import { Reward } from '../../models/reward.model';
import { RewardDialogComponent, RewardDialogData } from '../../components/reward-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmDialog } from '../../components/delete-confirm-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-reward-list',
  templateUrl: './reward-list.component.html',
  styleUrls: ['./reward-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatCardModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatIconModule, MatBadgeModule, MatButtonModule, MatTooltipModule, MatProgressSpinnerModule, MatDialogModule,
    MatPaginatorModule, MatSortModule,
    MatChipsModule
  ]
})
export class RewardListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'pointsCost', 'exclusive', 'expiryDate', 'actions'];
  dataSource = new MatTableDataSource<Reward>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private rewardService: RewardService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRewards();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Reward, filter: string) => {
      const dataStr = [data.name, data.description, data.pointsCost, data.exclusive, data.expiryDate].join(' ').toLowerCase();
      return dataStr.includes(filter.trim().toLowerCase());
    };
  }

  loadRewards() {
    this.loading = true;
    this.rewardService.getRewards().subscribe({
      next: (rewards: Reward[]) => {
        this.dataSource.data = rewards;
        this.loading = false;
        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;
      },
      error: () => {
        this.snackBar.open('Failed to load rewards', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(RewardDialogComponent, {
      width: '400px',
      data: { isEdit: false } as RewardDialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardService.createReward(result).subscribe({
          next: () => {
            this.snackBar.open('Reward created', 'Close', { duration: 2000 });
            this.loadRewards();
          },
          error: () => {
            this.snackBar.open('Failed to create reward', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openEditDialog(reward: Reward) {
    const dialogRef = this.dialog.open(RewardDialogComponent, {
      width: '400px',
      data: { reward, isEdit: true } as RewardDialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardService.updateReward(reward.id, result).subscribe({
          next: () => {
            this.snackBar.open('Reward updated', 'Close', { duration: 2000 });
            this.loadRewards();
          },
          error: () => {
            this.snackBar.open('Failed to update reward', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteReward(reward: Reward) {
    if (confirm(`Delete reward '${reward.name}'?`)) {
      this.rewardService.deleteReward(reward.id).subscribe({
        next: () => {
          this.snackBar.open('Reward deleted', 'Close', { duration: 2000 });
          this.loadRewards();
        },
        error: () => {
          this.snackBar.open('Failed to delete reward', 'Close', { duration: 3000 });
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  confirmDelete(reward: Reward) {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '320px',
      data: { name: reward.name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteReward(reward);
      }
    });
  }
}
