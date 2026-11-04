import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { PropertyService } from '../../services/property.service';

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

  amenityList = ['WiFi', 'Parking', 'Air Conditioning', 'Balcony', 'Laundry', 'Gym'];
  errorMessage = signal('');

  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    furnished: new FormControl(false, { nonNullable: true }),
    vegetarianOnly: new FormControl<'yes' | 'no' | 'any'>('any', { nonNullable: true }),
    amenities: new FormGroup(
      Object.fromEntries(
        this.amenityList.map((a) => [a, new FormControl(false, { nonNullable: true })]),
      ),
    ),
    photoUrl: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
    }),
    contactName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contactPhone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[0-9+\-\s]{8,15}$/)],
    }),
  });

  get title() {
    return this.form.controls.title;
  }
  get description() {
    return this.form.controls.description;
  }
  get location() {
    return this.form.controls.location;
  }
  get price() {
    return this.form.controls.price;
  }
  get photoUrl() {
    return this.form.controls.photoUrl;
  }
  get contactName() {
    return this.form.controls.contactName;
  }
  get contactPhone() {
    return this.form.controls.contactPhone;
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
        title: v.title,
        description: v.description,
        location: v.location,
        price: v.price!,
        furnished: v.furnished,
        amenities,
        vegetarianOnly: v.vegetarianOnly,
        photos: [v.photoUrl],
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
