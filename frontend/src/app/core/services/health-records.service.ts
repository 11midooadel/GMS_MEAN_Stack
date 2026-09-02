import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HealthRecord } from '../models/models';

@Injectable({ providedIn: 'root' })
export class HealthRecordsService {
  private readonly base = `${environment.apiUrl}/healthRecord`;
  constructor(private http: HttpClient) {}

  /** Backend wraps every response in `{ data: ... }`. */
  create(body: Partial<HealthRecord>): Observable<HealthRecord> {
    return this.http
      .post<{ data: HealthRecord }>(`${this.base}/create`, body)
      .pipe(map((res) => res.data));
  }
  memberHistory(memberId: string): Observable<HealthRecord[]> {
    return this.http
      .get<{ data: HealthRecord[] }>(`${this.base}/member/${memberId}/history`)
      .pipe(map((res) => res.data));
  }
  update(id: string, body: Partial<HealthRecord>): Observable<HealthRecord> {
    return this.http
      .put<{ data: HealthRecord }>(`${this.base}/${id}`, body)
      .pipe(map((res) => res.data));
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
