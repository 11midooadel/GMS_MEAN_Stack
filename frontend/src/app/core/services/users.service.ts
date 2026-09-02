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
    return this.getUserById(id);
  }

  // 3. Create a new user (with 'create' alias)
  createUser(userData: Partial<User> | any): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  create(userData: Partial<User> | any): Observable<User> {
    return this.createUser(userData);
  }

  // 4. Update existing user (with 'update' alias)
  updateUser(id: string, userData: Partial<User> | any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  update(id: string, userData: Partial<User> | any): Observable<User> {
    return this.updateUser(id, userData);
  }

  // 5. Delete user
  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.deleteUser(id);
  }
}