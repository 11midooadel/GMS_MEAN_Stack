import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role, User } from '../models/models';
import { normalizeRole } from '../utils/normalize-role';

/** The backend stores role casing inconsistently (e.g. "member" vs "member") — normalize on the way in. */
const withNormalizedRole = (u: User): User => ({ ...u, role: (normalizeRole(u.role) ?? u.role) as Role });

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly base = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.base).pipe(map((users) => users.map(withNormalizedRole)));
  }
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`).pipe(map(withNormalizedRole));
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
  /** The members currently assigned to the logged-in Trainer. */
  getMyMembers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/my-members`).pipe(map((users) => users.map(withNormalizedRole)));
  }
}
