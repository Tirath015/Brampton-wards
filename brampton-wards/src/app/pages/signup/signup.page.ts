import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  providers: [AuthService]
})
export class SignupPage {
  name: string = '';
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSignup() {
    if (!this.name || !this.email || !this.password) {
      alert('Please fill all fields');
      return;
    }

    this.loading = true;

    this.authService.signup(this.name, this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          alert('Account created successfully! Please login.');
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message || 'Error creating account';
        alert(message);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}