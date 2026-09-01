import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HealthRecord } from '../models/models';

@Injectable({ providedIn: 'root' })
export class HealthRecordsService {
  private readonly base = `${environment.apiUrl}/healthRecord`;
  constructor(private http: HttpClient) {}

  create(body: Partial<HealthRecord>): Observable<any> {
    return this.http.post(`${this.base}/create`, body);
  }
  memberHistory(memberId: string): Observable<HealthRecord[]> {
    return this.http.get<HealthRecord[]>(`${this.base}/member/${memberId}/history`);
  }
  update(id: string, body: Partial<HealthRecord>): Observable<HealthRecord> {
    return this.http.put<HealthRecord>(`${this.base}/${id}`, body);
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
