// Tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// Mobile menu
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// Modal
function abrirContacto(pack) {
  document.getElementById('modalTitle').textContent = pack;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });

// Formulario principal
function enviarFormulario(e) {
  e.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').classList.add('show');
}

// Modal form
function enviarModal(e) {
  e.preventDefault();
  cerrarModal();
}

// Nav scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  nav.style.boxShadow = window.scrollY > 40 ? '0 2px 24px rgba(42,31,26,.1)' : 'none';
});

// Animate on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .pack-card, .testimonio, .hero-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
