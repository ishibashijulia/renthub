import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/users';
import { environment } from '../../environments/environment';

export type SessionUser = Omit<User, 'password'>;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private usersUrl = `${environment.apiUrl}/users`;

  currentUser = signal<SessionUser | null>(this.loadUser());
  isLoggedIn = computed(() => this.currentUser() !== null);

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.usersUrl}?email=${email}&password=${password}`).pipe(
      map((users) => users[0] ?? null),
      tap((user) => {
        if (user) {
          const { password: _, ...session } = user;
          this.currentUser.set(session);
          localStorage.setItem('user', JSON.stringify(session));
        }
      }),
      map((user) => user !== null),
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  private loadUser(): SessionUser | null {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  }

  //同じメールで二重登録されないようにするための確認
  checkEmailExists(email: string): Observable<boolean> {
    return this.http
      .get<User[]>(`${this.usersUrl}?email=${email}`)
      .pipe(map((users) => users.length > 0));
  }
  //id は json-server が自動で付けてくれるからid以外
  register(data: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.usersUrl, data);
  }
}
