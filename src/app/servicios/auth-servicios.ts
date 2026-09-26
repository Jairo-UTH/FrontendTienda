import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginRequest, LoginResponse } from '../interfaces/auth';

const TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'auth_role';
const NAME_KEY = 'auth_fullName';

@Service()
export class AuthServicios {

  private http = inject(HttpClient)
  private endPoint = `${environment.apiUrl}/Auth`

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.endPoint}/login`, request).pipe(
      tap(resp => {
        localStorage.setItem(TOKEN_KEY, resp.token)
        localStorage.setItem(ROLE_KEY, resp.role)
        localStorage.setItem(NAME_KEY, resp.fullName)
      })
    )
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    localStorage.removeItem(NAME_KEY)
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  getRole(): string | null {
    return localStorage.getItem(ROLE_KEY)
  }

  getFullName(): string | null {
    return localStorage.getItem(NAME_KEY)
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  isGerente(): boolean {
    return this.getRole() === 'Gerente'
  }
}
