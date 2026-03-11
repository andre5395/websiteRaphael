/* ============================================================
   BAUMEISTER WEBSITE  –  script.js
   ============================================================ */

'use strict';

/* ── PRELOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
  }, 1800);
});

/* ── SCROLL PROGRESS BAR ───────────────────────────────────── */
const scrollProgress = document.getElementById('scroll-progress');
function updateScrollProgress() {
  const scrollTop    = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.style.width = scrollHeight > 0 ? `${(scrollTop / scrollHeight) * 100}%` : '0%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ── STICKY HEADER ─────────────────────────────────────────── */
const header = document.getElementById('header');
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ── MOBILE MENU ───────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden',  String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── REVEAL ON SCROLL (Intersection Observer) ───────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay, 10) || 0;
      setTimeout(() => el.classList.add('in'), delay);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade')
  .forEach(el => revealObserver.observe(el));

/* ── ANIMATED COUNTERS ─────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ── HERO CANVAS PARTICLE SYSTEM ───────────────────────────── */
(function initParticles() {
  const canvas  = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  let W, H, particles;

  const GOLD  = [200, 169, 110];
  const WHITE = [240, 240, 240];
  const COUNT = () => Math.min(60, Math.floor((W * H) / 22000));

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    particles = Array.from({ length: COUNT() }, createParticle);
  }

  function createParticle() {
    const isGold = Math.random() < .35;
    const color  = isGold ? GOLD : WHITE;
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - .5) * .4,
      vy:  (Math.random() - .5) * .4,
      r:   Math.random() * 1.5 + .5,
      a:   Math.random() * .5 + .1,
      color,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const opacity = (1 - dist / 130) * .12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${GOLD.join(',')}, ${opacity})`;
          ctx.lineWidth   = .5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.join(',')}, ${p.a})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < -10)  p.x = W + 10;
      if (p.x > W+10) p.x = -10;
      if (p.y < -10)  p.y = H + 10;
      if (p.y > H+10) p.y = -10;
    });

    requestAnimationFrame(draw);
  }

  // Parallax on mouse move
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - .5) * 12;
    mouseY = (e.clientY / window.innerHeight - .5) * 12;
    canvas.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1.03)`;
  });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ── PROJECT FILTER ────────────────────────────────────────── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.transition = 'opacity .4s ease, transform .4s ease';
      if (match) {
        card.style.opacity   = '1';
        card.style.transform = 'scale(1)';
        card.style.position  = 'relative';
        card.style.pointerEvents = 'auto';
      } else {
        card.style.opacity   = '0';
        card.style.transform = 'scale(.94)';
        // Collapse after transition
        setTimeout(() => {
          if (btn.dataset.filter !== 'all' && card.dataset.cat !== filter) {
            card.style.display = 'none';
          }
        }, 400);
      }
    });

    // Show all matching first
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      if (match) card.style.display = '';
    });

    // Trigger transitions
    requestAnimationFrame(() => {
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.style.opacity   = match ? '1' : '0';
        card.style.transform = match ? 'scale(1)' : 'scale(.94)';
        card.style.pointerEvents = match ? 'auto' : 'none';
      });
    });
  });
});

/* ── TESTIMONIALS SLIDER ───────────────────────────────────── */
(function initTestimonials() {
  const track   = document.getElementById('tm-track');
  const dotsWrap = document.getElementById('tm-dots');
  const btnPrev  = document.getElementById('tm-prev');
  const btnNext  = document.getElementById('tm-next');
  if (!track) return;

  const cards  = track.querySelectorAll('.tm-card');
  let current  = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'tm-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Referenz ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.tm-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5500); }
  function stopAuto()  { clearInterval(autoTimer); }

  btnPrev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  btnNext.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
  });

  // Pause on hover
  track.parentElement.addEventListener('mouseenter', stopAuto);
  track.parentElement.addEventListener('mouseleave', startAuto);

  startAuto();
})();

/* ── CONTACT FORM ──────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;

    // Simulate sending
    btn.innerHTML = '<span>Wird gesendet…</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled  = false;
      form.reset();
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => success.classList.remove('show'), 6000);
    }, 1600);
  });

  // Live validation feedback
  form.querySelectorAll('input[required], textarea[required]').forEach(field => {
    field.addEventListener('blur', () => {
      const valid = field.checkValidity();
      field.style.borderColor = valid ? '' : 'rgba(220,50,50,.6)';
    });
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
})();

/* ── ACTIVE NAV LINK ON SCROLL ──────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const offset   = 120;

  function update() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - offset) current = section.id;
    });
    navLinks.forEach(link => {
      link.style.color    = '';
      link.style.fontWeight = '';
      if (link.getAttribute('href') === `#${current}`) {
        if (!link.classList.contains('nav-cta')) {
          link.style.color      = 'var(--gold)';
          link.style.fontWeight = '700';
        }
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── SERVICE CARD 3-D TILT ──────────────────────────────────── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── HERO TITLE STAGGER ANIMATION ───────────────────────────── */
(function animateHeroTitle() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  const words = title.innerHTML.split(/(<[^>]+>|[^<\s]+)/g).filter(Boolean);
  let delay = 300;

  title.innerHTML = words.map(token => {
    if (token.startsWith('<') || token.trim() === '') return token;
    const span = `<span style="display:inline-block; opacity:0; transform:translateY(20px);
      transition: opacity .6s ease ${delay}ms, transform .6s cubic-bezier(.16,1,.3,1) ${delay}ms;">${token}</span>`;
    delay += 80;
    return span;
  }).join('');

  // Trigger after preloader ends
  setTimeout(() => {
    title.querySelectorAll('span').forEach(s => {
      s.style.opacity   = '1';
      s.style.transform = 'none';
    });
  }, 2100);
})();
