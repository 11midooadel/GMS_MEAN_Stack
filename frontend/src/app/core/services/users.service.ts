import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'trainer' | 'member';
  phone?: string;
  status?: string;
  assignedTrainer?: any;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // 1. Get all users or filter by role ('member', 'trainer', etc.)
  getUsers(role?: string): Observable<User[]> {
    let params = new HttpParams();
    if (role) {
      params = params.set('role', role);
    }
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  // Alias used by some template components
  getAll(role?: string): Observable<User[]> {
    return this.getUsers(role);
  }

  // 2. Get single user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
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
  /** The members currently assigned to the logged-in Trainer. */
  getMyMembers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/my-members`);
  }
}