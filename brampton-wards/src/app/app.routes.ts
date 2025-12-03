import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'wards',
    loadComponent: () => import('./pages/ward-detail/ward-detail.page').then(m => m.WardDetailPage)
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage)
  },
  {
    path: 'ward-detail/:wardNumber',
    loadComponent: () => import('./pages/ward-detail/ward-detail.page').then(m => m.WardDetailPage)
  }
];