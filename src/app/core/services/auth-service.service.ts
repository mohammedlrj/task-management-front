import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../../shared/models/register-request';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../shared/models/auth-response';
import { LoginRequest } from '../../shared/models/login-request';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = `${environment.apiUrl}/Auth`

  constructor(private http: HttpClient) { }

  register(user: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, user);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
  }

  googleLogin(idToken: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/google-login`, { idToken });
  }

  saveToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  logout() {
    localStorage.removeItem('jwt_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
