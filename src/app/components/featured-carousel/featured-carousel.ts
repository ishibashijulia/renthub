import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Property } from '../../models/property';

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

  next() {
    const len = this.properties().length;
    this.index.set((this.index() + 1) % len);
  }

  prev() {
    const len = this.properties().length;
    this.index.set((this.index() - 1 + len) % len);
  }
}
