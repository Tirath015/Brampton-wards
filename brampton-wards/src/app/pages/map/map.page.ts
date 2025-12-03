import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WardService } from '../../services/ward';
import { GeminiService } from '../../services/gemini';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth';


declare const google: any;

interface WardData {
  wardNumber: number;
  name: string;
  polygon: any;
  geometry: any;
  facilityCount: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MapPage implements OnInit, AfterViewInit {
  map: any;
  wards: WardData[] = [];
  selectedWard: WardData | null = null;
  allWardsBounds: any;
  geminiAnalysis: string = '';
  loadingAnalysis: boolean = false;
  facilityMarker: any = null; // Store facility marker

  constructor(
    private wardService: WardService,
    private geminiService: GeminiService,
    private router: Router,
    private route: ActivatedRoute, // Add ActivatedRoute
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('Map component initialized');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 300);
  }

  initMap() {
    console.log('Initializing map...');

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 43.7250, lng: -79.7613 },
      zoom: 11,
      mapTypeId: 'satellite',
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true
    });

    console.log('Map created');
    this.loadWards();

    // Check for facility query params
    this.route.queryParams.subscribe(params => {
      if (params['facilityLat'] && params['facilityLng']) {
        const lat = parseFloat(params['facilityLat']);
        const lng = parseFloat(params['facilityLng']);
        const name = params['facilityName'] || 'Facility';
        const type = params['facilityType'] || 'facility';

        console.log('Showing facility on map:', name);
        this.showFacilityMarker(lat, lng, name, type);
      }
    });
  }

  loadWards() {
    console.log('Loading wards...');

    this.wardService.getAllWards().subscribe({
      next: (wards) => {
        console.log('Wards loaded:', wards.length);
        this.displayWards(wards);
      },
      error: (err) => {
        console.error('Error loading wards:', err);
      }
    });
  }

  displayWards(wardsData: any[]) {
    console.log('Displaying wards on map...');
    this.allWardsBounds = new google.maps.LatLngBounds();

    wardsData.forEach(wardData => {
      if (!wardData.geometry || !wardData.geometry.coordinates) {
        console.warn(`Ward ${wardData.wardNumber} has no geometry`);
        return;
      }

      const paths = this.convertGeoJSONToGoogleMaps(wardData.geometry.coordinates);

      const polygon = new google.maps.Polygon({
        paths: paths,
        strokeColor: '#FF6B35',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4ECDC4',
        fillOpacity: 0.3,
        map: this.map
      });

      paths.forEach((path: any) => {
        this.allWardsBounds.extend(path);
      });

      const bounds = new google.maps.LatLngBounds();
      paths.forEach((path: any) => bounds.extend(path));
      const center = bounds.getCenter();

      const label = new google.maps.Marker({
        position: center,
        map: this.map,
        label: {
          text: `${wardData.wardNumber}`,
          color: '#FFFFFF',
          fontSize: '18px',
          fontWeight: 'bold'
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 25,
          fillColor: '#FF6B35',
          fillOpacity: 0.9,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        },
        zIndex: 1000
      });

      const ward: WardData = {
        wardNumber: wardData.wardNumber,
        name: wardData.name || `Ward ${wardData.wardNumber}`,
        polygon: polygon,
        geometry: wardData.geometry,
        facilityCount: wardData.facilityCount
      };

      this.wards.push(ward);

      google.maps.event.addListener(polygon, 'click', () => {
        this.navigateToWardDetail(ward);
      });

      google.maps.event.addListener(label, 'click', () => {
        this.navigateToWardDetail(ward);
      });

      google.maps.event.addListener(polygon, 'mouseover', () => {
        polygon.setOptions({
          fillOpacity: 0.5,
          strokeWeight: 3
        });
      });

      google.maps.event.addListener(polygon, 'mouseout', () => {
        polygon.setOptions({
          fillOpacity: 0.3,
          strokeWeight: 2
        });
      });

      console.log(`✅ Ward ${ward.wardNumber} displayed with label`);
    });

    if (this.allWardsBounds && !this.allWardsBounds.isEmpty()) {
      this.map.fitBounds(this.allWardsBounds);
    }

    console.log('✅ All wards displayed');
  }

  convertGeoJSONToGoogleMaps(coordinates: any): any[] {
    if (!coordinates || !coordinates[0]) return [];

    return coordinates[0].map((coord: any) => ({
      lat: coord[1],
      lng: coord[0]
    }));
  }

  navigateToWardDetail(ward: WardData) {
    console.log('Navigating to ward detail:', ward.wardNumber);
    this.router.navigate(['/ward-detail', ward.wardNumber]);
  }

  // NEW: Show facility marker on map
  showFacilityMarker(lat: number, lng: number, name: string, type: string) {
    // Remove previous marker if exists
    if (this.facilityMarker) {
      this.facilityMarker.setMap(null);
    }

    // Get icon color based on type
    let iconColor = '#667eea';
    let iconName = 'place';

    if (type === 'school') {
      iconColor = '#3880ff';
      iconName = 'school';
    } else if (type === 'police') {
      iconColor = '#eb445a';
      iconName = 'shield';
    } else if (type === 'fire') {
      iconColor = '#ffc409';
      iconName = 'flame';
    } else if (type === 'healthcare') {
      iconColor = '#2dd36f';
      iconName = 'medical';
    }

    // Create marker
    this.facilityMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: name,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: iconColor,
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3
      },
      zIndex: 10000
    });

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; font-family: Arial;">
          <h3 style="margin: 0 0 5px 0; color: ${iconColor}; font-size: 16px;">${name}</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
        </div>
      `
    });

    // Show info window
    infoWindow.open(this.map, this.facilityMarker);

    // Zoom to facility
    this.map.setCenter({ lat, lng });
    this.map.setZoom(16);

    console.log('Facility marker placed:', name);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}