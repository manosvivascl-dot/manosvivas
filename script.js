/* ═══════════════════════════════════════════════════════════
   MANOS VIVAS

   ⬇⬇⬇  LO ÚNICO QUE NECESITAS EDITAR TÚ  ⬇⬇⬇
   Cambia los valores, guarda el archivo y listo.
   ═══════════════════════════════════════════════════════════ */

window.__MANOS_VIVAS__ = {

  // Cupos del Pack Apertura que ya vendiste (de 0 a 10).
  // El frasco de aceite de la web se llena solo según este número.
  cuposVendidos: 0,

  // Total de cupos del lanzamiento.
  cuposTotales: 10,

  // Hasta cuándo dura el precio de apertura (año, mes, día, hora, minuto).
  // OJO con el mes: enero es 0, así que septiembre es 8.
  finLanzamiento: new Date(2026, 8, 18, 23, 59),

  // Tu enlace para que la gente te deje reseñas en Google.
  // Lo consigues creando tu Perfil de Empresa en Google.
  enlaceResenas: 'https://g.page/r/TU-CODIGO/review',

  // Tu enlace de Calendly para que elijan día y hora.
  enlaceCalendario: 'https://calendly.com/manosvivas',

  // Tu enlace de cobro de MercadoPago.
  enlacePago: 'https://link.mercadopago.cl/manosvivas',

  // Tu Instagram (la dirección completa).
  instagram: 'https://instagram.com/manosvivas',

  // Tu WhatsApp, sin el signo + ni espacios.
  whatsapp: '56995742775'
};

