import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WardService {
  private apiUrl = 'http://localhost:5000/api/wards';

  constructor(private http: HttpClient) {}

  getAllWards(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getWardByNumber(wardNumber: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${wardNumber}`);
  }

  getWardFacilities(wardNumber: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${wardNumber}/facilities`);
  }
}