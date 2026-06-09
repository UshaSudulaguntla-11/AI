// ===========================
// NAVBAR – scroll behaviour
// ===========================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===========================
// SCROLL REVEAL
// ===========================
const revealEls = document.querySelectorAll(
  '.about-grid, .work-card, .service-item, .contact-inner, .section-label, .section-title'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80 * i);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => observer.observe(el));

// ===========================
// SMOOTH SCROLL for nav links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===========================
// HERO TEXT TYPING EFFECT
// ===========================
const headline = document.querySelector('.headline');
if (headline) {
  const originalHTML = headline.innerHTML;
  // Light cursor blink on page load (optional pulse on em)
  const em = headline.querySelector('em');
  if (em) {
    em.style.transition = 'color 0.4s ease';
    setTimeout(() => {
      em.style.color = '#4a8a3c';
      setTimeout(() => { em.style.color = '#306029'; }, 500);
    }, 1200);
  }
}

// ===========================
// CTA BUTTON – ripple effect
// ===========================
document.querySelectorAll('.cta-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      width: 0; height: 0;
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
      transform: translate(-50%, -50%);
      animation: rippleAnim 0.55s ease-out forwards;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { width: 220px; height: 220px; opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// ===========================
// WORK CARDS – tilt on hover
// ===========================
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===========================
// HERO IMAGE PARALLAX
// ===========================
const heroImgWrap = document.getElementById('hero-image-wrap');

window.addEventListener('scroll', () => {
  if (heroImgWrap) {
    const scrolled = window.scrollY;
    heroImgWrap.style.transform = `translateY(${scrolled * 0.06}px)`;
  }
}, { passive: true });

// ===========================
// HIDE SCROLL INDICATOR
// ===========================
const scrollIndicator = document.getElementById('scroll-indicator');
window.addEventListener('scroll', () => {
  if (scrollIndicator) {
    scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '0.5';
    scrollIndicator.style.transition = 'opacity 0.4s ease';
  }
}, { passive: true });

console.log('%c✦ Aura Studio — Built with passion.', 'color: #306029; font-size: 14px; font-weight: bold;');
