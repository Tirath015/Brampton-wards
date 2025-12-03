import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage {

  constructor(private router: Router) {}

  logout() {
    console.log('User logged out');
    this.router.navigate(['/login']);
  }

  navigateToMap() {
    console.log('Navigating to Map page');
    this.router.navigate(['/map']);
  }

  navigateToWardList() {
    console.log('Navigating to Ward List page');
    this.router.navigate(['/map']); 
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
