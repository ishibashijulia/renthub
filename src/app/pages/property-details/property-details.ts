import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property';

@Component({
  selector: 'app-property-details',
  imports: [RouterLink],
  templateUrl: './property-details.html',
  styleUrl: './property-details.css',
})
export class PropertyDetails {
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);

  property = signal<Property | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.propertyService.getProperty(id).subscribe((data) => {
      this.property.set(data);
    });
  }
}
