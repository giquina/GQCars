# GQCars Web Application

A professional web version of the GQCars mobile app for premium security transport services.

## Features

- 🛡️ **Security Assessment** - Complete 6-question security evaluation
- 🚗 **Service Selection** - Choose from 5 different security transport levels
- 📍 **Location Services** - Set pickup and destination with map integration
- 💳 **Professional UI** - Clean, modern design similar to Uber/Lyft
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile browsers

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the web-app directory:
```bash
cd web-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
web-app/
├── src/
│   ├── components/
│   │   ├── booking/          # Booking-related components
│   │   │   ├── LocationInput.tsx
│   │   │   └── ServiceSelector.tsx
│   │   ├── security/         # Security assessment components
│   │   │   ├── SecurityAssessmentBanner.tsx
│   │   │   └── SecurityAssessmentModal.tsx
│   │   ├── map/              # Map components
│   │   │   └── MapView.tsx
│   │   └── ui/               # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── LoadingSpinner.tsx
│   ├── pages/
│   │   ├── index.tsx         # Main booking page
│   │   ├── security-assessment.tsx
│   │   └── _app.tsx
│   ├── services/             # Business logic services
│   │   ├── SecurityAssessmentService.ts
│   │   ├── BookingService.ts
│   │   └── LocationService.ts
│   └── styles/
│       └── globals.css       # Global styles with Tailwind
├── public/                   # Static assets
├── package.json
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Key Components

### Main Booking Interface (`/`)
- Location input with autocomplete suggestions
- Service selection with pricing
- Map integration for location selection
- Security assessment integration
- Booking progress tracking

### Security Assessment (`/security-assessment`)
- 6-question security evaluation
- Risk level calculation
- Results persistence in localStorage
- Professional modal interface

### Services

#### SecurityAssessmentService
- Manages security assessment state
- Persists results in localStorage
- Notifies components of completion status

#### BookingService
- Handles booking creation and management
- Price calculations
- Status tracking

#### LocationService
- Browser geolocation integration
- Mock geocoding for addresses
- Distance calculations

## Styling

- **Tailwind CSS** for utility-first styling
- **Professional blue theme** (#007AFF) matching modern ride-sharing apps
- **Responsive design** for all screen sizes
- **Custom components** with consistent styling patterns

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

Create a `.env.local` file in the web-app directory:

```bash
NEXT_PUBLIC_APP_NAME=GQCars Web
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
```

## Integration with Mobile App

This web application is designed to work alongside the existing React Native mobile app:

- **Shared service patterns** - Similar service architecture
- **Consistent UI/UX** - Matching design language and flow
- **Compatible data structures** - Same booking and assessment formats  
- **Parallel development** - Can run independently or as part of larger system

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start development server**: `npm run dev`
3. **Open browser**: Visit `http://localhost:3000`
4. **Test security assessment**: Complete the 6-question evaluation
5. **Test booking flow**: Set locations, choose service, make booking

The application is ready to run and includes all the core functionality of the mobile app optimized for web browsers.