/* ═══════════════════════════════════════════════════════════
   MANOS VIVAS

   ⬇⬇⬇  ESTO ES LO ÚNICO QUE NECESITAS EDITAR TÚ  ⬇⬇⬇
   Cambia los valores entre comillas y guarda. Nada más.
   ═══════════════════════════════════════════════════════════ */

const CONFIG = {

  // Cuántos cupos del Pack Apertura ya vendiste (0 a 10).
  // Actualízalo cada vez que alguien compre.
  cuposVendidos: 0,

  // Total de cupos del lanzamiento.
  cuposTotales: 10,

  // Hasta cuándo dura el precio de lanzamiento (año, mes, día).
  // OJO: el mes va del 0 al 11 → enero es 0, septiembre es 8.
  finLanzamiento: new Date(2026, 8, 18, 23, 59),

  // Tu enlace para que la gente deje reseñas en Google.
  // Lo obtienes creando tu Perfil de Empresa en Google.
  enlaceResenas: 'https://g.page/r/TU-CODIGO-DE-GOOGLE/review',

  // Tu WhatsApp, sin el signo + ni espacios.
  whatsapp: '56995742775'
};

/* ═══════════════════════════════════════════════════════════
   ⬆⬆⬆  DE AQUÍ HACIA ABAJO NO HACE FALTA TOCAR NADA  ⬆⬆⬆
   ═══════════════════════════════════════════════════════════ */


/* ── Barra de navegación al hacer scroll ─────────────────── */
const nav = document.getElementById('nav');
let ultimoScroll = 0;

function alHacerScroll() {
  const y = window.scrollY;
  nav.classList.toggle('is-stuck', y > 24);
  ultimoScroll = y;
}
window.addEventListener('scroll', alHacerScroll, { passive: true });
alHacerScroll();


/* ── Menú en el celular ──────────────────────────────────── */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

burger.addEventListener('click', () => {
  const abierto = menu.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(abierto));
  burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = abierto ? 'hidden' : '';
});

menu.querySelectorAll('a').forEach(enlace => {
  enlace.addEventListener('click', () => {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});


/* ── Aparición suave al hacer scroll ─────────────────────── */
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('is-in');
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => observador.observe(el));


/* ── Cuenta regresiva del lanzamiento ────────────────────── */
const cd = {
  d: document.getElementById('cd-d'),
  h: document.getElementById('cd-h'),
  m: document.getElementById('cd-m'),
  s: document.getElementById('cd-s')
};

function actualizarCuenta() {
  const falta = CONFIG.finLanzamiento - Date.now();

  if (falta <= 0) {
    [cd.d, cd.h, cd.m, cd.s].forEach(el => { if (el) el.textContent = '00'; });
    return;
  }

  const dias  = Math.floor(falta / 86400000);
  const horas = Math.floor(falta / 3600000) % 24;
  const min   = Math.floor(falta / 60000) % 60;
  const seg   = Math.floor(falta / 1000) % 60;

  const dosDigitos = n => String(n).padStart(2, '0');

  if (cd.d) cd.d.textContent = dias;
  if (cd.h) cd.h.textContent = dosDigitos(horas);
  if (cd.m) cd.m.textContent = dosDigitos(min);
  if (cd.s) cd.s.textContent = dosDigitos(seg);
}

if (cd.d) {
  actualizarCuenta();
  setInterval(actualizarCuenta, 1000);
}


/* ── Cupos vendidos ──────────────────────────────────────── */
const cuposTexto = document.querySelector('[data-spots-taken]');
const cuposBarra = document.querySelector('[data-spots-bar]');

if (cuposTexto && cuposBarra) {
  const vendidos = Math.min(CONFIG.cuposVendidos, CONFIG.cuposTotales);
  const porcentaje = (vendidos / CONFIG.cuposTotales) * 100;

  cuposTexto.textContent = vendidos;
  // Pequeña espera para que se vea la animación de la barra
  setTimeout(() => { cuposBarra.style.width = porcentaje + '%'; }, 400);
}


/* ── Selector de servicio y total a pagar ────────────────── */
const selector = document.getElementById('servicio');
const cajaTotal = document.getElementById('total');
const montoTotal = document.getElementById('total-monto');

function formatearPesos(numero) {
  return '$' + Number(numero).toLocaleString('es-CL');
}

function actualizarTotal() {
  const opcion = selector.options[selector.selectedIndex];
  const precio = opcion && opcion.dataset.precio;

  if (precio) {
    montoTotal.textContent = formatearPesos(precio);
    cajaTotal.hidden = false;
  } else {
    cajaTotal.hidden = true;
  }
}

if (selector) {
  selector.addEventListener('change', actualizarTotal);
  actualizarTotal();
}


/* ── Botones "Reservar" de toda la página ────────────────── */
document.querySelectorAll('[data-reservar]').forEach(boton => {
  boton.addEventListener('click', () => {
    const buscado = boton.dataset.reservar.toLowerCase();

    if (selector) {
      // Busca la opción que mejor calce con lo que se pidió
      const opciones = Array.from(selector.options);
      const encontrada = opciones.find(o => {
        const texto = o.textContent.toLowerCase();
        return texto.startsWith(buscado) || buscado.startsWith(texto.split('—')[0].trim());
      });

      if (encontrada) {
        selector.value = encontrada.value;
        actualizarTotal();
      }
    }

    document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
  });
});


/* ── Enlace de reseñas de Google ─────────────────────────── */
document.querySelectorAll('[data-google-review]').forEach(enlace => {
  enlace.href = CONFIG.enlaceResenas;
  enlace.target = '_blank';
  enlace.rel = 'noopener';
});


/* ── El WhatsApp lleva el servicio elegido ───────────────── */
const botonPagar = document.getElementById('btn-pagar');

if (botonPagar && selector) {
  botonPagar.addEventListener('click', () => {
    const opcion = selector.options[selector.selectedIndex];
    if (opcion && opcion.dataset.precio) {
      // Guarda lo elegido para el mensaje de WhatsApp
      try {
        sessionStorage.setItem('mv_servicio', opcion.textContent);
      } catch (e) { /* modo privado del navegador */ }
    }
  });
}

document.querySelectorAll('a[href*="wa.me"]').forEach(enlace => {
  enlace.addEventListener('click', () => {
    let guardado = null;
    try { guardado = sessionStorage.getItem('mv_servicio'); } catch (e) {}

    if (guardado && enlace.href.includes('acabo%20de%20reservar')) {
      const texto = `Hola Alejandro, acabo de reservar en Manos Vivas: ${guardado}`;
      enlace.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
    }
  });
});
