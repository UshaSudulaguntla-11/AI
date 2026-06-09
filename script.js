/**
 * Spread Landing Page Interactions
 * Dynamic animations, custom cursor, deal scanner simulator, and interactive relist actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initLondonClock();
  initScannerSimulator();
});

/**
 * Custom Cursor Logic
 * Creates an double-layered cursor that follows the mouse with smooth interpolation.
 */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  
  if (!cursor || !follower) return;

  // Check if touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isTouchDevice) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    return;
  }

  // Cursor coordinates
  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  // Smooth interpolation rate (lower value = more delay)
  const interpolationRate = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Instantly move the center cursor dot
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    
    // Reveal cursor elements on first movement (avoid starting in top-left corner)
    if (cursor.style.opacity === '' || cursor.style.opacity === '0') {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    }
  });

  // Animate the follower circle with ease-out lag
  function animateFollower() {
    followerX += (mouseX - followerX) * interpolationRate;
    followerY += (mouseY - followerY) * interpolationRate;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(animateFollower);
  }
  requestAnimationFrame(animateFollower);

  // Setup Hover States for Interactive Elements
  setupCursorHovers();
}

/**
 * Attach mouse enter/leave listeners to all clickable elements.
 * Can be called again if new elements are dynamically added to the DOM.
 */
function setupCursorHovers() {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  if (!cursor || !follower) return;

  const interactiveElements = document.querySelectorAll('a, button, .deal-card, .logo, .nav-cta-btn');

  interactiveElements.forEach(element => {
    // Prevent duplicate listeners
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
  });

  function handleMouseEnter() {
    cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
    cursor.style.backgroundColor = 'transparent';
    cursor.style.border = '1.2px solid var(--color-primary)';
    
    follower.style.transform = 'translate(-50%, -50%) scale(1.6)';
    follower.style.borderColor = 'transparent';
    follower.style.backgroundColor = 'rgba(48, 96, 41, 0.08)';
  }

  function handleMouseLeave() {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.backgroundColor = 'var(--color-primary)';
    cursor.style.border = 'none';
    
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.borderColor = 'rgba(48, 96, 41, 0.3)';
    follower.style.backgroundColor = 'transparent';
  }

  // Hide cursor when mouse leaves the viewport
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  // Re-show cursor when mouse enters the viewport
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

/**
 * Scanner Simulator
 * Simulates a real-time background market scan.
 * Animates the deal counter from 0 to 47 and cycles through marketplace check statuses.
 */
function initScannerSimulator() {
  const statusElement = document.getElementById('scanner-status');
  const countElement = document.getElementById('deals-count');
  
  if (!statusElement || !countElement) return;

  const scanStates = [
    'Scanning Facebook Marketplace...',
    'Checking Craigslist feeds...',
    'Indexing OfferUp listings...',
    'Analyzing eBay completed items...',
    'Matching pricing spreads...',
    'Filtering high margin opportunities...',
    'Active scanning... 🟢'
  ];

  let stateIndex = 0;

  // Cycle through scanning states every 4 seconds
  const statusInterval = setInterval(() => {
    if (stateIndex < scanStates.length - 1) {
      statusElement.textContent = scanStates[stateIndex];
      stateIndex++;
    } else {
      statusElement.textContent = scanStates[scanStates.length - 1];
      clearInterval(statusInterval);
    }
  }, 3500);

  // Animate the deals found counter up to 47 deals on page load
  const targetDeals = 47;
  let currentDeals = 0;
  const countDuration = 2800; // ms
  const countSteps = 50;
  const countIncrement = targetDeals / countSteps;
  const countIntervalTime = countDuration / countSteps;

  const countTimer = setInterval(() => {
    currentDeals += countIncrement;
    if (currentDeals >= targetDeals) {
      countElement.textContent = `${targetDeals} DEALS FOUND`;
      clearInterval(countTimer);
    } else {
      countElement.textContent = `${Math.floor(currentDeals)} DEALS FOUND`;
    }
  }, countIntervalTime);
}

/**
 * 1-Tap Relist Action
 * Simulates relisting an item by updating button state and displaying a toast notification.
 */
function triggerRelist(cardId, itemName, marginValue) {
  const card = document.querySelector(`.deal-card[data-id="${cardId}"]`);
  if (!card) return;

  const btn = card.querySelector('.relist-btn');
  if (!btn || btn.disabled) return;

  // Put button in active loading state
  btn.disabled = true;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span>Relisting...</span>';
  btn.style.opacity = '0.7';

  // Simulate server/network latency
  setTimeout(() => {
    // Update button to success state
    btn.innerHTML = '<span>Relisted ✓</span>';
    btn.style.backgroundColor = 'transparent';
    btn.style.color = 'var(--color-primary)';
    btn.style.border = '1px solid var(--color-primary)';
    btn.style.opacity = '1';

    // Trigger Success Toast
    showToast(itemName, marginValue);
  }, 1200);
}

/**
 * Displays a custom animated toast notification indicating listing success.
 */
function showToast(itemName, marginValue) {
  const toast = document.getElementById('relist-toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  // Set message content
  toastText.innerHTML = `AI draft created for <strong>${itemName}</strong> (+$${marginValue} margin).`;
  
  // Show toast
  toast.classList.add('show');

  // Hide toast after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/**
 * Live London Clock
 * Displays real-time British Standard Time / Greenwich Mean Time dynamically in the footer.
 */
function initLondonClock() {
  const clockElement = document.getElementById('time-display');
  if (!clockElement) return;

  function updateClock() {
    try {
      const options = {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };

      const formatter = new Intl.DateTimeFormat('en-GB', options);
      const timeParts = formatter.formatToParts(new Date());
      
      let hour = '', minute = '', second = '';
      for (const part of timeParts) {
        if (part.type === 'hour') hour = part.value;
        if (part.type === 'minute') minute = part.value;
        if (part.type === 'second') second = part.value;
      }
      
      clockElement.textContent = `LONDON, UK — ${hour}:${minute}:${second} BST/GMT`;
    } catch (e) {
      const now = new Date();
      const localTime = now.toTimeString().split(' ')[0];
      clockElement.textContent = `LOCAL TIME — ${localTime}`;
    }
  }

  // Run immediately and update every second
  updateClock();
  setInterval(updateClock, 1000);
}

// Export function to global scope for HTML inline onclick handlers
window.triggerRelist = triggerRelist;
