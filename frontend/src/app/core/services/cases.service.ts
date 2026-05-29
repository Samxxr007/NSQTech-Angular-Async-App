import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VerificationCase } from '../../shared/models/case.model';
import { PaginatedResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class CasesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cases`;

  getCases(params?: any): Observable<PaginatedResponse<VerificationCase>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<PaginatedResponse<VerificationCase>>(this.apiUrl, { params: httpParams });
  }

  getCase(id: string): Observable<VerificationCase> {
    return this.http.get<VerificationCase>(`${this.apiUrl}/${id}`);
  }
}
