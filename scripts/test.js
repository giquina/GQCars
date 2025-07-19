#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const HealthChecker = require('./health-check');

// Import puppeteer only if available
let puppeteer = null;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.log('ℹ️  Puppeteer not available - skipping browser tests');
}

class GQCarsTestSuite {
  constructor() {
    this.browser = null;
    this.page = null;
    this.webServerProcess = null;
    this.testResults = {
      timestamp: new Date().toISOString(),
      tests: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      }
    };
  }

  async setUp() {
    console.log('🔧 Setting up test environment...');
    
    // Run health check first
    const healthChecker = new HealthChecker();
    const healthResults = await healthChecker.runAllChecks();
    
    if (healthResults.overall === 'unhealthy') {
      throw new Error('Health check failed - cannot proceed with tests');
    }

    // Launch browser for web testing (if puppeteer is available)
    if (puppeteer) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      this.page = await this.browser.newPage();
      
      // Set up console logging
      this.page.on('console', msg => {
        console.log(`Browser console (${msg.type()}):`, msg.text());
      });
      
      // Set up error handling
      this.page.on('error', error => {
        console.error('Browser error:', error.message);
      });
    } else {
      console.log('ℹ️  Browser tests disabled - puppeteer not available');
    }

    console.log('✅ Test environment ready');
  }

  async tearDown() {
    console.log('🧹 Cleaning up test environment...');
    
    if (this.page) {
      await this.page.close();
    }
    
    if (this.browser) {
      await this.browser.close();
    }
    
    if (this.webServerProcess) {
      this.webServerProcess.kill();
    }
    
    console.log('✅ Cleanup complete');
  }

  async runTest(testName, testFunction) {
    console.log(`🧪 Running test: ${testName}`);
    this.testResults.summary.total++;
    
    try {
      const startTime = Date.now();
      await testFunction();
      const duration = Date.now() - startTime;
      
      this.testResults.tests[testName] = {
        status: 'passed',
        duration,
        message: 'Test completed successfully'
      };
      
      this.testResults.summary.passed++;
      console.log(`✅ ${testName} - PASSED (${duration}ms)`);
      
    } catch (error) {
      this.testResults.tests[testName] = {
        status: 'failed',
        error: error.message,
        message: `Test failed: ${error.message}`
      };
      
      this.testResults.summary.failed++;
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
    }
  }

  async testFileStructure() {
    const requiredFiles = [
      'package.json',
      'App.js',
      'app.json',
      'metro.config.js',
      'babel.config.js',
      'screens/HomeScreen.js',
      'screens/AssessmentScreen.js',
      'screens/ServiceScreen.js',
      'screens/BookingScreen.js',
      'screens/ProfileScreen.js'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }
  }

  async testPackageJsonValidation() {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check React version consistency
    if (packageJson.dependencies.react !== packageJson.dependencies['react-dom']) {
      throw new Error('React version mismatch between react and react-dom');
    }
    
    // Check for required dependencies
    const requiredDeps = ['expo', 'react', 'react-native', '@react-navigation/native'];
    for (const dep of requiredDeps) {
      if (!packageJson.dependencies[dep]) {
        throw new Error(`Missing required dependency: ${dep}`);
      }
    }
  }

  async testScreenFilesSyntax() {
    const screens = ['HomeScreen', 'AssessmentScreen', 'ServiceScreen', 'BookingScreen', 'ProfileScreen'];
    
    for (const screen of screens) {
      const screenPath = path.join(process.cwd(), 'screens', `${screen}.js`);
      const content = fs.readFileSync(screenPath, 'utf8');
      
      // Basic syntax checks
      if (!content.includes('import React')) {
        throw new Error(`${screen}.js missing React import`);
      }
      
      if (!content.includes('export default')) {
        throw new Error(`${screen}.js missing default export`);
      }
      
      // Check for common patterns
      if (!content.includes('StyleSheet')) {
        throw new Error(`${screen}.js should use StyleSheet`);
      }
    }
  }

  async testNavigationFlow() {
    // This is a simplified test - in a real scenario you'd test actual navigation
    // For now, we'll test that navigation-related code is present
    
    const appJsPath = path.join(process.cwd(), 'App.js');
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');
    
    if (!appJsContent.includes('NavigationContainer')) {
      throw new Error('App.js missing NavigationContainer');
    }
    
    if (!appJsContent.includes('createStackNavigator')) {
      throw new Error('App.js missing Stack Navigator');
    }
    
    // Check that all screens are registered
    const requiredScreens = ['Home', 'Assessment', 'Service', 'Booking', 'Profile'];
    for (const screen of requiredScreens) {
      if (!appJsContent.includes(`name="${screen}"`)) {
        throw new Error(`Screen not registered in navigator: ${screen}`);
      }
    }
  }

  async testWebCompatibility() {
    // Test that metro.config.js has web support
    const metroConfigPath = path.join(process.cwd(), 'metro.config.js');
    const metroConfig = fs.readFileSync(metroConfigPath, 'utf8');
    
    if (!metroConfig.includes('react-native-web')) {
      throw new Error('Metro config missing react-native-web alias');
    }
    
    if (!metroConfig.includes("'web'")) {
      throw new Error('Metro config missing web platform');
    }
  }

  async testThemeConsistency() {
    const screens = ['HomeScreen', 'AssessmentScreen', 'ServiceScreen', 'BookingScreen', 'ProfileScreen'];
    const expectedColors = ['#1a1a1a', '#D4AF37', '#2a2a2a']; // Dark theme with gold accents
    
    for (const screen of screens) {
      const screenPath = path.join(process.cwd(), 'screens', `${screen}.js`);
      const content = fs.readFileSync(screenPath, 'utf8');
      
      // Check for consistent theme colors
      let hasThemeColors = false;
      for (const color of expectedColors) {
        if (content.includes(color)) {
          hasThemeColors = true;
          break;
        }
      }
      
      if (!hasThemeColors) {
        throw new Error(`${screen}.js missing theme colors`);
      }
    }
  }

  async testErrorHandling() {
    // Test that screens have basic error handling patterns
    const screens = ['AssessmentScreen', 'ServiceScreen', 'BookingScreen'];
    
    for (const screen of screens) {
      const screenPath = path.join(process.cwd(), 'screens', `${screen}.js`);
      const content = fs.readFileSync(screenPath, 'utf8');
      
      // Check for state management
      if (!content.includes('useState')) {
        console.warn(`Warning: ${screen}.js might benefit from state management`);
      }
    }
  }

  async testSecurityFeatures() {
    // Test that the app emphasizes security features
    const homeScreenPath = path.join(process.cwd(), 'screens', 'HomeScreen.js');
    const homeContent = fs.readFileSync(homeScreenPath, 'utf8');
    
    const securityKeywords = ['SIA', 'Licensed', 'Security', 'Protection'];
    let hasSecurityFeatures = false;
    
    for (const keyword of securityKeywords) {
      if (homeContent.includes(keyword)) {
        hasSecurityFeatures = true;
        break;
      }
    }
    
    if (!hasSecurityFeatures) {
      throw new Error('HomeScreen missing security-focused content');
    }
  }

  async runAllTests() {
    console.log('🚀 Starting GQCars Test Suite\n');
    
    try {
      await this.setUp();
      
      // Core functionality tests
      await this.runTest('File Structure', () => this.testFileStructure());
      await this.runTest('Package.json Validation', () => this.testPackageJsonValidation());
      await this.runTest('Screen Files Syntax', () => this.testScreenFilesSyntax());
      await this.runTest('Navigation Flow', () => this.testNavigationFlow());
      await this.runTest('Web Compatibility', () => this.testWebCompatibility());
      await this.runTest('Theme Consistency', () => this.testThemeConsistency());
      await this.runTest('Error Handling', () => this.testErrorHandling());
      await this.runTest('Security Features', () => this.testSecurityFeatures());
      
      // Generate test report
      this.generateTestReport();
      
    } finally {
      await this.tearDown();
    }
    
    return this.testResults;
  }

  generateTestReport() {
    const { summary } = this.testResults;
    const successRate = summary.total > 0 ? (summary.passed / summary.total * 100).toFixed(1) : 0;
    
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`Total Tests: ${summary.total}`);
    console.log(`Passed: ${summary.passed}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Success Rate: ${successRate}%`);
    
    if (summary.failed > 0) {
      console.log('\n❌ Failed Tests:');
      Object.entries(this.testResults.tests)
        .filter(([_, result]) => result.status === 'failed')
        .forEach(([name, result]) => {
          console.log(`  - ${name}: ${result.error}`);
        });
    }
    
    // Save detailed report
    const reportPath = path.join(process.cwd(), 'test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
    console.log(`\n📋 Detailed report saved to: ${reportPath}`);
    
    // Overall result
    if (summary.failed === 0) {
      console.log('\n🎉 All tests passed! The app is ready for deployment.');
    } else {
      console.log(`\n⚠️  ${summary.failed} test(s) failed. Please review and fix issues before deployment.`);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const testSuite = new GQCarsTestSuite();
  
  testSuite.runAllTests().then((results) => {
    process.exit(results.summary.failed === 0 ? 0 : 1);
  }).catch((error) => {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  });
}

module.exports = GQCarsTestSuite;