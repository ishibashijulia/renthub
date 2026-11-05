export interface Property {
  id: number;
  ownerId: number;

  propertyType: 'apartment' | 'house' | 'villa' | 'studio';
  buildingName: string;
  shared: boolean;

  location: string;
  address: string;

  squareFeet: number;
  leaseType: 'long' | 'short' | 'both';

  price: number;
  negotiable: boolean;
  priceMode: 'per-month' | 'utilities-included';

  furnished: boolean;
  amenities: string[];

  title: string;
  description: string;
  photos: string[];

  vegetarianOnly: 'yes' | 'no' | 'any';
  contactName: string;
  contactPhone: string;

  featured: boolean;
  createdAt: string;
}
