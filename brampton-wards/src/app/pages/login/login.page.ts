import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  providers: [AuthService]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      alert('Please fill all fields');
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          alert('Login successful!');
          this.router.navigate(['/map']);
        }
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message || 'Error logging in';
        alert(message);
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}