import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GymClass } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ClassesService {
  private readonly base = `${environment.apiUrl}/classes`;
  constructor(private http: HttpClient) {}

  create(body: Partial<GymClass>): Observable<GymClass> {
    return this.http
      .post<{ message: string; class: GymClass }>(`${this.base}/create`, body)
      .pipe(map((res) => res.class));
  }
  getAll(): Observable<GymClass[]> {
    return this.http
      .get<{ classes: GymClass[] }>(`${this.base}/getAllClasses`)
      .pipe(map((res) => res.classes));
  }
  myClasses(): Observable<GymClass[]> {
    return this.http
      .get<{ classes: GymClass[] }>(`${this.base}/My-classes`)
      .pipe(map((res) => res.classes));
  }
  getById(id: string): Observable<GymClass> {
    return this.http
      .get<{ class: GymClass }>(`${this.base}/${id}`)
      .pipe(map((res) => res.class));
  }
  update(id: string, body: Partial<GymClass>): Observable<GymClass> {
    return this.http
      .put<{ message: string; class: GymClass }>(`${this.base}/${id}`, body)
      .pipe(map((res) => res.class));
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
