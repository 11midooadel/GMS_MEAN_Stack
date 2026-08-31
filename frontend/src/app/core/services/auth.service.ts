import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, Role, User } from '../models/models';

const TOKEN_KEY = 'gms_token';
const USER_KEY = 'gms_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiUrl}/users`;

  private currentUser$ = new BehaviorSubject<AuthResponse['user'] | null>(
    this.readUser()
  );
  readonly user$ = this.currentUser$.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/login`, { email, password })
      .pipe(tap((res) => this.persistSession(res)));
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/register`, { name, email, password });
  }

  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.base}/profile`);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser$.next(null);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get currentUser(): AuthResponse['user'] | null {
    return this.currentUser$.value;
  }

  get role(): Role | null {
    return this.currentUser$.value?.role ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  hasRole(...roles: Role[]): boolean {
    const r = this.role;
    return !!r && roles.includes(r);
  }

  private persistSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.currentUser$.next(res.user);
  }

  private readUser(): AuthResponse['user'] | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
