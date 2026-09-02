import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkoutPlan } from '../models/models';

@Injectable({ providedIn: 'root' })
export class WorkoutPlansService {
  private readonly base = `${environment.apiUrl}/workoutPlans`;
  constructor(private http: HttpClient) {}

  /** Backend wraps every response in `{ data: ... }`. */
  create(body: Partial<WorkoutPlan>): Observable<WorkoutPlan> {
    return this.http
      .post<{ data: WorkoutPlan }>(`${this.base}/create`, body)
      .pipe(map((res) => res.data));
  }
  getAll(): Observable<WorkoutPlan[]> {
    return this.http
      .get<{ data: WorkoutPlan[] }>(this.base)
      .pipe(map((res) => res.data));
  }
  byMember(memberId: string): Observable<WorkoutPlan[]> {
    return this.http
      .get<{ data: WorkoutPlan[] }>(`${this.base}/member/${memberId}`)
      .pipe(map((res) => res.data));
  }
  getById(id: string): Observable<WorkoutPlan> {
    return this.http
      .get<{ data: WorkoutPlan }>(`${this.base}/${id}`)
      .pipe(map((res) => res.data));
  }
  update(id: string, body: Partial<WorkoutPlan>): Observable<WorkoutPlan> {
    return this.http
      .put<{ data: WorkoutPlan }>(`${this.base}/${id}`, body)
      .pipe(map((res) => res.data));
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
