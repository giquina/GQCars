const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

// Mobile device configurations for testing
const MOBILE_DEVICES = {
  'iPhone 12': devices['iPhone 12'],
  'iPhone 13 Pro': devices['iPhone 13 Pro'],
  'Pixel 5': devices['Pixel 5'],
  'Galaxy S21': devices['Galaxy S21'],
  'iPad Pro': devices['iPad Pro'],
};

class MobileTestSuite {
  constructor() {
    this.browser = null;
    this.results = {};
    this.screenshotDir = './mobile-test-screenshots';
    
    // Ensure screenshot directory exists
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async initialize() {
    console.log('🚀 Initializing Mobile Test Suite...');
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
  }

  async testDevice(deviceName, appUrl) {
    console.log(`📱 Testing on ${deviceName}...`);
    
    const device = MOBILE_DEVICES[deviceName];
    const context = await this.browser.newContext({
      ...device,
      locale: 'en-US',
      timezoneId: 'America/New_York',
    });

    const page = await context.newPage();
    
    try {
      // Navigate to app
      console.log(`   📡 Navigating to ${appUrl}...`);
      await page.goto(appUrl, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait for app to load
      await page.waitForTimeout(3000);
      
      // Take full page screenshot
      const screenshotPath = path.join(this.screenshotDir, `${deviceName.replace(/\s+/g, '_')}_full_page.png`);
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true,
        clip: null
      });
      
      console.log(`   📸 Screenshot saved: ${screenshotPath}`);
      
      // Analyze mobile UI elements
      const analysis = await this.analyzeMobileUI(page, deviceName);
      
      // Test interactions
      const interactions = await this.testMobileInteractions(page, deviceName);
      
      this.results[deviceName] = {
        ...analysis,
        interactions,
        screenshotPath,
        viewport: device.viewport,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`   ❌ Error testing ${deviceName}:`, error.message);
      this.results[deviceName] = {
        error: error.message,
        timestamp: new Date().toISOString()
      };
    } finally {
      await context.close();
    }
  }

  async analyzeMobileUI(page, deviceName) {
    console.log(`   🔍 Analyzing UI elements for ${deviceName}...`);
    
    const analysis = {
      textOverflow: [],
      smallTouchTargets: [],
      layoutIssues: [],
      accessibilityIssues: []
    };

    try {
      // Check for text overflow
      const overflowElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const overflows = [];
        
        elements.forEach((el, index) => {
          if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              overflows.push({
                tag: el.tagName.toLowerCase(),
                className: el.className,
                text: el.textContent?.substring(0, 100) || '',
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
                index
              });
            }
          }
        });
        
