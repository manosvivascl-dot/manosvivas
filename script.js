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



  /* ── Preferencias: idioma, modo, texto y sonido ───────── */

  var PREF = {
    leer: function (clave, porDefecto) {
      try { return localStorage.getItem('mv_' + clave) || porDefecto; }
      catch (e) { return porDefecto; }
    },
    guardar: function (clave, valor) {
      try { localStorage.setItem('mv_' + clave, valor); } catch (e) {}
    }
  };


  /* ── Idiomas ──────────────────────────────────────────── */
  function iniciarIdiomas() {
    var DICC = window.__IDIOMAS__;
    if (!DICC) return;

    var botones = $$('[data-lang]');

    function aplicar(idioma) {
      var d = DICC[idioma];
      if (!d) return;

      // Textos de la página
      $$('[data-t]').forEach(function (el) {
        var clave = el.getAttribute('data-t');
        if (d[clave] != null) el.innerHTML = d[clave];
      });

      // Etiquetas para lectores de pantalla
      $$('[data-t-label]').forEach(function (el) {
        var clave = el.getAttribute('data-t-label');
        if (d[clave]) el.setAttribute('aria-label', d[clave]);
      });

      // Cabecera del documento
      if (d['doc.titulo']) document.title = d['doc.titulo'];
      var meta = $('meta[name="description"]');
      if (meta && d['doc.desc']) meta.setAttribute('content', d['doc.desc']);

      document.documentElement.setAttribute('lang', idioma);

      botones.forEach(function (b) {
        var suyo = b.getAttribute('data-lang') === idioma;
        b.classList.toggle('is-on', suyo);
        b.setAttribute('aria-pressed', String(suyo));
      });

      PREF.guardar('idioma', idioma);

      // El menú puede haber cambiado de largo
      refrescarEtiquetaMenu(d);
    }

    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        aplicar(b.getAttribute('data-lang'));
      });
    });

    // Idioma guardado, o el del navegador, o español
    var guardado = PREF.leer('idioma', null);
    if (!guardado) {
      var nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
      guardado = DICC[nav] ? nav : 'es';
    }
    if (guardado !== 'es') aplicar(guardado);
    else aplicar('es');
  }

  function refrescarEtiquetaMenu(d) {
    var boton = $('[data-burger]');
    if (!boton || !d) return;
    var abierto = boton.getAttribute('aria-expanded') === 'true';
    var clave = abierto ? 'a11y.menuCerrar' : 'a11y.menu';
    if (d[clave]) boton.setAttribute('aria-label', d[clave]);
  }


  /* ── Modo día y noche ─────────────────────────────────── */
  function iniciarModo() {
    var boton = $('[data-modo-btn]');
    var raiz = document.documentElement;

    function aplicar(modo) {
      raiz.setAttribute('data-modo', modo);
      if (boton) boton.setAttribute('aria-pressed', String(modo === 'noche'));

      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', modo === 'noche' ? '#1a1d17' : '#f7f2ea');

      PREF.guardar('modo', modo);
    }

    // Preferencia guardada, o la del sistema
    var guardado = PREF.leer('modo', null);
    if (!guardado) {
      var oscuro = window.matchMedia &&
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
      guardado = oscuro ? 'noche' : 'dia';
    }
    aplicar(guardado);

    if (boton) {
      boton.addEventListener('click', function () {
        aplicar(raiz.getAttribute('data-modo') === 'noche' ? 'dia' : 'noche');
      });
    }
  }


  /* ── Tamaño del texto ─────────────────────────────────── */
  function iniciarTexto() {
    var PASOS = [100, 112, 125, 140];
    var raiz = document.documentElement;

    var actual = parseInt(PREF.leer('texto', '100'), 10);
    if (PASOS.indexOf(actual) === -1) actual = 100;

    function aplicar(valor) {
      actual = valor;
      raiz.style.fontSize = valor + '%';
      PREF.guardar('texto', String(valor));

      $$('[data-texto]').forEach(function (b) {
        var esMas = b.getAttribute('data-texto') === 'mas';
        b.disabled = esMas ? (valor === PASOS[PASOS.length - 1]) : (valor === PASOS[0]);
      });
    }

    aplicar(actual);

    $$('[data-texto]').forEach(function (boton) {
      boton.addEventListener('click', function () {
        var i = PASOS.indexOf(actual);
        var siguiente = boton.getAttribute('data-texto') === 'mas' ? i + 1 : i - 1;
        if (siguiente >= 0 && siguiente < PASOS.length) aplicar(PASOS[siguiente]);
      });
    });
  }


  /* ── Sonido ambiental ─────────────────────────────────── */
  function iniciarSonido() {
    var boton = $('[data-sonido-btn]');
    if (!boton) return;

    var audio = null, maestro = null, voces = [], sonando = false;

    function construir() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;

      audio = new AC();
      maestro = audio.createGain();
      maestro.gain.value = 0;
      maestro.connect(audio.destination);

      // Un acorde muy suave y grave, casi un cuenco tibetano
      [110, 164.81, 220, 329.63].forEach(function (hz, i) {
        var osc = audio.createOscillator();
        var vol = audio.createGain();
        var vaiven = audio.createOscillator();
        var prof = audio.createGain();

        osc.type = 'sine';
        osc.frequency.value = hz;

        // Cada voz respira a su propio ritmo
        vaiven.frequency.value = 0.045 + i * 0.021;
        prof.gain.value = 0.32;
        vaiven.connect(prof);
        prof.connect(vol.gain);

        vol.gain.value = 0.42 / (i + 1.4);

        osc.connect(vol);
        vol.connect(maestro);

        osc.start();
        vaiven.start();
        voces.push(osc, vaiven);
      });

      return true;
    }

    function subir() {
      if (!audio && !construir()) return;
      if (audio.state === 'suspended') audio.resume();
      maestro.gain.cancelScheduledValues(audio.currentTime);
      maestro.gain.setTargetAtTime(0.055, audio.currentTime, 1.6);
      sonando = true;
    }

    function bajar() {
      if (!maestro) return;
      maestro.gain.cancelScheduledValues(audio.currentTime);
      maestro.gain.setTargetAtTime(0, audio.currentTime, 0.9);
      sonando = false;
    }

    function pintar() {
      boton.setAttribute('aria-pressed', String(sonando));
      boton.classList.toggle('is-on', sonando);

      var d = window.__IDIOMAS__ && window.__IDIOMAS__[document.documentElement.lang];
      if (d) {
        var clave = sonando ? 'a11y.sonidoOff' : 'a11y.sonido';
        if (d[clave]) boton.setAttribute('aria-label', d[clave]);
      }
    }

    boton.addEventListener('click', function () {
      if (sonando) bajar(); else subir();
      pintar();
      PREF.guardar('sonido', sonando ? 'si' : 'no');
    });

    // Nunca arranca solo: siempre requiere que la persona lo pida
    pintar();

    // Al cambiar de pestaña, se calla
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && sonando && audio) audio.suspend();
      else if (!document.hidden && sonando && audio) audio.resume();
    });
  }


  /* ── Arranque ─────────────────────────────────────────── */
  function arrancar() {
    safe(iniciarModo,        'modo');
    safe(iniciarTexto,       'texto');
    safe(iniciarIdiomas,     'idiomas');
    safe(iniciarSonido,      'sonido');
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
