#!/usr/bin/env node

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

class HealthChecker {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      checks: {},
      overall: 'unknown'
    };
  }

  async checkWebServer(url = 'http://localhost:19000') {
    return new Promise((resolve) => {
      const protocol = url.startsWith('https') ? https : http;
      const timeout = 5000;
      
      const req = protocol.get(url, (res) => {
        resolve({
          status: 'healthy',
          statusCode: res.statusCode,
          message: `Server responding with status ${res.statusCode}`
        });
      });

      req.setTimeout(timeout, () => {
        req.destroy();
        resolve({
          status: 'unhealthy',
          message: `Request timeout after ${timeout}ms`
        });
      });

      req.on('error', (error) => {
        resolve({
          status: 'unhealthy',
          message: `Connection error: ${error.message}`
        });
      });
    });
  }

  checkFileStructure() {
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

    const missingFiles = [];
    
    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }

    return {
      status: missingFiles.length === 0 ? 'healthy' : 'unhealthy',
      message: missingFiles.length === 0 
        ? 'All required files present'
        : `Missing files: ${missingFiles.join(', ')}`,
      missingFiles
    };
  }

  checkPackageJson() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      const requiredDependencies = [
        'expo',
        'react',
        'react-native',
        '@react-navigation/native',
        '@react-navigation/stack'
      ];

      const missingDeps = requiredDependencies.filter(dep => !packageJson.dependencies[dep]);
      
      const versionConflicts = [];
      
      // Check for React version consistency
      if (packageJson.dependencies.react && packageJson.dependencies['react-dom']) {
        const reactVersion = packageJson.dependencies.react;
        const reactDomVersion = packageJson.dependencies['react-dom'];
        if (reactVersion !== reactDomVersion) {
          versionConflicts.push(`React version mismatch: react@${reactVersion} vs react-dom@${reactDomVersion}`);
        }
      }

      return {
        status: missingDeps.length === 0 && versionConflicts.length === 0 ? 'healthy' : 'unhealthy',
        message: missingDeps.length === 0 && versionConflicts.length === 0
          ? 'Package.json is valid'
          : `Issues found: ${[...missingDeps.map(d => `Missing ${d}`), ...versionConflicts].join(', ')}`,
        missingDependencies: missingDeps,
        versionConflicts
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Error reading package.json: ${error.message}`
      };
    }
  }

  checkScreenFiles() {
    const screens = ['HomeScreen', 'AssessmentScreen', 'ServiceScreen', 'BookingScreen', 'ProfileScreen'];
    const issues = [];

    for (const screen of screens) {
      const screenPath = path.join(process.cwd(), 'screens', `${screen}.js`);
      
      if (!fs.existsSync(screenPath)) {
        issues.push(`${screen}.js not found`);
        continue;
      }

      try {
        const content = fs.readFileSync(screenPath, 'utf8');
        
        // Check for essential imports
        if (!content.includes('import React')) {
          issues.push(`${screen}.js missing React import`);
        }
        
        if (!content.includes('export default')) {
          issues.push(`${screen}.js missing default export`);
        }

        // Check for navigation prop usage
        if (!content.includes('navigation')) {
          issues.push(`${screen}.js might not use navigation properly`);
        }

      } catch (error) {
        issues.push(`Error reading ${screen}.js: ${error.message}`);
      }
    }

    return {
      status: issues.length === 0 ? 'healthy' : 'warning',
      message: issues.length === 0 
        ? 'All screen files are valid'
        : `Issues found: ${issues.join(', ')}`,
      issues
    };
  }

  async runAllChecks() {
    console.log('🏥 Running GQCars Health Check...\n');

    // File structure check
    console.log('📁 Checking file structure...');
    this.results.checks.fileStructure = this.checkFileStructure();
    console.log(`   ${this.results.checks.fileStructure.status === 'healthy' ? '✅' : '❌'} ${this.results.checks.fileStructure.message}\n`);

    // Package.json check
    console.log('📦 Checking package.json...');
    this.results.checks.packageJson = this.checkPackageJson();
    console.log(`   ${this.results.checks.packageJson.status === 'healthy' ? '✅' : '❌'} ${this.results.checks.packageJson.message}\n`);

    // Screen files check
    console.log('📱 Checking screen files...');
    this.results.checks.screenFiles = this.checkScreenFiles();
    console.log(`   ${this.results.checks.screenFiles.status === 'healthy' ? '✅' : '⚠️'} ${this.results.checks.screenFiles.message}\n`);

    // Web server check (optional)
    console.log('🌐 Checking web server...');
    this.results.checks.webServer = await this.checkWebServer();
    console.log(`   ${this.results.checks.webServer.status === 'healthy' ? '✅' : '❌'} ${this.results.checks.webServer.message}\n`);

    // Overall health assessment
    const healthyChecks = Object.values(this.results.checks).filter(check => check.status === 'healthy').length;
    const totalChecks = Object.keys(this.results.checks).length;
    
    if (healthyChecks === totalChecks) {
      this.results.overall = 'healthy';
      console.log('🎉 Overall Status: HEALTHY - All checks passed!');
    } else if (healthyChecks >= totalChecks - 1) {
      this.results.overall = 'warning';
      console.log('⚠️  Overall Status: WARNING - Some issues detected');
    } else {
      this.results.overall = 'unhealthy';
      console.log('🚨 Overall Status: UNHEALTHY - Multiple issues detected');
    }

    // Save results
    const resultsPath = path.join(process.cwd(), 'health-check-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📊 Detailed results saved to: ${resultsPath}`);

    return this.results;
  }
}

// Run health check if called directly
if (require.main === module) {
  const checker = new HealthChecker();
  checker.runAllChecks().then((results) => {
    process.exit(results.overall === 'healthy' ? 0 : 1);
  }).catch((error) => {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  });
}

module.exports = HealthChecker;