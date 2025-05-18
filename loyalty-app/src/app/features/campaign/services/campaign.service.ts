import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Campaign, CampaignResponse } from '../models/campaign.model';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private apiUrl = '/api/campaigns'; // Using relative URL for proxy configuration

  constructor(private http: HttpClient) {}

  getCampaigns(page = 0, size = 10, sort = 'startDate,desc'): Observable<CampaignResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        // Handle both array response and paginated response formats
        if (Array.isArray(response)) {
          // Direct array response - transform to expected paginated format
          const transformedCampaigns = response.map((campaign: any) => ({
            ...campaign,
            status: campaign.active ? 'Active' : 'Inactive'
          }));
          
          return {
            content: transformedCampaigns,
            totalElements: transformedCampaigns.length,
            totalPages: 1,
            size: transformedCampaigns.length,
            number: 0
          } as CampaignResponse;
        } else {
          // Already paginated response
          if (response.content) {
            response.content = response.content.map((campaign: Campaign) => ({
              ...campaign,
              status: campaign.active ? 'Active' : 'Inactive'
            }));
          }
          return response;
        }
      }),
      catchError(this.handleError)
    );
  }

  getActiveCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/active`).pipe(
      map(campaigns => campaigns.map(campaign => ({
        ...campaign,
        status: campaign.active ? 'Active' : 'Inactive'
      } as Campaign))),
      catchError(this.handleError)
    );
  }

  getRunningCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/running`).pipe(
      map(campaigns => campaigns.map(campaign => ({
        ...campaign,
        status: campaign.active ? 'Active' : 'Inactive'
      } as Campaign))),
      catchError(this.handleError)
    );
  }

  searchCampaignsByName(name: string): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/search`, {
      params: new HttpParams().set('name', name)
    }).pipe(
      map(campaigns => campaigns.map(campaign => ({
        ...campaign,
        status: campaign.active ? 'Active' : 'Inactive'
      } as Campaign))),
      catchError(this.handleError)
    );
  }

  getCampaignById(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.apiUrl}/${id}`).pipe(
      map(campaign => ({
        ...campaign,
        status: campaign.active ? 'Active' : 'Inactive'
      } as Campaign)),
      catchError(this.handleError)
    );
  }

  createCampaign(campaign: Partial<Campaign>): Observable<Campaign> {
    return this.http.post<Campaign>(this.apiUrl, campaign).pipe(
      catchError(this.handleError)
    );
  }

  updateCampaign(id: number, campaign: Partial<Campaign>): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.apiUrl}/${id}`, campaign).pipe(
      catchError(this.handleError)
    );
  }

  deleteCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 