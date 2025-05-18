import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';

import { CampaignService } from '../../services/campaign.service';
import { Campaign, CampaignResponse } from '../../models/campaign.model';
import { CampaignDialogComponent } from '../../components/campaign-dialog.component';
import { DeleteConfirmDialogComponent } from '../../components/delete-confirm-dialog.component';

@Component({
  selector: 'app-campaign-list',
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
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatGridListModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss',
})
export class CampaignListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'description', 'startDate', 'endDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Campaign>([]);
  loading = false;
  totalItems = 0;
  pageIndex = 0;
  pageSize = 10;
  filterValue = '';
  sortDirection = 'desc';
  sortField = 'startDate';
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: any;

  constructor(
    private campaignService: CampaignService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  ngAfterViewInit(): void {
    // Set up data source with sort and pagination
    if (this.dataSource) {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      
      if (this.sort) {
        this.dataSource.sort = this.sort;
        
        // Set up sorting and filtering
        this.sort.sortChange.subscribe((sort: Sort) => {
          this.sortDirection = sort.direction || 'asc';
          this.sortField = sort.active || 'startDate';
          
          if (this.paginator) {
            this.paginator.pageIndex = 0;
          }
          
          this.loadCampaigns();
        });
      }
    }

    // Handle page events
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.loadCampaigns();
      });
    }

    // Set up search with debounce
    if (this.input?.nativeElement) {
      fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          tap(() => {
            if (this.paginator) {
              this.paginator.pageIndex = 0;
            }
            this.loadCampaigns();
          })
        )
        .subscribe();
    }
  }

  loadCampaigns(): void {
    this.loading = true;
    const sortString = `${this.sortField},${this.sortDirection}`;

    if (this.filterValue) {
      this.campaignService.searchCampaignsByName(this.filterValue).subscribe({
        next: (campaigns) => {
          this.dataSource.data = campaigns;
          this.totalItems = campaigns.length;
          this.loading = false;
        },
        error: (error) => {
          this.showErrorMessage('Failed to load campaigns');
          this.loading = false;
        }
      });
    } else {
      this.campaignService.getCampaigns(this.pageIndex, this.pageSize, sortString).subscribe({
        next: (response: CampaignResponse) => {
          this.dataSource.data = response.content;
          this.totalItems = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          this.showErrorMessage('Failed to load campaigns');
          this.loading = false;
        }
      });
    }
  }

  applyFilter(event?: Event): void {
    if (event) {
      this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    } else {
      this.filterValue = this.searchTerm.trim().toLowerCase();
    }
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadCampaigns();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CampaignDialogComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.campaignService.createCampaign(result).subscribe({
          next: () => {
            this.loadCampaigns();
            this.showSuccessMessage('Campaign created successfully');
          },
          error: (error) => {
            this.showErrorMessage('Failed to create campaign');
            this.loading = false;
          }
        });
      }
    });
  }

  openEditDialog(campaign: Campaign): void {
    const dialogRef = this.dialog.open(CampaignDialogComponent, {
      width: '600px',
      data: { campaign, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.campaignService.updateCampaign(campaign.id!, result).subscribe({
          next: () => {
            this.loadCampaigns();
            this.showSuccessMessage('Campaign updated successfully');
          },
          error: (error) => {
            this.showErrorMessage('Failed to update campaign');
            this.loading = false;
          }
        });
      }
    });
  }

  confirmDelete(campaign: Campaign): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: {
        entityName: 'Campaign',
        itemName: campaign.name
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.loading = true;
        this.campaignService.deleteCampaign(campaign.id!).subscribe({
          next: () => {
            this.loadCampaigns();
            this.showSuccessMessage('Campaign deleted successfully');
          },
          error: (error) => {
            this.showErrorMessage('Failed to delete campaign');
            this.loading = false;
          }
        });
      }
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
