# GQCars Driver App Setup Guide

## 1. Getting Started

- Clone this repository.
- Install dependencies:
  ```bash
  npm install
  ```
- Start the Expo server (for Codespaces/remote):
  ```bash
  npx expo start --tunnel
  ```
- Scan the QR code with Expo Go on your phone.

## 2. Shared UI and Theme

This app uses shared components, theme, and assets from the `/shared/` directory. To maintain design consistency with the passenger app, always use these shared files for UI and styling.

### Shared Elements:
- `/shared/components/ui/` — Buttons, Cards, Inputs, etc.
- `/shared/components/Map/MapView.js`
- `/shared/components/GQCarsLogo.js`
- `/shared/theme/index.js`
- `/shared/assets/` — Logos and icons

## 3. Directory Structure

```
GQCarsDriverApp/
  assets/
  components/
    ui/         # From shared
    Map/        # From shared
    GQCarsLogo.js
  screens/
    HomeScreen.js
    RideRequestsScreen.js
    ActiveTripScreen.js
    EarningsScreen.js
    ProfileScreen.js
  services/
    LocationService.js
    NotificationService.js
    TripService.js
  theme/        # From shared
  App.js
  ...
shared/
  components/
  theme/
  assets/
```

## 4. What to Transfer for Consistency
- All files in `/shared/components/ui/`, `/shared/components/Map/MapView.js`, `/shared/components/GQCarsLogo.js`
- All files in `/shared/theme/`
- All relevant assets in `/shared/assets/`

## 5. Driver App Navigation Plan
- **Home**: Current status/map
- **Ride Requests**: List of available rides
- **Active Trip**: Details and controls for ongoing trip
- **Earnings**: Driver earnings and history
- **Profile**: Driver profile and settings

Use a Stack Navigator with Bottom Tabs for these main sections.

---

For advanced code sharing, consider a monorepo setup with Yarn Workspaces or TurboRepo.
