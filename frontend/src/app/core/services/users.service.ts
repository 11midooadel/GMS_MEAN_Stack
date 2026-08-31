import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly base = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }
  create(body: Partial<User> & { password: string }): Observable<any> {
    return this.http.post(this.base, body);
  }
  update(id: string, body: Partial<User> & { password?: string }): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}`, body);
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
  assignTrainer(memberId: string, trainerId: string): Observable<any> {
    return this.http.put(`${this.base}/assign-trainer`, { memberId, trainerId });
  }
}
