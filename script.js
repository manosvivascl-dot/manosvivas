/* ═══════════════════════════════════════════════════════════
   MANOS VIVAS

   ⬇⬇⬇  LO ÚNICO QUE NECESITAS EDITAR TÚ  ⬇⬇⬇
   Cambia los valores, guarda el archivo y listo.
   ═══════════════════════════════════════════════════════════ */

window.__MANOS_VIVAS__ = {

  // Cupos del Ritual de Apertura que ya vendiste (de 0 a 10).
  // La barra de la web se llena sola según este número.
  // Son cupos REALES: sube este número solo cuando vendas de verdad.
  cuposVendidos: 0,

  // Total de cupos de la campaña de apertura.
  cuposTotales: 10,

  // Tus enlaces de Calendly, uno por cada duración total posible.
  // Crea en Calendly un tipo de evento por duración y pega aquí su enlace.
  // Si dejas alguno vacío, se usa el enlace general de más abajo.
  calendarios: {
    60:  '',
    70:  '',
    75:  '',
    90:  '',
    100: '',
    105: '',
    120: ''
  },

  // Enlace general de Calendly (respaldo y para packs y suscripciones).
  enlaceCalendario: 'https://calendly.com/manosvivas',

  // Tu enlace de cobro de MercadoPago.
  enlacePago: 'https://link.mercadopago.cl/manosvivas',

  // Tu enlace para que la gente te deje reseñas en Google.
  // Lo consigues creando tu Perfil de Empresa en Google.
  enlaceResenas: 'https://g.page/r/TU-CODIGO/review',

  // Tus redes (la dirección completa).
  instagram: 'https://instagram.com/manosvivas',
  facebook:  'https://facebook.com/manosvivas',

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

  /* Traduce una clave del diccionario con respaldo en español */
  function txt(clave, respaldo) {
    var D = window.__IDIOMAS__;
    var idioma = document.documentElement.lang || 'es';
    var d = D && (D[idioma] || D.es);
    return (d && d[clave]) ? d[clave] : respaldo;
  }


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
      boton.setAttribute('aria-label', txt('a11y.menu', 'Abrir menú'));
      document.body.classList.remove('is-locked');
    };

    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('is-open');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto
        ? txt('a11y.menuCerrar', 'Cerrar menú')
        : txt('a11y.menu', 'Abrir menú'));
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


  /* ── "Conoce más" de cada masaje ──────────────────────── */
  function iniciarDetalles() {
    $$('[data-detalle]').forEach(function (boton) {
      var id = boton.getAttribute('data-detalle');
      var caja = $('[data-detalle-de="' + id + '"]');
      if (!caja) return;

      boton.setAttribute('aria-expanded', 'false');

      boton.addEventListener('click', function () {
        var abierto = caja.hidden;
        caja.hidden = !abierto;
        boton.setAttribute('aria-expanded', String(abierto));
        boton.textContent = abierto
          ? txt('cat.cerrar', 'Cerrar')
          : txt('cat.conoce', 'Conoce más');
      });
    });
  }


  /* ── Cupos reales del Ritual de Apertura ──────────────── */
  function iniciarCupos() {
    var total = Math.max(1, CFG.cuposTotales);
    var vendidos = Math.max(0, Math.min(CFG.cuposVendidos, total));
    var libres = total - vendidos;

    var numero = $('[data-cupos-libres]');
    if (numero) numero.textContent = libres;

    var barra = $('[data-cupos-barra]');
    if (barra) {
      // Se ve avanzar despacio, sin prisa fabricada
      setTimeout(function () {
        barra.style.width = ((vendidos / total) * 100) + '%';
      }, 700);
    }

    // Si se acabaron, lo decimos con honestidad
    if (libres === 0) {
      $$('[data-elegir="apertura"]').forEach(function (b) {
        b.classList.add('is-off');
        b.setAttribute('aria-disabled', 'true');
        b.textContent = txt('ap.agotado', 'Cupos agotados por ahora');
      });
    }
  }


  /* ── El motor de la reserva ───────────────────────────── */
  function iniciarReserva() {
    var selector = $('[data-sel-servicio]');
    if (!selector) return;

    var bloqueDur = $('[data-bloque-duracion]');
    var botonesDur = $$('[data-dur]');
    var botonesAdd = $$('[data-add]');
    var botonesPara = $$('[data-para]');
    var cajaRegalo = $('[data-regalo]');
    var campoNombre = $('[data-regalo-nombre]');
    var campoMensaje = $('[data-regalo-mensaje]');

    var rServicio = $('[data-r-servicio]');
    var rDuracion = $('[data-r-duracion]');
    var rExtras   = $('[data-r-extras]');
    var rPara     = $('[data-r-para]');
    var rTotal    = $('[data-r-total]');
    var filaExtras = $('[data-r-fila-extras]');
    var filaPara   = $('[data-r-fila-para]');

    var enlaceCal = $('[data-calendario]');
    var casilla   = $('[data-acepto]');
    var botonPago = $('[data-pagar]');
    var botonWsp  = $('[data-wsp-reserva]');

    /* Duraciones que existen en el calendario */
    var DURACIONES = [60, 70, 75, 90, 100, 105, 120];

    var estado = {
      duracion: 60,
      extraDur: 0,
      para: 'mi'
    };

    function opcionActual() {
      return selector.options[selector.selectedIndex] || null;
    }

    function esFijo() {
      var op = opcionActual();
      return !!(op && op.getAttribute('data-fijo') === '1');
    }

    function extrasElegidos() {
      return botonesAdd.filter(function (b) { return b.classList.contains('is-on'); });
    }

    /* La duración que pediremos al calendario: la más cercana
       hacia arriba entre las que existen de verdad. */
    function duracionCalendario(minutos) {
      for (var i = 0; i < DURACIONES.length; i++) {
        if (DURACIONES[i] >= minutos) return DURACIONES[i];
      }
      return DURACIONES[DURACIONES.length - 1];
    }

    function refrescar() {
      var op = opcionActual();
      var fijo = esFijo();

      // Los packs, suscripciones y el Ritual no eligen duración aquí
      if (bloqueDur) bloqueDur.hidden = fijo || !op || !op.value;

      var base = op ? Number(op.getAttribute('data-precio') || 0) : 0;
      var total = base;
      var minutos = 0;
      var nombres = [];

      if (!fijo && op && op.value) {
        total += estado.extraDur;
        minutos = estado.duracion;

        extrasElegidos().forEach(function (b) {
          total += Number(b.getAttribute('data-precio') || 0);
          minutos += Number(b.getAttribute('data-min') || 0);
          nombres.push(b.querySelector('span').textContent.trim());
        });
      }

      // Resumen
      if (rServicio) {
        rServicio.textContent = (op && op.value)
          ? op.textContent.trim()
          : '—';
      }

      if (rDuracion) {
        rDuracion.textContent = minutos
          ? minutos + ' ' + txt('re.minutos', 'minutos')
          : (fijo ? txt('re.porSesion', 'Se agenda sesión por sesión') : '—');
      }

      if (filaExtras) filaExtras.hidden = !nombres.length;
      if (rExtras) rExtras.textContent = nombres.length ? nombres.join(' · ') : '—';

      var nombreRegalo = campoNombre ? campoNombre.value.trim() : '';
      if (filaPara) filaPara.hidden = estado.para !== 'regalo';
      if (rPara) {
        rPara.textContent = nombreRegalo || txt('re.regaloSin', 'Regalo');
      }

      if (rTotal) rTotal.textContent = (op && op.value) ? pesos(total) : '—';

      // Calendario con la duración real
      if (enlaceCal) {
        var destino = CFG.enlaceCalendario;
        if (!fijo && minutos) {
          var d = duracionCalendario(minutos);
          if (CFG.calendarios && CFG.calendarios[d]) destino = CFG.calendarios[d];
        }
        enlaceCal.href = destino;
      }

      // Guardamos la elección para el mensaje de WhatsApp
      var resumen = {
        servicio: (op && op.value) ? op.textContent.trim() : '',
        minutos: minutos,
        extras: nombres,
        total: (op && op.value) ? pesos(total) : '',
        regalo: estado.para === 'regalo' ? nombreRegalo : '',
        mensaje: (estado.para === 'regalo' && campoMensaje) ? campoMensaje.value.trim() : ''
      };
      try { sessionStorage.setItem('mv_reserva', JSON.stringify(resumen)); } catch (e) {}

      pintarPago();
    }

    /* Pagar solo se habilita al aceptar las condiciones */
    function pintarPago() {
      var listo = !!(casilla && casilla.checked) && !!(opcionActual() && opcionActual().value);
      if (botonPago) {
        botonPago.classList.toggle('is-off', !listo);
        botonPago.setAttribute('aria-disabled', String(!listo));
        botonPago.href = listo ? CFG.enlacePago : '#';
      }
    }

    /* ── Escuchas ── */
    selector.addEventListener('change', function () {
      // Al cambiar de servicio, la duración vuelve a 60
      botonesDur.forEach(function (b) {
        b.classList.toggle('is-on', b.getAttribute('data-dur') === '60');
      });
      estado.duracion = 60;
      estado.extraDur = 0;
      refrescar();
    });

    botonesDur.forEach(function (boton) {
      boton.addEventListener('click', function () {
        botonesDur.forEach(function (b) { b.classList.remove('is-on'); });
        boton.classList.add('is-on');
        estado.duracion = Number(boton.getAttribute('data-dur'));
        estado.extraDur = Number(boton.getAttribute('data-extra') || 0);
        refrescar();
      });
    });

    botonesAdd.forEach(function (boton) {
      boton.addEventListener('click', function () {
        var grupo = boton.getAttribute('data-grupo');

        // +10 y +15 minutos son excluyentes entre sí
        if (grupo && !boton.classList.contains('is-on')) {
          botonesAdd.forEach(function (b) {
            if (b !== boton && b.getAttribute('data-grupo') === grupo) b.classList.remove('is-on');
          });
        }

        boton.classList.toggle('is-on');
        boton.setAttribute('aria-pressed', String(boton.classList.contains('is-on')));
        refrescar();
      });
    });

    botonesPara.forEach(function (boton) {
      boton.addEventListener('click', function () {
        botonesPara.forEach(function (b) { b.classList.remove('is-on'); });
        boton.classList.add('is-on');
        estado.para = boton.getAttribute('data-para');
        if (cajaRegalo) cajaRegalo.hidden = estado.para !== 'regalo';
        refrescar();
      });
    });

    if (campoNombre) campoNombre.addEventListener('input', refrescar);
    if (campoMensaje) campoMensaje.addEventListener('input', refrescar);
    if (casilla) casilla.addEventListener('change', pintarPago);

    /* WhatsApp con el detalle de lo que armó la persona */
    if (botonWsp) {
      botonWsp.addEventListener('click', function () {
        var r = null;
        try { r = JSON.parse(sessionStorage.getItem('mv_reserva') || 'null'); } catch (e) {}

        var lineas = ['Hola Alejandro, quiero reservar en Manos Vivas.'];
        if (r && r.servicio) {
          lineas.push('Servicio: ' + r.servicio);
          if (r.minutos) lineas.push('Duración: ' + r.minutos + ' minutos');
          if (r.extras && r.extras.length) lineas.push('Complementos: ' + r.extras.join(', '));
          if (r.regalo) lineas.push('Es un regalo para: ' + r.regalo);
          if (r.mensaje) lineas.push('Mensaje: ' + r.mensaje);
          if (r.total) lineas.push('Total: ' + r.total);
        }

        botonWsp.href = 'https://wa.me/' + CFG.whatsapp +
                        '?text=' + encodeURIComponent(lineas.join('\n'));
      });
    }

    /* Los botones "Reservar" repartidos por toda la página */
    $$('[data-elegir]').forEach(function (boton) {
      boton.addEventListener('click', function () {
        if (boton.getAttribute('aria-disabled') === 'true') return;

        var valor = boton.getAttribute('data-elegir');
        var min = boton.getAttribute('data-min');

        var existe = Array.prototype.some.call(selector.options, function (o) {
          return o.value === valor;
        });
        if (existe) selector.value = valor;

        if (min) {
          botonesDur.forEach(function (b) {
            var suyo = b.getAttribute('data-dur') === String(min);
            b.classList.toggle('is-on', suyo);
            if (suyo) {
              estado.duracion = Number(min);
              estado.extraDur = Number(b.getAttribute('data-extra') || 0);
            }
          });
        }

        refrescar();

        var destino = $('#reservar');
        if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    refrescar();
  }


  /* ── Enlaces que salen de la configuración ────────────── */
  function iniciarEnlaces() {
    $$('[data-review]').forEach(function (a) {
      a.href = CFG.enlaceResenas; a.target = '_blank'; a.rel = 'noopener';
    });
    $$('[data-instagram]').forEach(function (a) { a.href = CFG.instagram; });
    $$('[data-facebook]').forEach(function (a) { a.href = CFG.facebook; });
    $$('[data-wsp-flotante]').forEach(function (a) {
      a.href = 'https://wa.me/' + CFG.whatsapp;
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

      // Etiquetas para lectores de pantalla y grupos de opciones
      $$('[data-t-label]').forEach(function (el) {
        var clave = el.getAttribute('data-t-label');
        if (!d[clave]) return;
        if (el.tagName === 'OPTGROUP') el.setAttribute('label', d[clave]);
        else el.setAttribute('aria-label', d[clave]);
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
    aplicar(DICC[guardado] ? guardado : 'es');
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
      if (meta) meta.setAttribute('content', modo === 'noche' ? '#15180f' : '#f7f2ea');

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
      boton.setAttribute('aria-label', sonando
        ? txt('a11y.sonidoOff', 'Apagar el sonido ambiental')
        : txt('a11y.sonido', 'Encender el sonido ambiental'));
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
    safe(iniciarDetalles,    'detalles');
    safe(iniciarCupos,       'cupos');
    safe(iniciarReserva,     'reserva');
    safe(iniciarEnlaces,     'enlaces');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }

})();
