import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/properties`;

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl);
  }

  getProperty(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  createProperty(data: Omit<Property, 'id'>): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, data);
  }
}
