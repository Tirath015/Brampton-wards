import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = 'http://localhost:5000/api/gemini';

  constructor(private http: HttpClient) {}

  analyzeWard(wardNumber: number, facilityData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/analyze-ward`, {
      wardNumber,
      facilityData
    });
  }
}