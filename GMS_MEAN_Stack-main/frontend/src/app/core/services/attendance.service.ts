import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  myAttendance(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.base}/my-attendance`);
  }
  byUser(userId: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.base}/user/${userId}`);
  }
}
