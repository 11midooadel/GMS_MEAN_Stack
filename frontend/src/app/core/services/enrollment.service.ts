import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GymClass, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly base = `${environment.apiUrl}/enrollments`;
  constructor(private http: HttpClient) {}

  enroll(classId: string): Observable<any> {
    return this.http.post(`${this.base}/${classId}/enroll`, {});
  }

  /** Backend wraps each enrollment record with the populated class inside `.class`. */
  myClasses(): Observable<GymClass[]> {
    return this.http
      .get<{ classes: { class: GymClass }[] }>(`${this.base}/my-classes`)
      .pipe(map((res) => res.classes.map((e) => e.class)));
  }

  /** Backend wraps each enrollment record with the populated member inside `.member`. */
  classMembers(classId: string): Observable<User[]> {
    return this.http
      .get<{ members: { member: User }[] }>(`${this.base}/${classId}/members`)
      .pipe(map((res) => res.members.map((e) => e.member)));
  }

  leave(classId: string): Observable<any> {
    return this.http.delete(`${this.base}/${classId}/leave`);
  }
}
