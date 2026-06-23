import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authState = signal<AuthState>({
    isAuthenticated: false,
    user: null
  });

  private readonly authState$ = new BehaviorSubject<AuthState>(this.authState());

  constructor() {
    // Charger l'état depuis localStorage si disponible
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      const state = JSON.parse(savedAuth);
      this.authState.set(state);
      this.authState$.next(state);
    }
  }

  login(username: string, password: string): Observable<User> {
    return new Observable(observer => {
      // Simulation de connexion (backend sera fait ultérieurement)
      setTimeout(() => {
        const user: User = {
          id: username,
          username: username,
          email: `${username}@example.com`
        };

        const newState: AuthState = {
          isAuthenticated: true,
          user: user
        };

        this.authState.set(newState);
        this.authState$.next(newState);
        localStorage.setItem('authState', JSON.stringify(newState));

        observer.next(user);
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    const newState: AuthState = {
      isAuthenticated: false,
      user: null
    };

    this.authState.set(newState);
    this.authState$.next(newState);
    localStorage.removeItem('authState');
  }

  isAuthenticated(): boolean {
    return this.authState().isAuthenticated;
  }

  getAuthState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  getCurrentUser(): User | null {
    return this.authState().user;
  }
}
