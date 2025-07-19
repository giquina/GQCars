#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const HealthChecker = require('./health-check');

class ErrorMonitor {
  constructor(options = {}) {
    this.interval = options.interval || 30000; // 30 seconds
    this.logFile = path.join(process.cwd(), 'monitoring.log');
    this.alertThreshold = options.alertThreshold || 3; // Alert after 3 consecutive failures
    this.consecutiveFailures = 0;
    this.isRunning = false;
    this.healthChecker = new HealthChecker();
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };

    const logLine = `${timestamp} [${level.toUpperCase()}] ${message}${data ? ` - ${JSON.stringify(data)}` : ''}\n`;
    
    console.log(logLine.trim());
    
    try {
      fs.appendFileSync(this.logFile, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  async checkHealth() {
    try {
      const results = await this.healthChecker.runAllChecks();
      
      if (results.overall === 'healthy') {
        this.consecutiveFailures = 0;
        this.log('info', 'Health check passed', { status: results.overall });
      } else {
        this.consecutiveFailures++;
        this.log('warning', `Health check failed (${this.consecutiveFailures}/${this.alertThreshold})`, {
          status: results.overall,
          checks: results.checks
        });

        if (this.consecutiveFailures >= this.alertThreshold) {
          this.alert('Multiple consecutive health check failures', results);
        }
      }

      return results;
    } catch (error) {
      this.consecutiveFailures++;
      this.log('error', 'Health check error', { error: error.message });
      
      if (this.consecutiveFailures >= this.alertThreshold) {
        this.alert('Health check errors', { error: error.message });
      }
      
      throw error;
    }
  }

  alert(message, data) {
    this.log('alert', `🚨 ALERT: ${message}`, data);
    
    // In a production environment, you would send this to:
    // - Email notifications
    // - Slack webhooks
    // - PagerDuty
    // - SMS alerts
    // - Monitoring dashboards
    
    console.log('🚨🚨🚨 CRITICAL ALERT 🚨🚨🚨');
    console.log(`Alert: ${message}`);
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
  }

  async monitorWebEndpoint(url = 'http://localhost:19000') {
    try {
      const http = require('http');
      const https = require('https');
      const protocol = url.startsWith('https') ? https : https;
      
      return new Promise((resolve, reject) => {
        const req = protocol.get(url, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve({ status: 'ok', statusCode: res.statusCode });
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });

        req.setTimeout(10000, () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });

        req.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Web endpoint check failed: ${error.message}`);
    }
  }

  checkDiskSpace() {
    try {
      const stats = fs.statSync(process.cwd());
      // This is a basic check - in production you'd use more sophisticated disk monitoring
      return { status: 'ok', message: 'Disk space check completed' };
    } catch (error) {
      throw new Error(`Disk space check failed: ${error.message}`);
    }
  }

  checkMemoryUsage() {
    const usage = process.memoryUsage();
    const mbUsage = {
      rss: Math.round(usage.rss / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      external: Math.round(usage.external / 1024 / 1024)
    };

    // Alert if heap usage is over 500MB (adjust threshold as needed)
    if (mbUsage.heapUsed > 500) {
      this.log('warning', 'High memory usage detected', mbUsage);
    }

    return mbUsage;
  }

  async runFullMonitoringCycle() {
    this.log('info', 'Starting monitoring cycle');

    try {
      // Health check
      await this.checkHealth();

      // Memory usage check
      const memoryUsage = this.checkMemoryUsage();
      this.log('info', 'Memory usage check completed', memoryUsage);

      // Disk space check
      const diskCheck = this.checkDiskSpace();
      this.log('info', diskCheck.message);

      // Web endpoint check (if server is supposed to be running)
      try {
        const webCheck = await this.monitorWebEndpoint();
        this.log('info', 'Web endpoint check passed', webCheck);
      } catch (error) {
        // Don't fail the entire cycle if web endpoint is down
        this.log('warning', 'Web endpoint check failed', { error: error.message });
      }

    } catch (error) {
      this.log('error', 'Monitoring cycle failed', { error: error.message });
    }

    this.log('info', 'Monitoring cycle completed');
  }

  start() {
    if (this.isRunning) {
      this.log('warning', 'Monitor is already running');
      return;
    }

    this.isRunning = true;
    this.log('info', 'Starting GQCars error monitor', { 
      interval: this.interval,
      alertThreshold: this.alertThreshold 
    });

    // Run initial check
    this.runFullMonitoringCycle();

    // Set up periodic monitoring
    this.intervalId = setInterval(() => {
      this.runFullMonitoringCycle();
    }, this.interval);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      this.stop();
      process.exit(0);
    });
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.log('info', 'GQCars error monitor stopped');
  }

  // Generate monitoring report
  generateReport() {
    try {
      const logs = fs.readFileSync(this.logFile, 'utf8');
      const lines = logs.split('\n').filter(line => line.trim());
      
      const report = {
        generatedAt: new Date().toISOString(),
        totalEvents: lines.length,
        eventsByLevel: {},
        recentEvents: lines.slice(-50), // Last 50 events
        summary: {}
      };

      // Count events by level
      lines.forEach(line => {
        const levelMatch = line.match(/\[(INFO|WARNING|ERROR|ALERT)\]/);
        if (levelMatch) {
          const level = levelMatch[1].toLowerCase();
          report.eventsByLevel[level] = (report.eventsByLevel[level] || 0) + 1;
        }
      });

      // Summary
      report.summary = {
        healthStatus: this.consecutiveFailures === 0 ? 'healthy' : 'degraded',
        consecutiveFailures: this.consecutiveFailures,
        alertsToday: report.eventsByLevel.alert || 0,
        errorsToday: report.eventsByLevel.error || 0
      };

      const reportPath = path.join(process.cwd(), 'monitoring-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      console.log('📊 Monitoring report generated:', reportPath);
      return report;
    } catch (error) {
      console.error('Failed to generate report:', error.message);
      return null;
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'start';

  const monitor = new ErrorMonitor({
    interval: 30000, // 30 seconds
    alertThreshold: 3
  });

  switch (command) {
    case 'start':
      monitor.start();
      break;
    
    case 'check':
      monitor.runFullMonitoringCycle().then(() => {
        process.exit(0);
      }).catch(() => {
        process.exit(1);
      });
      break;
    
    case 'report':
      monitor.generateReport();
      process.exit(0);
      break;
    
    default:
      console.log('Usage: node monitor.js [start|check|report]');
      console.log('  start  - Start continuous monitoring');
      console.log('  check  - Run a single monitoring cycle');
      console.log('  report - Generate monitoring report');
      process.exit(1);
  }
}

module.exports = ErrorMonitor;