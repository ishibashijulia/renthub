import { Component, computed, input, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Property } from '../../models/property';
import { AuthService } from '../../services/auth';
import { FavoriteService } from '../../services/favorite';

@Component({
  selector: 'app-featured-carousel',
  imports: [RouterLink],
  templateUrl: './featured-carousel.html',
  styleUrl: './featured-carousel.css',
})
export class FeaturedCarousel {
  properties = input<Property[]>([]);
  index = signal(0);
  current = computed(() => this.properties()[this.index()]);
  favoriteService = inject(FavoriteService);
  private auth = inject(AuthService);
  private router = inject(Router);

  next() {
    const len = this.properties().length;
    this.index.set((this.index() + 1) % len);
  }

  prev() {
    const len = this.properties().length;
    this.index.set((this.index() - 1 + len) % len);
  }

  onFavorite() {
    const p = this.current();
    if (!p) return;
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.favoriteService.toggle(p.id);
  }
}
