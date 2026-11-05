# RentHub

An apartment rental platform built with Angular. Landlords can post listings, renters can browse, search, favourite listings, and discuss in comments.

## Links

- **Deployed app:** https://juliarenthub.netlify.app/
- **GitHub (frontend):** https://github.com/ishibashijulia/renthub
- **GitHub (API, json-server):** https://github.com/ishibashijulia/rent-hub-api
- **API:** https://rent-hub-api.onrender.com

> **Note:** The API runs on a free Render instance and sleeps when idle.
> The first request may take 30-60 seconds. Please wait and reload once.
> Data created on the deployed site may be reset when the API restarts.

## Test accounts

| Role     | Email              | Password    |
| -------- | ------------------ | ----------- |
| Landlord | taro@example.com   | password123 |
| Landlord | hanako@example.com | password123 |
| Renter   | mika@example.com   | password123 |

Only landlords can post listings.

## Features

- User registration and login (Reactive Forms with validation, password confirmation, role selection)
- Auth guards: `authGuard` (login required) and `landlordGuard` (landlord only)
- Home: featured carousel and paginated listing grid (3 columns, responsive)
- Search and filters: keyword, location, price range, property type, furnished, amenities
- Sorting: newest, price low to high, price high to low
- Listing details page with comments and replies
- Favourites (toggle on cards and carousel, list on the Profile page)
- Create listing form: validation, checkboxes, radio buttons, multiple image upload (resized in the browser and stored as Base64)

## Bonus

- Preview and Submit screen: **not attempted**

## Tech stack

Angular (standalone components, signals, Reactive Forms), Bootstrap, RxJS, json-server 0.17.4

## Run locally

```bash
npm install
npm run api      # or: npx json-server --watch db.json --port 3000
ng serve
```

The app runs at http://localhost:4200 and the API at http://localhost:3000.

## Tests

```bash
ng test --no-watch
```

4 test files, 8 tests: `App`, `PropertyService`, `authGuard`, `PropertyCard`.

## Notes and limitations

- This is a learning project using a mock backend. Passwords are stored in plain text in `db.json`; a real backend must hash passwords.
- Guards only control the UI. json-server has no authentication, so data protection and ownership checks belong on a real server.
- Images are stored as Base64 in `db.json` for simplicity, which is not suitable for production.
