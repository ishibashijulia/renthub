import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Favorite } from '../models/favorite';
import { AuthService } from './auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/favorites`;

  favorites = signal<Favorite[]>([]);

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      if (!user) {
        this.favorites.set([]);
        return;
      }
      this.http
        .get<Favorite[]>(`${this.apiUrl}?userId=${user.id}`)
        .subscribe((list) => this.favorites.set(list));
    });
  }

  isFavorite(propertyId: number): boolean {
    return this.favorites().some((f) => f.propertyId === propertyId);
  }

  toggle(propertyId: number) {
    const user = this.auth.currentUser();
    if (!user) return;

    const existing = this.favorites().find((f) => f.propertyId === propertyId);

    if (existing) {
      this.http.delete<void>(`${this.apiUrl}/${existing.id}`).subscribe(() => {
        this.favorites.update((list) => list.filter((f) => f.id !== existing.id));
      });
    } else {
      this.http
        .post<Favorite>(this.apiUrl, { userId: user.id, propertyId })
        .subscribe((created) => {
          this.favorites.update((list) => [...list, created]);
        });
    }
  }
}
