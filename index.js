/**
 * Karuta Card Tagger - Entry Point
 * 
 * This file serves as the application entry point and redirects
 * to the main application page.
 */

// Redirect to the main application page
window.location.href = './public/index.html';

// If the redirect doesn't work (for example, if this file is loaded directly in the browser),
// this code will run after a short delay
setTimeout(() => {
  if (window.location.pathname.endsWith('index.js') || 
      window.location.pathname.endsWith('src/') || 
      window.location.pathname.endsWith('src')) {
    console.log('Redirecting to main application...');
    window.location.replace('./public/index.html');
  }
}, 100);
