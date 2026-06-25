/* ═════════════════════════════════════════════════════════════
   SERVICES CONFIGURATOR CORE SCRIPT
   Ambangan Fast Print — Shared Animations, Navigation & Tilt UX
   ═════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC YEAR
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. SCROLL-LINKED NAVIGATION BEHAVIORS
  let lastScrollY = window.scrollY;
  const navWrap = document.querySelector('.nav-wrap');
  const body = document.body;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Scrolling down (hide header & slide sub-nav up)
    if (currentScrollY > 50) {
      if (navWrap) navWrap.classList.add('nav-hidden');
      body.classList.add('nav-scrolled-down');
    } else {
      // Near top (show header & move sub-nav down)
      if (navWrap) navWrap.classList.remove('nav-hidden');
      body.classList.remove('nav-scrolled-down');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // 3. FADE-UP INTERSECTION OBSERVER
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '-20px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // 4. FILE UPLOAD EVENT HANLDERS
  const uploadWraps = document.querySelectorAll('.upload-wrap');
  uploadWraps.forEach(wrap => {
    const input = wrap.querySelector('.upload-input');
    const details = wrap.querySelector('.upload-file-details');
    const uploadText = wrap.querySelector('.upload-title');
    const uploadDesc = wrap.querySelector('.upload-desc');

    if (input && details) {
      // Drag & drop classes
      ['dragenter', 'dragover'].forEach(eventName => {
        wrap.addEventListener(eventName, (e) => {
          e.preventDefault();
          wrap.classList.add('dragover');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        wrap.addEventListener(eventName, (e) => {
          e.preventDefault();
          wrap.classList.remove('dragover');
        }, false);
      });

      // Change event
      input.addEventListener('change', (e) => {
        if (input.files && input.files.length > 0) {
          const file = input.files[0];
          details.innerHTML = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
          details.style.display = 'inline-flex';
          uploadText.textContent = "Design Selected";
          uploadDesc.textContent = "Change reference file by clicking again";
        }
      });
    }
  });
});

// 5. GLOBAL 3D TILT EFFECT INITIATOR
function init3DTilt(wrapperId, cardId, glareId) {
  const wrapper = document.getElementById(wrapperId);
  const card = document.getElementById(cardId);
  const glare = document.getElementById(glareId);

  if (!wrapper || !card) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Coordinates from center (-width/2 to +width/2)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Rotate degrees (max 10deg)
    const rotateX = (mouseY / (height / 2)) * -10; // y-axis movements tilt on x-axis
    const rotateY = (mouseX / (width / 2)) * 10;   // x-axis movements tilt on y-axis
    
    // Apply transformations
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'none';

    // Glare positioning
    if (glare) {
      // Convert coords to percentages (0% to 100%)
      const xPct = ((mouseX + width / 2) / width) * 100;
      const yPct = ((mouseY + height / 2) / height) * 100;
      glare.style.background = `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 60%)`;
      glare.style.opacity = '0.45';
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    // Reset to flat
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    card.style.transition = 'transform 0.5s ease-out';
    if (glare) {
      glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 60%)`;
      glare.style.opacity = '0.3';
      glare.style.transition = 'all 0.5s ease-out';
    }
  });
}
