/**
 * Clara Sterling Portfolio Interactions
 * Minimal, elegant micro-animations and custom components.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initLondonClock();
});

/**
 * Custom Cursor Logic
 * Creates an elegant double-layered cursor that follows the mouse with smooth interpolation.
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

  // Hover States for Interactive Elements
  const interactiveElements = document.querySelectorAll('a, button, .image-card, .logo');

  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      // Scale up the cursor and invert/fade colors
      cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cursor.style.backgroundColor = 'transparent';
      cursor.style.border = '1.2px solid var(--color-primary)';
      
      // Expand follower circle, hide its border, and fill with soft tinted green background
      follower.style.transform = 'translate(-50%, -50%) scale(1.6)';
      follower.style.borderColor = 'transparent';
      follower.style.backgroundColor = 'rgba(48, 96, 41, 0.08)';
    });

    element.addEventListener('mouseleave', () => {
      // Restore standard cursor dot
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'var(--color-primary)';
      cursor.style.border = 'none';
      
      // Restore standard follower circle
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.borderColor = 'rgba(48, 96, 41, 0.3)';
      follower.style.backgroundColor = 'transparent';
    });
  });

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
 * Live London clock
 * Displays real-time British Standard Time or Greenwich Mean Time dynamically in the footer.
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
      
      // Capitalize to match aesthetic uppercase footer styling
      clockElement.textContent = `LONDON, UK — ${hour}:${minute}:${second} BST/GMT`;
    } catch (e) {
      // Fallback if internationalization API fails or timeZone is unsupported
      const now = new Date();
      const localTime = now.toTimeString().split(' ')[0];
      clockElement.textContent = `LOCAL TIME — ${localTime}`;
    }
  }

  // Run immediately and update every second
  updateClock();
  setInterval(updateClock, 1000);
}
