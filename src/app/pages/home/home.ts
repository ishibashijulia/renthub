import { Component, computed, inject, signal } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property';
import { FeaturedCarousel } from '../../components/featured-carousel/featured-carousel';
import { PropertyCard } from '../../components/property-card/property-card';

@Component({
  selector: 'app-home',
  imports: [FeaturedCarousel, PropertyCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private propertyService = inject(PropertyService);

  properties = signal<Property[]>([]);
  featured = computed(() => this.properties().filter((p) => p.featured));

  ngOnInit() {
    this.propertyService.getProperties().subscribe((data) => {
      this.properties.set(data);
    });
  }
}
