import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Attendance } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly base = `${environment.apiUrl}/attendance`;
  constructor(private http: HttpClient) {}

  checkIn(): Observable<any> {
    return this.http.get(`${this.base}/check-in`);
  }
  checkOut(): Observable<any> {
    return this.http.get(`${this.base}/check-out`);
  }

  /** Backend wraps the list in `{ attendance: [...] }` rather than returning it directly. */
  myAttendance(): Observable<Attendance[]> {
    return this.http
      .get<{ attendance: Attendance[] }>(`${this.base}/my-attendance`)
      .pipe(map((res) => res.attendance));
  }
  byUser(userId: string): Observable<Attendance[]> {
    return this.http
      .get<{ attendance: Attendance[] }>(`${this.base}/user/${userId}`)
      .pipe(map((res) => res.attendance));
  }
}