/* ═══════════════════════════════════════════════════════════
   ⬆⬆⬆  DE AQUÍ HACIA ABAJO NO HACE FALTA TOCAR NADA  ⬆⬆⬆
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var CFG = window.__MANOS_VIVAS__;

  /* Si algo falla, que no se caiga el resto de la página */
  function safe(fn, nombre) {
    try { fn(); } catch (e) { console.warn('[' + nombre + ']', e); }
  }

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function pesos(n) { return '$' + Number(n).toLocaleString('es-CL'); }


  /* ── La apertura del aceite ───────────────────────────── */
  function iniciarApertura() {
    var capa = $('[data-oil]');
    if (!capa) return;

    var quitar = function () {
      capa.classList.add('is-gone');
      document.body.classList.remove('is-locked');
      setTimeout(function () {
        if (capa && capa.parentNode) capa.parentNode.removeChild(capa);
      }, 1400);
    };

    document.body.classList.add('is-locked');

    // Momento natural: cuando el aceite terminó de llenar la pantalla
    setTimeout(quitar, 3900);

    // Red de seguridad por si algo se traba
    setTimeout(quitar, 5200);

    // Si alguien quiere saltársela
    capa.addEventListener('click', quitar);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') quitar();
    });
  }


  /* ── Barra de navegación ──────────────────────────────── */
  function iniciarNav() {
    var nav = $('[data-nav]');
    if (!nav) return;

    var pintar = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 30);
    };
    window.addEventListener('scroll', pintar, { passive: true });
    pintar();
  }


  /* ── Menú del celular ─────────────────────────────────── */
  function iniciarMenu() {
    var boton = $('[data-burger]');
    var menu = $('[data-menu]');
    if (!boton || !menu) return;

    var cerrar = function () {
      menu.classList.remove('is-open');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('is-locked');
    };

    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('is-open');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('is-locked', abierto);
    });

    $$('a', menu).forEach(function (a) { a.addEventListener('click', cerrar); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  }


  /* ── Aparición al desplazar ───────────────────────────── */
  function iniciarApariciones() {
    var piezas = $$('.rise');
    if (!piezas.length) return;

    var mostrarTodo = function () {
      piezas.forEach(function (p) { p.classList.add('is-in'); });
    };

    if (!('IntersectionObserver' in window)) { mostrarTodo(); return; }

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    piezas.forEach(function (p) { obs.observe(p); });

    // Si algo impide que se disparen, se muestran igual
    setTimeout(mostrarTodo, 6000);
  }


  /* ── Cuenta regresiva ─────────────────────────────────── */
  function iniciarReloj() {
    var reloj = $('[data-clock]');
    if (!reloj) return;

    var casillas = {
      d: $('[data-cd="d"]', reloj),
      h: $('[data-cd="h"]', reloj),
      m: $('[data-cd="m"]', reloj),
      s: $('[data-cd="s"]', reloj)
    };

    var dos = function (n) { return String(n).padStart(2, '0'); };

    var tick = function () {
      var falta = CFG.finLanzamiento - Date.now();

      if (falta <= 0) {
        Object.keys(casillas).forEach(function (k) {
          if (casillas[k]) casillas[k].textContent = '00';
        });
        return;
      }

      if (casillas.d) casillas.d.textContent = Math.floor(falta / 86400000);
      if (casillas.h) casillas.h.textContent = dos(Math.floor(falta / 3600000) % 24);
      if (casillas.m) casillas.m.textContent = dos(Math.floor(falta / 60000) % 60);
      if (casillas.s) casillas.s.textContent = dos(Math.floor(falta / 1000) % 60);
    };

    tick();
    setInterval(tick, 1000);
  }


  /* ── El frasco de aceite se llena con los cupos ───────── */
  function iniciarFrasco() {
    var aceite = $('[data-jar-oil]');
    var numero = $('[data-taken]');

    var vendidos = Math.max(0, Math.min(CFG.cuposVendidos, CFG.cuposTotales));

    if (numero) numero.textContent = vendidos;

    if (aceite) {
      var alto = (vendidos / CFG.cuposTotales) * 100;
      // Pequeña espera para que se vea subir el aceite
      setTimeout(function () { aceite.style.height = alto + '%'; }, 600);
    }
  }


  /* ── Selector de servicio y total ─────────────────────── */
  function iniciarReserva() {
    var selector = $('[data-service]');
    var caja = $('[data-total]');
    var monto = $('[data-total-n]');
    if (!selector) return;

    var refrescar = function () {
      var op = selector.options[selector.selectedIndex];
      var precio = op && op.getAttribute('data-p');

      if (precio && monto && caja) {
        monto.textContent = pesos(precio);
        caja.hidden = false;
      } else if (caja) {
        caja.hidden = true;
      }

      // Guardamos lo elegido para el mensaje de WhatsApp
      if (op && precio) {
        try { sessionStorage.setItem('mv_eleccion', op.textContent.trim()); } catch (e) {}
      }
    };

    selector.addEventListener('change', refrescar);
    refrescar();

    // Los botones "Reservar" de toda la página
    $$('[data-pick]').forEach(function (boton) {
      boton.addEventListener('click', function () {
        var buscado = boton.getAttribute('data-pick').toLowerCase();

        var opciones = Array.prototype.slice.call(selector.options);
        var hallada = opciones.filter(function (o) {
          var texto = o.textContent.toLowerCase();
          return texto.indexOf(buscado) === 0 ||
                 buscado.indexOf(texto.split('—')[0].trim()) === 0;
        })[0];

        if (hallada) {
          selector.value = hallada.value;
          refrescar();
        }

        var destino = $('#reservar');
        if (destino) destino.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }


  /* ── Enlaces que salen de la configuración ────────────── */
  function iniciarEnlaces() {
    $$('[data-review]').forEach(function (a) {
      a.href = CFG.enlaceResenas; a.target = '_blank'; a.rel = 'noopener';
    });

    $$('[data-calendar]').forEach(function (a) { a.href = CFG.enlaceCalendario; });
    $$('[data-pay]').forEach(function (a) { a.href = CFG.enlacePago; });
    $$('[data-instagram]').forEach(function (a) { a.href = CFG.instagram; });

    // El WhatsApp de la reserva lleva lo que la persona eligió
    $$('[data-wsp-book]').forEach(function (a) {
      a.addEventListener('click', function () {
        var elegido = null;
        try { elegido = sessionStorage.getItem('mv_eleccion'); } catch (e) {}

        var texto = elegido
          ? 'Hola Alejandro, acabo de reservar en Manos Vivas: ' + elegido
          : 'Hola Alejandro, acabo de reservar en Manos Vivas';

        a.href = 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(texto);
      });
    });
  }


  /* ── Arranque ─────────────────────────────────────────── */
  function arrancar() {
    safe(iniciarApertura,    'apertura');
    safe(iniciarNav,         'nav');
    safe(iniciarMenu,        'menu');
    safe(iniciarApariciones, 'apariciones');
    safe(iniciarReloj,       'reloj');
    safe(iniciarFrasco,      'frasco');
    safe(iniciarReserva,     'reserva');
    safe(iniciarEnlaces,     'enlaces');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }

})();
