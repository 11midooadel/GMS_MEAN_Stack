import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Subscription } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
  private readonly base = `${environment.apiUrl}/subscriptions`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.base}`);
  }

  create(body: Partial<Subscription>): Observable<any> {
    return this.http.post(`${this.base}/create`, body);
  }
  byMember(memberId: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.base}/member/${memberId}`);
  }
  update(id: string, body: Partial<Subscription>): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.base}/${id}`, body);
  }
  cancel(id: string): Observable<any> {
    return this.http.post(`${this.base}/${id}/cancel`, {});
  }
  status(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}/status`);
  }
  expiration(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}/expiration`);
  }
}
