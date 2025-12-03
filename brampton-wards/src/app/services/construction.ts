import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstructionService {

  private dataUrl = 'assets/data/construction.json'; // JSON in assets folder

  constructor(private http: HttpClient) {}

  // Get ALL construction items
  getAllConstruction(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.features || []) // ensure it returns an array
    );
  }

  getConstructionByWard(wardNumber: string): Observable<any[]> {
  return this.getAllConstruction().pipe(
    map(features => features
      .filter((item: any) => String(item.properties.WARD) === String(wardNumber))
      .map(item => ({
        projectName: item.properties.TITLE,
        status: item.properties.STATUS,
        projectType: item.properties.TYPE_OF_PROJECT,
        geometry: item.geometry
      }))
    )
  );
}

  }

