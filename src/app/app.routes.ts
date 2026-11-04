import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { PropertyDetails } from './pages/property-details/property-details';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { Profile } from './pages/profile/profile';
import { landlordGuard } from './guards/landlord-guard';
import { CreateProperty } from './pages/create-property/create-property';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'property/:id', component: PropertyDetails },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'create', component: CreateProperty, canActivate: [landlordGuard] },
];
