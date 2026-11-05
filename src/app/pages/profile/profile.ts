import { Component, computed, inject, signal } from '@angular/core';
import { PropertyCard } from '../../components/property-card/property-card';
import { Property } from '../../models/property';
import { AuthService } from '../../services/auth';
import { FavoriteService } from '../../services/favorite';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-profile',
  imports: [PropertyCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  auth = inject(AuthService);
  private favoriteService = inject(FavoriteService);
  private propertyService = inject(PropertyService);

  properties = signal<Property[]>([]);

  favoriteProperties = computed(() => {
    const ids = this.favoriteService.favorites().map((f) => f.propertyId);
    return this.properties().filter((p) => ids.includes(p.id));
  });

  ngOnInit() {
    this.propertyService.getProperties().subscribe((data) => this.properties.set(data));
  }
}
