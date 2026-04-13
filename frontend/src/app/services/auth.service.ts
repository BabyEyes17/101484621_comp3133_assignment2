import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { LOGIN_QUERY, SIGNUP_MUTATION } from '../graphql/queries';
import { AuthResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'emp_mgmt_token';
  private readonly USER_KEY = 'emp_mgmt_user';

  constructor(private apollo: Apollo, private router: Router) {}

  login(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.apollo.query<{ login: AuthResponse }>({
      query: LOGIN_QUERY,
      variables: { input: { username: username || undefined, email: email || undefined, password } }
    }).pipe(
      map(result => {
        const res = result.data!.login;
        if (res.success && res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        }
        return res;
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.apollo.mutate<{ signup: AuthResponse }>({
      mutation: SIGNUP_MUTATION,
      variables: { input: { username, email, password } }
    }).pipe(
      map(result => {
        const res = result.data!.signup;
        if (res.success && res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        }
        return res;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.apollo.client.clearStore();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): any {
    const u = localStorage.getItem(this.USER_KEY);
    return u ? JSON.parse(u) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
