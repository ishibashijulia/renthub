import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Property } from '../../models/property';

@Component({
  selector: 'app-property-card',
  imports: [RouterLink],
  templateUrl: './property-card.html',
  styleUrl: './property-card.css',
})
export class PropertyCard {
  property = input.required<Property>();
}
