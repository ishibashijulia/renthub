import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { PropertyCard } from './property-card';
import { Property } from '../../models/property';

const sample = {
  id: 1,
  title: 'Sunny 2BHK near station',
  location: 'Tokyo',
  price: 120000,
  description: 'Bright apartment.',
  photos: ['https://example.com/a.jpg'],
} as Property;

describe('PropertyCard', () => {
  let fixture: ComponentFixture<PropertyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCard],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyCard);
    fixture.componentRef.setInput('property', sample);
    fixture.detectChanges();
  });

  it('shows the title and location', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Sunny 2BHK near station');
    expect(text).toContain('Tokyo');
  });

  it('links to the details page', () => {
    const link = (fixture.nativeElement as HTMLElement).querySelector('a.btn-primary');
    expect(link?.getAttribute('href')).toBe('/property/1');
  });
});
