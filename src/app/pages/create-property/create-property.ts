import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AMENITIES } from '../../constants/amenities';
import { AuthService } from '../../services/auth';
import { PropertyService } from '../../services/property.service';
import { resizeImage } from '../../utils/image';

@Component({
  selector: 'app-create-property',
  imports: [ReactiveFormsModule],
  templateUrl: './create-property.html',
  styleUrl: './create-property.css',
})
export class CreateProperty {
  private auth = inject(AuthService);
  private propertyService = inject(PropertyService);
  private router = inject(Router);

  amenityList = AMENITIES;
  errorMessage = signal('');

  form = new FormGroup({
    propertyType: new FormControl<'apartment' | 'house' | 'villa' | 'studio' | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    buildingName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    shared: new FormControl<'yes' | 'no'>('no', { nonNullable: true }),

    location: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    squareFeet: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    leaseType: new FormControl<'long' | 'short' | 'both'>('long', { nonNullable: true }),

    price: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    negotiable: new FormControl(false, { nonNullable: true }),
    priceMode: new FormControl<'per-month' | 'utilities-included'>('per-month', {
      nonNullable: true,
    }),

    furnished: new FormControl<'yes' | 'no'>('no', { nonNullable: true }),
    amenities: new FormGroup(
      Object.fromEntries(AMENITIES.map((a) => [a, new FormControl(false, { nonNullable: true })])),
    ),

    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(1400)],
    }),

    photos: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),

    vegetarianOnly: new FormControl<'yes' | 'no' | 'any'>('any', { nonNullable: true }),
    contactName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contactPhone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[0-9+\-\s]{8,15}$/)],
    }),
  });

  get propertyType() {
    return this.form.controls.propertyType;
  }
  get buildingName() {
    return this.form.controls.buildingName;
  }
  get location() {
    return this.form.controls.location;
  }
  get address() {
    return this.form.controls.address;
  }
  get squareFeet() {
    return this.form.controls.squareFeet;
  }
  get price() {
    return this.form.controls.price;
  }
  get title() {
    return this.form.controls.title;
  }
  get description() {
    return this.form.controls.description;
  }
  get photos() {
    return this.form.controls.photos;
  }
  get contactName() {
    return this.form.controls.contactName;
  }
  get contactPhone() {
    return this.form.controls.contactPhone;
  }

  readonly maxPhotos = 5;
  photoError = signal('');

  async onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.photoError.set('');
    this.photos.markAsTouched();

    for (const file of files) {
      if (this.photos.value.length >= this.maxPhotos) {
        this.photoError.set(`You can upload up to ${this.maxPhotos} photos.`);
        break;
      }
      if (!file.type.startsWith('image/')) {
        this.photoError.set('Only image files are allowed.');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.photoError.set('Each image must be 5MB or smaller.');
        continue;
      }

      try {
        const data = await resizeImage(file);
        this.photos.setValue([...this.photos.value, data]);
      } catch {
        this.photoError.set('Failed to process the image.');
      }
    }

    input.value = '';
  }

  removePhoto(index: number) {
    this.photos.setValue(this.photos.value.filter((_, i) => i !== index));
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.auth.currentUser();
    if (!user) return;

    const v = this.form.getRawValue();
    const amenities = Object.entries(v.amenities)
      .filter(([, checked]) => checked)
      .map(([name]) => name);

    this.propertyService
      .createProperty({
        ownerId: user.id,
        propertyType: v.propertyType as 'apartment' | 'house' | 'villa' | 'studio',
        buildingName: v.buildingName,
        shared: v.shared === 'yes',
        location: v.location,
        address: v.address,
        squareFeet: v.squareFeet!,
        leaseType: v.leaseType,
        price: v.price!,
        negotiable: v.negotiable,
        priceMode: v.priceMode,
        furnished: v.furnished === 'yes',
        amenities,
        title: v.title,
        description: v.description,
        photos: v.photos,
        vegetarianOnly: v.vegetarianOnly,
        contactName: v.contactName,
        contactPhone: v.contactPhone,
        featured: false,
        createdAt: new Date().toISOString(),
      })
      .subscribe({
        next: (created) => this.router.navigate(['/property', created.id]),
        error: () => this.errorMessage.set('Failed to create the listing. Please try again.'),
      });
  }
}
