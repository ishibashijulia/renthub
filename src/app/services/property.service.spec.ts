import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PropertyService } from './property.service';
import { environment } from '../../environments/environment';

describe('PropertyService', () => {
  let service: PropertyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PropertyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getProperties() should GET the properties list', () => {
    service.getProperties().subscribe((list) => {
      expect(list.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/properties`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, title: 'Test' }]);
  });

  it('getProperty(3) should GET a single property', () => {
    service.getProperty(3).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/properties/3`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 3 });
  });
});
