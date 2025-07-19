// vite.config.js
// This configures Vite to use the vite-console-forward-plugin, which forwards browser console logs to your terminal.
import { defineConfig } from 'vite';
import consoleForward from 'vite-console-forward-plugin';

export default defineConfig({
  plugins: [consoleForward()], // Enables forwarding of browser console logs
  // You can add more Vite config options here as needed
});
