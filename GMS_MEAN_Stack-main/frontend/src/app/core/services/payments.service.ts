import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment, PaymentStatus } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly base = `${environment.apiUrl}/payments`;
  constructor(private http: HttpClient) {}

  create(body: Partial<Payment>): Observable<any> {
    return this.http.post(`${this.base}/create`, body);
  }
  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.base);
  }
  history(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.base}/history`);
  }
  byMember(memberId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.base}/member/${memberId}`);
  }
  getById(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.base}/${id}`);
  }
  updateStatus(id: string, status: PaymentStatus): Observable<any> {
    return this.http.patch(`${this.base}/${id}/status`, { status });
  }
}
