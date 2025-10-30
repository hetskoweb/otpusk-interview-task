# Tour Search App

## Overview

This project is a React-based tour search client. Users can:

- Select a travel destination (country or city)
- Enter departure city
- Search for tours and view results sorted by price
- View detailed information on a tour

The app uses a provided `api.js` for all data operations. Modifications to `api.js` are not allowed.'

## API Methods

- `getCountries()` — fetch all countries
- `searchGeo(query)` — search countries/cities
- `startSearchPrices(countryID)` — initiate server search
- `getSearchPrices(token)` — get search results
- `stopSearchPrices(token)` — cancel active search
- `getPrice(priceId)` — tour details
- `getHotel(hotelId)` — hotel details

## Live demo

Experience the live website: [Tour Search App](https://hetskoweb.github.io/otpusk-interview-task/)

## Technologies Used 💻

**Core**

- **React (v18.3.1)** - UI framework
- **TypeScript (v5.2.2)** - Type safety
- **Sass (v1.83.4)** - Styling

**UI/UX**

- **React Router (v6.25.1)** - Navigation

**Development && Deployment**

- **Vite (v5.3.1)** - Build tool
- **ESLint (v8.57.0)** - Code Quality
- **Prettier (v3.3.2)** - Code Formatting

---

## Features by Task

### Task 1: Search Form

- Input with dropdown for countries and cities.
- Fetch countries via `getCountries()`.
- Search as user types using `searchGeo()`.
- Selecting an item closes dropdown and fills input.

### Task 2: Search Tours

- Submit form → `startSearchPrices(countryID)` → get search token.
- Poll results with `getSearchPrices(token)` after allowed wait.
- Handles:
  - Loading state
  - Retry on error (up to 2 times)
  - Empty results message
  - Errors

### Task 3: Render Results

- Display tours as cards in a responsive grid (2 per row, 1 if width < 250px).
- Each card shows:
  - Hotel name
  - Country & city
  - Tour start date
  - Price (formatted)
  - Hotel image
  - Link to view price

### Task 4: Tour Page

- Separate page for a selected tour.
- Fetch data via:
  - `getPrice(priceId)` for tour details
  - `getHotel(hotelId)` for hotel details
- Display:
  - Hotel info (name, country, city, image, description, amenities)
  - Tour info (dates, price)
- Reuse components from search results.

### Task 5: Cancel & Restart Search

- If a search is active and parameters change:
  - Cancel current search (`stopSearchPrices(token)`)
  - Ignore any late responses from old token
  - Start new search with updated parameters
- "Find" button is temporarily disabled during cancellation/restart.
- Poll new search results as in Task 2.
