# GQCars - Premium Security Transport App

A React Native Expo application for premium close protection transport services, where every driver is a vetted CP officer with SIA licensing.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platforms
npm run android  # Android
npm run ios      # iOS
npm run web      # Web browser
```

## 🧪 Testing & Monitoring

### Health Check
Run a comprehensive health check of the application:
```bash
npm run health-check
```

### Automated Testing
Run the complete test suite:
```bash
npm test
```

### Continuous Monitoring
Start continuous monitoring (checks every 30 seconds):
```bash
npm run monitor
```

### Generate Reports
```bash
# Generate monitoring report
node scripts/monitor.js report

# View latest test results
cat test-results.json

# View health check results
cat health-check-results.json
```

## 📱 App Features

### Core Screens
- **HomeScreen**: Premium security branding and service overview
- **AssessmentScreen**: 6-question risk evaluation system
- **ServiceScreen**: Protection level selection based on risk assessment
- **BookingScreen**: CP officer profiles and selection
- **ProfileScreen**: Detailed officer credentials and background

### Key Features
- Professional dark theme (#1a1a1a) with gold accents (#D4AF37)
- Complete navigation flow between all screens
- Risk assessment algorithm
- SIA licensed officer profiles
- Web-compatible design with react-native-web

## 🛠 Technical Stack

- **Framework**: React Native with Expo SDK 53
- **Navigation**: React Navigation v7
- **Styling**: React Native StyleSheet with consistent theming
- **Web Support**: react-native-web for browser compatibility
- **Testing**: Custom test suite with Puppeteer
- **Monitoring**: Automated health checks and error monitoring

## 📊 Monitoring & Health Checks

The app includes comprehensive monitoring capabilities:

### Health Checks
- File structure validation
- Package.json dependency verification
- Screen file syntax validation
- React version consistency checks

### Automated Testing
- Navigation flow testing
- Theme consistency validation
- Web compatibility checks
- Security feature verification
- Error handling validation

### Error Monitoring
- Continuous health monitoring
- Automatic alerts on failures
- Memory usage tracking
- Web endpoint monitoring
- Detailed logging and reporting

## 🔧 Configuration

### Dependencies
All dependencies are configured for Expo SDK 53 compatibility:
- React 19.0.0 (consistent across react and react-dom)
- React Native 0.76.3
- React Navigation v7
- Expo SDK 53

### Web Configuration
- Metro bundler configured for web support
- Webpack configuration for production builds
- react-native-web aliases properly set up

## 📋 Monitoring Commands

```bash
# Start continuous monitoring
npm run monitor

# Run single health check
npm run health-check

# Run all tests
npm test

# Generate monitoring report
node scripts/monitor.js report

# Run single monitoring cycle
node scripts/monitor.js check
```

## 🚨 Alerting

The monitoring system will alert on:
- Multiple consecutive health check failures (3+ failures)
- High memory usage (>500MB heap)
- Web endpoint unavailability
- Critical file structure issues
- Package dependency conflicts

## 🏗 Development

### File Structure
```
GQCars/
├── App.js                 # Main navigation setup
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── metro.config.js       # Metro bundler configuration
├── babel.config.js       # Babel configuration
├── web-webpack.config.js # Web-specific webpack config
├── screens/              # App screens
│   ├── HomeScreen.js
│   ├── AssessmentScreen.js
│   ├── ServiceScreen.js
│   ├── BookingScreen.js
│   └── ProfileScreen.js
└── scripts/              # Testing and monitoring
    ├── test.js           # Automated test suite
    ├── health-check.js   # Health monitoring
    └── monitor.js        # Continuous monitoring
```

### Code Standards
- Consistent theme colors throughout all screens
- Proper React Navigation patterns
- Error handling in user interactions
- Security-focused content and messaging
- Web-compatible React Native patterns

## 🎯 Deployment

Before deployment, ensure all checks pass:

```bash
# Run full test suite
npm test

# Run health check
npm run health-check

# Start monitoring
npm run monitor
```

All tests should pass and health checks should return "healthy" status before deploying to production.

## 📞 Support

For issues with the application:
1. Check the health check results: `npm run health-check`
2. Review test results: `npm test`
3. Check monitoring logs: `cat monitoring.log`
4. Generate a monitoring report: `node scripts/monitor.js report`

The automated monitoring and testing systems will help identify and resolve issues quickly without manual debugging.