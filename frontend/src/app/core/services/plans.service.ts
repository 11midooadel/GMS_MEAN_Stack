import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Plan } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PlansService {
  private readonly base = `${environment.apiUrl}/plans`;
  constructor(private http: HttpClient) {}

  // Added the includeAll parameter to bypass the active-only filter
  getAll(includeAll: boolean = false): Observable<any> {
    const url = includeAll ? `${this.base}/view?all=true` : `${this.base}/view`;
    return this.http.get<any>(url);
  }
  getById(id: string): Observable<Plan> {
    return this.http.get<Plan>(`${this.base}/view/${id}`);
  }
  create(body: Partial<Plan>): Observable<any> {
    return this.http.post(`${this.base}/create`, body);
  }
  update(id: string, body: Partial<Plan>): Observable<Plan> {
    return this.http.put<Plan>(`${this.base}/update/${id}`, body);
  }
  enable(id: string): Observable<any> {
    return this.http.put(`${this.base}/enable/${id}`, {});
  }
  disable(id: string): Observable<any> {
    return this.http.put(`${this.base}/disable/${id}`, {});
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/delete/${id}`);
  }
}
