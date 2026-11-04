export interface Property {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  location: string;
  price: number;
  furnished: boolean;
  amenities: string[];
  vegetarianOnly: 'yes' | 'no' | 'any';
  photos: string[];
  contactName: string;
  contactPhone: string;
  featured: boolean;
  createdAt: string;
}
