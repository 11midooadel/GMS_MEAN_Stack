import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GymClass } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ClassesService {
  private readonly base = `${environment.apiUrl}/classes`;
  constructor(private http: HttpClient) {}

  create(body: Partial<GymClass>): Observable<any> {
    return this.http.post(`${this.base}/create`, body);
  }
  getAll(): Observable<GymClass[]> {
    return this.http.get<GymClass[]>(`${this.base}/getAllClasses`);
  }
  myClasses(): Observable<GymClass[]> {
    return this.http.get<GymClass[]>(`${this.base}/My-classes`);
  }
  getById(id: string): Observable<GymClass> {
    return this.http.get<GymClass>(`${this.base}/${id}`);
  }
  update(id: string, body: Partial<GymClass>): Observable<GymClass> {
    return this.http.put<GymClass>(`${this.base}/${id}`, body);
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
