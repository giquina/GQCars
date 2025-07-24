# GQCars Complete Startup Guide

## Quick Start Commands

### Mobile App (React Native/Expo)
```bash
# Navigate to main directory
cd /workspaces/GQCars

# Start Expo development server
npm start

# Or start on specific platform
npm run android    # Android device/emulator
npm run ios        # iOS device/simulator  
npm run web        # Web browser (Expo web)
```

### Web App (Next.js)
```bash
# Navigate to web app directory
cd /workspaces/GQCars/web-app

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Open browser: http://localhost:3000
```

## Complete Project Architecture

```
/workspaces/GQCars/
├── 📱 MOBILE APP (React Native/Expo)
│   ├── screens/           # Mobile screens
│   ├── components/        # Mobile components  
│   ├── services/          # Shared business logic
│   ├── theme/            # Design system
│   └── package.json      # Mobile dependencies
│
└── 🌐 WEB APP (Next.js)
    ├── web-app/
    │   ├── src/
    │   │   ├── components/   # Web components
    │   │   ├── pages/        # Web pages
    │   │   ├── services/     # Web services
    │   │   └── styles/       # Web styles
    │   └─��─ package.json     # Web dependencies
```

## Development Workflow

### 1. Start Both Apps Simultaneously
```bash
# Terminal 1 - Mobile App
cd /workspaces/GQCars
npm start

# Terminal 2 - Web App  
cd /workspaces/GQCars/web-app
npm run dev
```

### 2. Access Points
- **Mobile App**: Expo Go app or browser at expo URL
- **Web App**: http://localhost:3000
- **Expo DevTools**: Usually http://localhost:19002

### 3. Testing Features
- **Security Assessment**: Complete 6-question evaluation
- **Location Services**: Set pickup/destination
- **Service Selection**: Choose transport level
- **Booking Flow**: End-to-end booking process

## Troubleshooting

### Mobile App Issues
```bash
# Clear Expo cache
npx expo start --clear

# Fix Metro bundler
npx expo start --tunnel

# Health check
npm run health-check
```

### Web App Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Type check
npm run type-check

# Build test
npm run build
```

### Common Port Conflicts
- **Expo**: 19000, 19001, 19002
- **Next.js**: 3000
- **Alternative ports**: Use --port flag

## Environment Setup

### Required Tools
- Node.js 18+
- npm or yarn
- Expo CLI (for mobile)
- Modern browser (for web)

### Optional Tools
- Android Studio (Android testing)
- Xcode (iOS testing)
- React DevTools
- Expo Go app

## Key Files to Remember

### Mobile App Configuration
- `package.json` - Dependencies and scripts
- `app.json` - Expo configuration  
- `CLAUDE.md` - Project instructions
- `theme/index.js` - Design system

### Web App Configuration
- `web-app/package.json` - Web dependencies
- `web-app/next.config.js` - Next.js config
- `web-app/tailwind.config.js` - Styling config
- `web-app/.env.local` - Environment variables

## Production Deployment

### Web App
```bash
cd /workspaces/GQCars/web-app
npm run build
npm run start
```

### Mobile App
```bash
cd /workspaces/GQCars
npx expo build:android
npx expo build:ios
```

## Development Tips

1. **Always start web app from `/workspaces/GQCars/web-app` directory**
2. **Mobile app starts from main `/workspaces/GQCars` directory**
3. **Both apps share similar service patterns**
4. **Use separate terminals for parallel development**
5. **Web app runs on port 3000, mobile on Expo ports**

## Quick Commands Reference

```bash
# From /workspaces/GQCars
npm start              # Start mobile app
npm test              # Run tests
npm run health-check  # System health check

# From /workspaces/GQCars/web-app  
npm run dev           # Start web development
npm run build         # Build for production
npm run type-check    # TypeScript validation
```

This guide ensures you can restart development quickly after any system restart!