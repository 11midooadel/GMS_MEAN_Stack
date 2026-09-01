import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GymClass, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly base = `${environment.apiUrl}/enrollments`;
  constructor(private http: HttpClient) {}

  enroll(classId: string): Observable<any> {
    return this.http.post(`${this.base}/${classId}/enroll`, {});
  }
  myClasses(): Observable<GymClass[]> {
    return this.http.get<GymClass[]>(`${this.base}/my-classes`);
  }
  classMembers(classId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/${classId}/members`);
  }
  leave(classId: string): Observable<any> {
    return this.http.delete(`${this.base}/${classId}/leave`);
  }
}