        return overflows.slice(0, 10); // Limit to first 10
      });
      
      analysis.textOverflow = overflowElements;

      // Check for small touch targets
      const smallTargets = await page.evaluate(() => {
        const clickables = document.querySelectorAll('button, a, input, [onclick], [role="button"]');
        const small = [];
        
        clickables.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
            small.push({
              tag: el.tagName.toLowerCase(),
              className: el.className,
              text: el.textContent?.substring(0, 50) || '',
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              index
            });
          }
        });
        
        return small.slice(0, 10);
      });
      
      analysis.smallTouchTargets = smallTargets;

      // Check for layout issues
      const layoutIssues = await page.evaluate(() => {
        const issues = [];
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        
        // Check for horizontal scrolling
        if (document.body.scrollWidth > viewport.width) {
          issues.push({
            type: 'horizontal_scroll',
            message: 'Page causes horizontal scrolling',
            bodyWidth: document.body.scrollWidth,
            viewportWidth: viewport.width
          });
        }
        
        // Check for elements extending beyond viewport
        const elements = document.querySelectorAll('*');
        elements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          if (rect.right > viewport.width + 5) { // 5px tolerance
            issues.push({
              type: 'element_overflow',
              tag: el.tagName.toLowerCase(),
              className: el.className,
              right: Math.round(rect.right),
              viewportWidth: viewport.width,
              index
            });
          }
        });
        
        return issues.slice(0, 5);
      });
      
      analysis.layoutIssues = layoutIssues;

    } catch (error) {
      console.warn(`   ⚠️  Error in UI analysis: ${error.message}`);
    }

    return analysis;
  }

  async testMobileInteractions(page, deviceName) {
    console.log(`   👆 Testing mobile interactions for ${deviceName}...`);
    
    const interactions = {
      tapTests: [],
      scrollTests: [],
      formTests: []
    };

    try {
      // Test service card taps
      const serviceCards = await page.$$('div[style*="borderRadius"], button, [role="button"]');
      if (serviceCards.length > 0) {
        for (let i = 0; i < Math.min(3, serviceCards.length); i++) {
          try {
            const card = serviceCards[i];
            const isVisible = await card.isVisible();
            if (isVisible) {
              await card.tap();
              await page.waitForTimeout(500);
              interactions.tapTests.push({
                element: `card_${i}`,
                success: true,
                message: 'Tap successful'
              });
            }
          } catch (error) {
            interactions.tapTests.push({
              element: `card_${i}`,
              success: false,
              message: error.message
            });
          }
        }
      }

      // Test scrolling
      try {
        const initialScrollY = await page.evaluate(() => window.scrollY);
        await page.evaluate(() => window.scrollTo(0, 100));
        await page.waitForTimeout(500);
        const newScrollY = await page.evaluate(() => window.scrollY);
        
        interactions.scrollTests.push({
          test: 'vertical_scroll',
          success: newScrollY !== initialScrollY,
          initialY: initialScrollY,
          finalY: newScrollY
        });
      } catch (error) {
        interactions.scrollTests.push({
          test: 'vertical_scroll',
          success: false,
          message: error.message
        });
      }

    } catch (error) {
      console.warn(`   ⚠️  Error in interaction testing: ${error.message}`);
    }

    return interactions;
  }

  async generateReport() {
    console.log('📊 Generating mobile test report...');
    
    const reportPath = './mobile-test-report.json';
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        devicesTestedCount: Object.keys(this.results).length,
        criticalIssues: 0,
        warnings: 0,
        passed: 0
      },
      results: this.results,
      recommendations: []
    };

    // Analyze results and generate recommendations
    Object.entries(this.results).forEach(([device, result]) => {
      if (result.error) {
        report.summary.criticalIssues++;
        return;
      }

      if (result.textOverflow?.length > 0) {
        report.summary.warnings++;
        report.recommendations.push({
          priority: 'high',
          device,
          issue: 'Text overflow detected',
          count: result.textOverflow.length,
          suggestion: 'Review text sizing and container widths for mobile devices'
        });
      }

      if (result.smallTouchTargets?.length > 0) {
        report.summary.warnings++;
        report.recommendations.push({
          priority: 'medium',
          device,
          issue: 'Small touch targets',
          count: result.smallTouchTargets.length,
          suggestion: 'Increase touch target sizes to minimum 44x44px'
        });
      }

      if (result.layoutIssues?.length > 0) {
        report.summary.criticalIssues++;
        report.recommendations.push({
          priority: 'high',
          device,
          issue: 'Layout issues detected',
          count: result.layoutIssues.length,
          suggestion: 'Fix responsive layout to prevent horizontal scrolling'
        });
      }

      if (!result.error && result.textOverflow?.length === 0 && result.layoutIssues?.length === 0) {
        report.summary.passed++;
      }
    });

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📋 Report saved to: ${reportPath}`);
    
    return report;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Main test runner
  async runFullSuite(appUrl) {
    try {
      await this.initialize();
      
      console.log('🔄 Running mobile test suite...');
      console.log(`📱 Testing app at: ${appUrl}`);
      console.log(`🎯 Devices to test: ${Object.keys(MOBILE_DEVICES).join(', ')}\n`);

      // Test each device
      for (const deviceName of Object.keys(MOBILE_DEVICES)) {
        await this.testDevice(deviceName, appUrl);
        console.log(''); // spacing
      }

      // Generate and return report
      return await this.generateReport();
      
    } finally {
      await this.close();
    }
  }
}

// Export for use
module.exports = { MobileTestSuite };

// CLI usage
if (require.main === module) {
  const appUrl = process.argv[2] || 'http://localhost:8081';
  
  (async () => {
    const testSuite = new MobileTestSuite();
    const report = await testSuite.runFullSuite(appUrl);
    
    console.log('\n📊 MOBILE TEST SUMMARY:');
    console.log(`✅ Devices tested: ${report.summary.devicesTestedCount}`);
    console.log(`❌ Critical issues: ${report.summary.criticalIssues}`);
    console.log(`⚠️  Warnings: ${report.summary.warnings}`);
    console.log(`✅ Passed: ${report.summary.passed}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n🔧 TOP RECOMMENDATIONS:');
      report.recommendations.slice(0, 5).forEach((rec, i) => {
        console.log(`${i + 1}. [${rec.priority.toUpperCase()}] ${rec.issue} (${rec.device})`);
        console.log(`   💡 ${rec.suggestion}`);
      });
    }
  })().catch(console.error);
}