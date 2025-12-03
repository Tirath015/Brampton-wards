import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { WardService } from '../../services/ward';
import { GeminiService } from '../../services/gemini';
import { ConstructionService } from 'src/app/services/construction';

@Component({
  selector: 'app-ward-detail',
  templateUrl: './ward-detail.page.html',
  styleUrls: ['./ward-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class WardDetailPage implements OnInit {

  wardNumber: number = 0;
  ward: any = null;

  facilities: any[] = [];
  constructionList: any[] = [];

  geminiAnalysis: string = '';
  loading: boolean = false;

  facilityTypes = {
    schools: 0,
    police: 0,
    fire: 0,
    healthcare: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wardService: WardService,
    private geminiService: GeminiService,
    private constructionService: ConstructionService
  ) {}

  ngOnInit() {
    const wardNum = this.route.snapshot.paramMap.get('wardNumber');
    this.wardNumber = wardNum ? parseInt(wardNum) : 0;

    console.log('Loading ward detail for ward:', this.wardNumber);

    this.loadWardData();
    this.loadConstruction();
  }

  // ------------------------------
  //  LOAD WARD BASIC INFORMATION
  // ------------------------------
  loadWardData() {
    this.wardService.getWardByNumber(this.wardNumber).subscribe({
      next: (ward) => {
        this.ward = ward;
        console.log('Ward loaded:', ward);
        this.loadFacilities();
      },
      error: (err) => {
        console.error('Error loading ward:', err);
        alert('Error loading ward data');
      }
    });
  }

  // ------------------------------
  //  LOAD FACILITIES
  // ------------------------------
  loadFacilities() {
    this.wardService.getWardFacilities(this.wardNumber).subscribe({
      next: (facilities) => {
        this.facilities = facilities;
        console.log('Facilities loaded:', facilities);

        this.facilityTypes = {
          schools: 0,
          police: 0,
          fire: 0,
          healthcare: 0
        };

        facilities.forEach((f: any) => {
          if (f.type === 'school') this.facilityTypes.schools++;
          if (f.type === 'police') this.facilityTypes.police++;
          if (f.type === 'fire') this.facilityTypes.fire++;
          if (f.type === 'healthcare') this.facilityTypes.healthcare++;
        });

        this.getAIAnalysis();
      },
      error: (err) => {
        console.error('Error loading facilities:', err);
      }
    });
  }
// ------------------------------
// LOAD CONSTRUCTION DATA
// ------------------------------
loadConstruction() {
  this.constructionService.getConstructionByWard(String(this.wardNumber))
    .subscribe({
      next: (data) => {
        this.constructionList = data;
        console.log("Construction for ward", this.wardNumber, data);

        // Map "Archive" or other statuses if needed
        this.constructionList = this.constructionList.map(item => {
          if (!item.properties.STATUS) item.properties.STATUS = 'Planning';
          return item;
        });
      },
      error: (err) => {
        console.error("Error loading construction:", err);
      }
    });
}

// ------------------------------
// SHOW CONSTRUCTION ON MAP
// ------------------------------
showConstructionOnMap(item: any) {
  if (!item || !item.geometry) return;

  console.log("Navigate to map with construction item:", item);

  this.router.navigate(['/map'], {
    queryParams: {
      constTitle: item.properties.TITLE,
      constStatus: item.properties.STATUS,
      constType: item.properties.TYPE_OF_PROJECT,

      // send the line/path coordinates as JSON string
      constCoords: JSON.stringify(item.geometry.coordinates)
    }
  });
}



  // ------------------------------
  //  FILTER FACILITY BY TYPE
  // ------------------------------
  getFacilitiesByType(type: string): any[] {
    return this.facilities.filter(f => f.type === type);
  }

  getMaxRows(): number[] {
    const max = Math.max(
      this.getFacilitiesByType('school').length,
      this.getFacilitiesByType('police').length,
      this.getFacilitiesByType('fire').length,
      this.getFacilitiesByType('healthcare').length
    );
    return Array(max).fill(0).map((_, i) => i);
  }

  getFacilityObjectByIndex(type: string, index: number): any {
    const fac = this.getFacilitiesByType(type);
    return fac[index] || null;
  }

  // ------------------------------
  //  SHOW FACILITY ON MAP
  // ------------------------------
  showFacilityOnMap(facility: any) {
    if (!facility || !facility.location) return;

    console.log('Navigating to map with facility:', facility);

    this.router.navigate(['/map'], {
      queryParams: {
        facilityLat: facility.location.coordinates[1],
        facilityLng: facility.location.coordinates[0],
        facilityName: facility.name,
        facilityType: facility.type
      }
    });
  }

  
  // ------------------------------
  //  AI ANALYSIS USING GEMINI
  // ------------------------------
  getAIAnalysis() {
    this.loading = true;

    this.geminiService.analyzeWard(this.wardNumber, this.facilities).subscribe({
      next: (result) => {
        this.geminiAnalysis = result.analysis;
        this.loading = false;
      },
      error: (err) => {
        console.error('Gemini error:', err);
        this.geminiAnalysis = 'Error getting AI analysis.';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/map']);
  }
}
