# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Armora is a React Native Expo application for premium security transport services. Every driver is a vetted close protection (CP) officer with SIA licensing. The app features professional UI with booking, payment, emergency features, and real-time tracking.

### Brand Identity
- **App Name**: Armora
- **Primary Color**: Midnight Navy (#0A1F3D)
- **Accent Color**: Royal Cyan (#0FD3E3)
- **Neutral Base**: Arctic Grey (#F4F6F8)
- **Text Color**: Charcoal (#222222)
- **Brand Gradient**: Midnight Navy to Royal Cyan
- **Font Style**: Modern sans-serif (System default with clean styling)

## Core Development Commands

```bash
# Development
npm start                # Start Expo development server
npm run android         # Run on Android device/emulator
npm run ios            # Run on iOS device/simulator  
npm run web            # Run in web browser

# Testing & Health Monitoring
npm test               # Run automated test suite
npm run health-check   # Comprehensive app health validation
npm run monitor        # Continuous monitoring (30s intervals)

# Expo specific
npx expo start --clear    # Start with cleared cache
npx expo start --tunnel   # Use tunnel for network issues
```

## Architecture Overview

### Navigation Structure
- **Stack Navigator** (main) with **Bottom Tab Navigator** (MainTabs)
- Flow: `OnboardingScreen` → `MainTabs` (Home/Account) → Modal screens
- Main tabs: Home (NewHomeScreen), Account (AccountScreen)
- Modal flows: RideSelection → DriverConnection → Payment/Emergency

### Key Directories
- `screens/` - All application screens (new redesigned + legacy for backwards compatibility)
- `components/` - Reusable UI components organized by `ui/` and `Map/`
- `services/` - Business logic (NotificationService, LocationService, PaymentService, EmergencyService)
- `theme/` - Centralized design system with colors, typography, spacing
- `scripts/` - Development tools (testing, health-check, monitoring)

### Core Technologies
- **React Native 0.79.5** with **React 19.0.0**
- **Expo SDK 53** 
- **React Navigation v7** (Stack + Bottom Tabs)
- **Firebase Cloud Messaging** for push notifications
- **Stripe React Native** for payments
- **React Native Maps** for location features
- **AsyncStorage** for local persistence

## Important Configuration Notes

### Expo Configuration (app.json)
- **SDK Version**: 53.0.0
- **Bundle ID**: com.armora.app  
- **Platforms**: iOS, Android, Web
- **Orientation**: Portrait only
- **Primary Color**: #0A1F3D (Midnight Navy - Armora branding)

### Development Issues & Solutions
- **Expo Go "Checking for Updates" freeze**: Remove `updates` configuration from app.json during development
- **Metro bundler slow**: Use `--clear` flag to rebuild cache
- **Network issues in Codespaces**: Use `--tunnel` mode for reliable connectivity
- **Web compatibility**: All components support react-native-web

### Theme System
- Primary color: `#0A1F3D` (Midnight Navy)
- Professional Armora theme with Midnight Navy and Royal Cyan accents
- Centralized theme object in `/theme/` directory
- All components use theme constants for consistency

## Testing & Monitoring

### Built-in Monitoring System
The app includes comprehensive automated monitoring:
- **Health checks**: File structure, dependencies, syntax validation
- **Automated testing**: Navigation flows, theme consistency, web compatibility
- **Continuous monitoring**: Memory usage, error tracking, alerts

### Monitoring Commands
```bash
node scripts/monitor.js report    # Generate monitoring report
node scripts/monitor.js check     # Single monitoring cycle
cat test-results.json           # View latest test results
cat health-check-results.json   # View health check results
```

## Firebase Integration

### Push Notifications
- Uses `@react-native-firebase/messaging` 
- NotificationService handles foreground/background notifications
- Notification types: driver assigned, trip events, emergency alerts
- Configuration in `services/NotificationService.js`

## Payment Integration

### Stripe Setup
- Uses `@stripe/stripe-react-native`
- PaymentService handles payment processing
- Payment screens: PaymentMethodScreen, AddPaymentMethodScreen, PaymentConfirmationScreen

## Key Business Logic

### User Journey Flow
1. **Onboarding** → Introduction and setup
2. **Home** → Location selection and map view  
3. **Risk Assessment** → 6-question evaluation system (legacy feature)
4. **Ride Selection** → Choose protection level
5. **Driver Connection** → Match with SIA licensed officers
6. **Payment** → Stripe integration
7. **Emergency** → One-touch alerts and contacts

### Screen Mapping
- **New UI**: OnboardingScreen, NewHomeScreen, RideSelectionScreen, DriverConnectionScreen, AccountScreen
- **Legacy UI**: Assessment, Booking, Profile, Service screens (maintained for backwards compatibility)
- **Utilities**: Payment screens, Emergency screens

## Development Workflow

### Starting Development
1. `npm install` - Install dependencies
2. `npm run health-check` - Verify app health
3. `npm start` - Start development server
4. If issues with Expo Go, use `npx expo start --tunnel`

### Web App Development
1. `cd web-app` - Navigate to web directory
2. `npm install` - Install web dependencies (first time)
3. `npm run dev` - Start Next.js development server
4. Open http://localhost:3000 in browser

### Project Structure
- **Mobile App**: Main directory (`/workspaces/GQCars/`)
- **Web App**: `web-app/` subdirectory
- **Shared Services**: Both apps use similar service patterns
- **Startup Guide**: See `STARTUP_GUIDE.md` for complete instructions

### Before Deployment
1. `npm test` - Run full test suite
2. `npm run health-check` - Ensure all checks pass
3. `npm run monitor` - Start monitoring to verify stability
4. For web: `cd web-app && npm run build` - Build web app

### Common Development Tasks
- **Adding new screens**: Follow existing navigation patterns in App.js
- **UI components**: Use theme constants and follow existing component structure
- **Testing**: Add tests to `scripts/test.js` and run health checks
- **Notifications**: Extend NotificationService for new notification types
- **Payments**: Extend PaymentService for additional payment flows

## Emergency Features

The app includes comprehensive emergency functionality:
- One-touch emergency alerts
- Emergency contacts management  
- Integration with EmergencyService
- SIA licensed officer emergency protocols

## Development Process Guidelines

### Task Planning & Execution
When working on any coding task, follow this structured approach:

1. **Think Through the Problem**: First analyze the request and understand the requirements
2. **Read the Codebase**: Examine relevant files to understand current implementation  
3. **Write a Plan**: Create a detailed plan in `task/todo.md` with specific todo items
4. **Get Approval**: Check with the user before beginning work to verify the plan
5. **Execute**: Work through todo items one by one, marking them complete as you go
6. **High-Level Updates**: Provide brief explanations of changes made at each step
7. **Review**: Add a summary of all changes to the todo.md file when complete

### Code Change Principles
- **Simplicity First**: Make every task and code change as simple as possible
- **Minimal Impact**: Avoid complex changes that affect multiple files unnecessarily  
- **Single Responsibility**: Each change should impact as little code as possible
- **Incremental Progress**: Break large tasks into smaller, manageable steps