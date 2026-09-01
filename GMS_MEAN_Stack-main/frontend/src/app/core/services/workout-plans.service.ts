import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkoutPlan } from '../models/models';

@Injectable({ providedIn: 'root' })
export class WorkoutPlansService {
  private readonly base = `${environment.apiUrl}/workoutPlans`;
  constructor(private http: HttpClient) {}

  create(body: Partial<WorkoutPlan>): Observable<any> {
    return this.http.post(`${this.base}/create`, body);
  }
  getAll(): Observable<WorkoutPlan[]> {
    return this.http.get<WorkoutPlan[]>(this.base);
  }
  byMember(memberId: string): Observable<WorkoutPlan[]> {
    return this.http.get<WorkoutPlan[]>(`${this.base}/member/${memberId}`);
  }
  getById(id: string): Observable<WorkoutPlan> {
    return this.http.get<WorkoutPlan>(`${this.base}/${id}`);
  }
  update(id: string, body: Partial<WorkoutPlan>): Observable<WorkoutPlan> {
    return this.http.put<WorkoutPlan>(`${this.base}/${id}`, body);
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
