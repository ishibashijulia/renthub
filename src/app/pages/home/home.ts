import { Component, computed, inject, signal } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property';
import { FeaturedCarousel } from '../../components/featured-carousel/featured-carousel';
import { PropertyCard } from '../../components/property-card/property-card';
import { AMENITIES } from '../../constants/amenities';

@Component({
  selector: 'app-home',
  imports: [FeaturedCarousel, PropertyCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private propertyService = inject(PropertyService);
  amenityList = AMENITIES;

  keyword = signal('');
  location = signal('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  furnished = signal<'any' | 'yes' | 'no'>('any');
  propertyType = signal('');
  selectedAmenities = signal<string[]>([]);

  filtered = computed(() => {
    const keyword = this.keyword().trim().toLowerCase();
    const location = this.location().trim().toLowerCase();
    const min = this.minPrice();
    const max = this.maxPrice();
    const furnished = this.furnished();
    const type = this.propertyType();
    const amenities = this.selectedAmenities();

    return this.properties().filter((p) => {
      const matchesKeyword =
        !keyword ||
        p.title.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.buildingName.toLowerCase().includes(keyword);
      const matchesLocation = !location || p.location.toLowerCase().includes(location);
      const matchesMin = min === null || p.price >= min;
      const matchesMax = max === null || p.price <= max;
      const matchesFurnished = furnished === 'any' || p.furnished === (furnished === 'yes');
      const matchesType = !type || p.propertyType === type;
      const matchesAmenities = amenities.every((a) => p.amenities.includes(a));

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesMin &&
        matchesMax &&
        matchesFurnished &&
        matchesType &&
        matchesAmenities
      );
    });
  });

  toggleAmenity(name: string) {
    this.selectedAmenities.update((list) =>
      list.includes(name) ? list.filter((a) => a !== name) : [...list, name],
    );
  }

  toNumberOrNull(value: string): number | null {
    return value === '' ? null : Number(value);
  }

  sortBy = signal<'newest' | 'priceAsc' | 'priceDesc'>('newest');

  readonly pageSize = 6;
  page = signal(1);

  sorted = computed(() => {
    const list = [...this.filtered()];
    switch (this.sortBy()) {
      case 'priceAsc':
        return list.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return list.sort((a, b) => b.price - a.price);
      default:
        return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.sorted().length / this.pageSize)));

  currentPage = computed(() => Math.min(this.page(), this.totalPages()));

  paged = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.sorted().slice(start, start + this.pageSize);
  });

  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  goTo(n: number) {
    this.page.set(Math.min(Math.max(1, n), this.totalPages()));
  }
  reset() {
    this.keyword.set('');
    this.location.set('');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.furnished.set('any');
    this.propertyType.set('');
    this.selectedAmenities.set([]);
    this.page.set(1);
  }

  properties = signal<Property[]>([]);
  featured = computed(() => this.properties().filter((p) => p.featured));

  ngOnInit() {
    this.propertyService.getProperties().subscribe((data) => {
      this.properties.set(data);
    });
  }
}
