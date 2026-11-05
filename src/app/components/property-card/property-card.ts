import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Property } from '../../models/property';
import { AuthService } from '../../services/auth';
import { FavoriteService } from '../../services/favorite';

@Component({
  selector: 'app-property-card',
  imports: [RouterLink],
  templateUrl: './property-card.html',
  styleUrl: './property-card.css',
})
export class PropertyCard {
  favoriteService = inject(FavoriteService);
  private auth = inject(AuthService);
  private router = inject(Router);

  property = input.required<Property>();

  onFavorite() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.favoriteService.toggle(this.property().id);
  }
}
