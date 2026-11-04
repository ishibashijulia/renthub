import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyComment } from '../models/comment';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/comments`;

  getComments(propertyId: number): Observable<PropertyComment[]> {
    return this.http.get<PropertyComment[]>(
      `${this.apiUrl}?propertyId=${propertyId}&_sort=createdAt&_order=asc`,
    );
  }

  addComment(data: Omit<PropertyComment, 'id'>): Observable<PropertyComment> {
    return this.http.post<PropertyComment>(this.apiUrl, data);
  }
}
