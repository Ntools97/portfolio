// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hero role rotator ──
const roles = document.querySelectorAll('.role');
let current = 0;
setInterval(() => {
  roles[current].classList.remove('active');
  current = (current + 1) % roles.length;
  roles[current].classList.add('active');
}, 2200);

// ── Smooth fade-in on scroll ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.skill-card, .project-card, .tool-group, .about-card, .stat, .contact-item'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ── Project filter ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cats = card.dataset.cat || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          card.style.transition = 'opacity 0.4s, transform 0.4s';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '60px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'rgba(10,14,26,0.98)';
  navLinks.style.padding = '20px 24px';
  navLinks.style.borderBottom = '1px solid #1e2740';
});

// ── Contact form ──
const form = document.querySelector('.contact-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#10b981';
  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    btn.style.background = '';
    form.reset();
  }, 3000);
});

// ── Project Video ──
document.querySelectorAll('.project-video-wrap').forEach(wrap => {
  const video   = wrap.querySelector('.project-video');
  const overlay = wrap.querySelector('.video-overlay');
  const btn     = wrap.querySelector('.play-btn');

  if (!video) return;

  btn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      overlay.classList.add('playing');
      btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
      video.pause();
      overlay.classList.remove('playing');
      btn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  });

  // Show play btn again on end
  video.addEventListener('ended', () => {
    overlay.classList.remove('playing');
    btn.innerHTML = '<i class="fa-solid fa-play"></i>';
  });
});

// ── Slideshow ──
document.querySelectorAll('.project-slideshow:not(.no-img)').forEach(ss => {
  const slides = ss.querySelectorAll('.slide');
  const dots   = ss.querySelectorAll('.dot');
  if (slides.length <= 1) {
    ss.querySelector('.slide-btn.prev')?.remove();
    ss.querySelector('.slide-btn.next')?.remove();
    return;
  }
  let idx = 0;
  function goTo(n) {
    slides[idx].classList.remove('active');
    dots[idx]?.classList.remove('active');
    idx = (n + slides.length) % slides.length;
    slides[idx].classList.add('active');
    dots[idx]?.classList.add('active');
  }
  ss.querySelector('.slide-btn.prev')?.addEventListener('click', () => goTo(idx - 1));
  ss.querySelector('.slide-btn.next')?.addEventListener('click', () => goTo(idx + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
});

// ── Active nav link highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});
