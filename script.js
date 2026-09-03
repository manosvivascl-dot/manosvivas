/* ═══════════════════════════════════════════════════════════
   MANOS VIVAS

   ⬇⬇⬇  LO ÚNICO QUE NECESITAS EDITAR TÚ  ⬇⬇⬇
   ═══════════════════════════════════════════════════════════ */

window.MV = {

  // Tu WhatsApp, sin el signo + ni espacios.
  whatsapp: '56995742775',

  // Tus redes (la dirección completa).
  instagram: 'https://instagram.com/manosvivas',
  facebook:  'https://facebook.com/manosvivas',

  // ── LINKS DE PAGO DE MERCADO PAGO ────────────────────────
  // Crea un link por cada monto en Mercado Pago (Cobrar → Link de
  // pago) y pega aquí la dirección que te da, entre las comillas.
  //
  // Mientras un link esté vacío, ese botón simplemente no aparece:
  // la web nunca finge un cobro que no existe.
  pagos: {
    s60:      '',   // Sesión de 60 minutos · $55.000
    s90:      '',   // Sesión de 90 minutos · $73.000
    apertura: '',   // Ritual de Apertura · $89.990
    pack4:    '',   // Pack Chico · $195.000
    pack6:    '',   // Pack Mediano · $295.000
    pack8:    '',   // Pack Grande · $395.000
    sub1:     '',   // Suscripción Esencial · $55.000 al mes
    sub2:     '',   // Suscripción Bienestar · $105.000 al mes
    sub4:     '',   // Suscripción Vital · $205.000 al mes
    sub8:     ''    // Suscripción Premium · $380.000 al mes
  },

  // Cuando tengas Calendly funcionando, pon aquí su enlace.
  enlaceCalendario: ''
};

/* ═══════════════════════════════════════════════════════════
   ⬆⬆⬆  DE AQUÍ HACIA ABAJO NO HACE FALTA TOCAR NADA  ⬆⬆⬆
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var CFG = window.MV;

  function seguro(fn, nombre) {
    try { fn(); } catch (e) { console.warn('[' + nombre + ']', e); }
  }

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function pesos(n) { return '$' + Number(n).toLocaleString('es-CL'); }

  /* Un texto del diccionario, con respaldo si aún no cargó */
  function txt(clave, respaldo) {
    var D = window.IDIOMAS;
    var d = D && (D[document.documentElement.lang] || D.es);
    return (d && d[clave]) ? d[clave] : respaldo;
  }

  /* ── Catálogo: precios y textos en un solo lugar ─────── */

  var BASE_60 = 55000;
  var EXTRA_90 = 18000;

  var MASAJES = ['relajante', 'mixto', 'personalizado', 'descontracturante',
                 'profundo', 'deportivo', 'drenaje', 'mama'];

  var FIJOS = {
    apertura: { precio: 89990, clave: 'op.apertura' },
    pack4:    { precio: 195000, clave: 'op.pack4' },
    pack6:    { precio: 295000, clave: 'op.pack6' },
    pack8:    { precio: 395000, clave: 'op.pack8' },
    sub1:     { precio: 55000,  clave: 'op.sub1' },
    sub2:     { precio: 105000, clave: 'op.sub2' },
    sub4:     { precio: 205000, clave: 'op.sub4' },
    sub8:     { precio: 380000, clave: 'op.sub8' }
  };


  /* ── La apertura ──────────────────────────────────────── */
  function iniciarIntro() {
    var capa = $('[data-intro]');
    if (!capa) return;

    var quieto = window.matchMedia &&
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.body.classList.add('sin-scroll');

    var irse = function () {
      capa.classList.add('se-fue');
      document.body.classList.remove('sin-scroll');
      setTimeout(function () {
        if (capa.parentNode) capa.parentNode.removeChild(capa);
      }, 1100);
    };

    setTimeout(irse, quieto ? 500 : 3900);
    setTimeout(irse, 5400);                    // red de seguridad
    capa.addEventListener('click', irse);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') irse();
    });
  }


  /* ── Barra y menú ─────────────────────────────────────── */
  function iniciarNav() {
    var nav = $('[data-nav]');
    if (nav) {
      var pintar = function () { nav.classList.toggle('pegada', window.scrollY > 24); };
      window.addEventListener('scroll', pintar, { passive: true });
      pintar();
    }

    var boton = $('[data-burger]');
    var menu = $('[data-menu]');
    if (!boton || !menu) return;

    var cerrar = function () {
      menu.classList.remove('abierto');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', txt('a11y.menu', 'Abrir menú'));
      document.body.classList.remove('sin-scroll');
    };

    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto
        ? txt('a11y.menuCerrar', 'Cerrar menú')
        : txt('a11y.menu', 'Abrir menú'));
      document.body.classList.toggle('sin-scroll', abierto);
    });

    $$('a, button', menu).forEach(function (el) {
      el.addEventListener('click', cerrar);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrar();
    });
  }


  /* ── Aparición al desplazar ───────────────────────────── */
  function iniciarApariciones() {
    var piezas = $$('.sube');
    if (!piezas.length) return;

    var todo = function () { piezas.forEach(function (p) { p.classList.add('visible'); }); };
    if (!('IntersectionObserver' in window)) { todo(); return; }

    var obs = new IntersectionObserver(function (lista) {
      lista.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    piezas.forEach(function (p) { obs.observe(p); });
    setTimeout(todo, 6000);      // por si algo impide que se disparen
  }


  /* ── ¿Cómo quieres sentirte hoy? ──────────────────────── */
  function iniciarAnimo() {
    var botones = $$('[data-animo]');
    var tarjetas = $$('.masaje');
    var nota = $('[data-animo-nota]');
    if (!botones.length) return;

    function aplicar(grupo) {
      botones.forEach(function (b) {
        var suyo = b.getAttribute('data-animo') === grupo;
        b.classList.toggle('is-on', suyo);
        b.setAttribute('aria-selected', String(suyo));
      });

      tarjetas.forEach(function (t) {
        var suyos = (t.getAttribute('data-grupos') || '').split(' ');
        var entra = suyos.indexOf(grupo) !== -1;
        t.hidden = !entra;
        if (entra) {              // reinicia la animación de entrada
          t.style.animation = 'none';
          void t.offsetWidth;
          t.style.animation = '';
        }
      });

      if (nota) {
        nota.setAttribute('data-t', 'an.nota.' + grupo);
        nota.textContent = txt('an.nota.' + grupo, nota.textContent);
      }
    }

    botones.forEach(function (b) {
      b.addEventListener('click', function () { aplicar(b.getAttribute('data-animo')); });
    });

    aplicar('calma');
  }


  /* ── Detalle del masaje ───────────────────────────────── */
  function iniciarDetalle() {
    var hoja = $('[data-hoja]');
    if (!hoja) return;

    var nombre = $('[data-hoja-nombre]', hoja);
    var texto = $('[data-hoja-texto]', hoja);
    var elegir = $('[data-hoja-elegir]', hoja);
    var abierto = null;

    function cerrar() {
      hoja.hidden = true;
      document.body.classList.remove('sin-scroll');
      if (abierto) { abierto.focus(); abierto = null; }
    }

    function abrir(clave, origen) {
      abierto = origen || null;
      hoja.setAttribute('data-actual', clave);
      if (nombre) nombre.textContent = txt('m.' + clave + '.n', clave);
      if (texto) texto.textContent = txt('m.' + clave + '.d', '');
      hoja.hidden = false;
      document.body.classList.add('sin-scroll');
      var c = $('.cerrar', hoja);
      if (c) c.focus();
    }

    $$('[data-detalle]').forEach(function (b) {
      b.addEventListener('click', function () {
        abrir(b.getAttribute('data-detalle'), b);   // solo uno abierto a la vez
      });
    });

    $$('[data-cerrar-hoja]', hoja).forEach(function (b) {
      b.addEventListener('click', cerrar);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !hoja.hidden) cerrar();
    });

    if (elegir) {
      elegir.addEventListener('click', function () {
        var clave = hoja.getAttribute('data-actual');
        cerrar();
        window.MV_reservar(clave, 60);
      });
    }
  }


  /* ── Pestañas de packs y suscripciones ────────────────── */
  function iniciarPestanas() {
    var botones = $$('[data-tab]');
    if (!botones.length) return;

    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        var cual = b.getAttribute('data-tab');
        botones.forEach(function (o) {
          var suyo = o === b;
          o.classList.toggle('is-on', suyo);
          o.setAttribute('aria-selected', String(suyo));
        });
        $$('[data-panel]').forEach(function (p) {
          p.hidden = p.getAttribute('data-panel') !== cual;
        });
      });
    });
  }


  /* ── Textos legales ───────────────────────────────────── */
  function iniciarLegales() {
    var hoja = $('[data-legales]');
    if (!hoja) return;

    var titulo = $('[data-legal-titulo]', hoja);
    var texto = $('[data-legal-texto]', hoja);

    function cerrar() {
      hoja.hidden = true;
      document.body.classList.remove('sin-scroll');
    }

    $$('[data-legal]').forEach(function (b) {
      b.addEventListener('click', function () {
        var cual = b.getAttribute('data-legal');
        if (titulo) titulo.textContent = txt('le.' + cual + '.t', '');
        if (texto) texto.textContent = txt('le.' + cual + '.p', '');
        hoja.hidden = false;
        document.body.classList.add('sin-scroll');
        var c = $('.cerrar', hoja);
        if (c) c.focus();
      });
    });

    $$('[data-cerrar-legal]', hoja).forEach(function (b) {
      b.addEventListener('click', cerrar);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !hoja.hidden) cerrar();
    });
  }


  /* ── El flujo de reserva ──────────────────────────────── */
  function iniciarReserva() {
    var caja = $('[data-reserva]');
    if (!caja) return;

    var TOTAL_ETAPAS = 5;

    var etapas = $$('[data-etapa]', caja);
    var listaServicios = $('[data-servicios]', caja);
    var botonesDur = $$('[data-dur]', caja);
    var botonesExtra = $$('[data-extra]', caja);
    var botonesPara = $$('[data-para]', caja);
    var botonesRegalo = $$('[data-regalo-modo]', caja);
    var cajaRegalo = $('[data-regalo]', caja);

    var campoFecha = $('[data-fecha]', caja);
    var campoFranja = $('[data-franja]', caja);
    var campoNombre = $('[data-regalo-nombre]', caja);
    var campoMensaje = $('[data-regalo-mensaje]', caja);
    var campoComuna = $('[data-comuna]', caja);
    var campoContacto = $('[data-contacto]', caja);

    var barra = $('[data-progreso]', caja);
    var btnAtras = $('[data-atras]', caja);
    var btnSiguiente = $('[data-siguiente]', caja);
    var btnEnviar = $('[data-enviar]', caja);
    var btnPagar = $('[data-pagar]', caja);
    var acepta = $('[data-acepta]', caja);

    /* El estado vive aquí y se guarda, para no perderlo al
       cerrar, volver atrás o cambiar de idioma. */
    var E = {
      servicio: '',
      duracion: 60,
      extras: [],
      para: 'mi',
      regaloModo: 'agendar',
      etapa: 1
    };

    function guardar() {
      var d = {
        e: E,
        f: campoFecha ? campoFecha.value : '',
        fr: campoFranja ? campoFranja.value : '',
        n: campoNombre ? campoNombre.value : '',
        m: campoMensaje ? campoMensaje.value : '',
        c: campoComuna ? campoComuna.value : '',
        t: campoContacto ? campoContacto.value : ''
      };
      try { sessionStorage.setItem('mv_reserva', JSON.stringify(d)); } catch (err) {}
    }

    function recuperar() {
      var d = null;
      try { d = JSON.parse(sessionStorage.getItem('mv_reserva') || 'null'); } catch (err) {}
      if (!d || !d.e) return;

      E.servicio = d.e.servicio || '';
      E.duracion = d.e.duracion || 60;
      E.extras = d.e.extras || [];
      E.para = d.e.para || 'mi';
      E.regaloModo = d.e.regaloModo || 'agendar';

      if (campoFecha) campoFecha.value = d.f || '';
      if (campoFranja && d.fr) campoFranja.value = d.fr;
      if (campoNombre) campoNombre.value = d.n || '';
      if (campoMensaje) campoMensaje.value = d.m || '';
      if (campoComuna) campoComuna.value = d.c || '';
      if (campoContacto) campoContacto.value = d.t || '';
    }

    /* Los servicios se arman desde el catálogo, así el
       idioma y los precios salen siempre del mismo sitio. */
    function pintarServicios() {
      if (!listaServicios) return;
      listaServicios.innerHTML = '';

      MASAJES.concat(Object.keys(FIJOS)).forEach(function (clave) {
        var fijo = FIJOS[clave];
        var b = document.createElement('button');
        b.className = 'opcion opcion--fila';
        b.setAttribute('data-servicio', clave);

        var izq = document.createElement('span');
        izq.textContent = fijo ? txt(fijo.clave, clave) : txt('m.' + clave + '.n', clave);

        var der = document.createElement('strong');
        der.textContent = fijo ? pesos(fijo.precio) : txt('op.desde', 'Desde') + ' ' + pesos(BASE_60);

        b.appendChild(izq);
        b.appendChild(der);
        b.addEventListener('click', function () {
          E.servicio = clave;
          pintarServicios();
          calcular();
        });

        if (E.servicio === clave) b.classList.add('is-on');
        listaServicios.appendChild(b);
      });
    }

    function esFijo() { return !!FIJOS[E.servicio]; }

    function nombreServicio() {
      if (!E.servicio) return '—';
      var fijo = FIJOS[E.servicio];
      return fijo ? txt(fijo.clave, E.servicio) : txt('m.' + E.servicio + '.n', E.servicio);
    }

    function datosExtras() {
      var min = 0, precio = 0, nombres = [];
      E.extras.forEach(function (clave) {
        var b = $('[data-extra="' + clave + '"]', caja);
        if (!b) return;
        min += Number(b.getAttribute('data-min') || 0);
        precio += Number(b.getAttribute('data-precio') || 0);
        nombres.push(b.querySelector('span').textContent.trim());
      });
      return { min: min, precio: precio, nombres: nombres };
    }

    function calcular() {
      var fijo = FIJOS[E.servicio];
      var ex = datosExtras();
      var total = 0, minutos = 0;

      if (fijo) {
        total = fijo.precio;
      } else if (E.servicio) {
        total = BASE_60 + (E.duracion === 90 ? EXTRA_90 : 0) + ex.precio;
        minutos = E.duracion + ex.min;
      }

      pintarDuraciones();
      pintarExtras();
      pintarResumen(total, minutos, ex);
      pintarPie(total, minutos);
      pintarEnviar();
      guardar();
    }

    function pintarDuraciones() {
      botonesDur.forEach(function (b) {
        b.classList.toggle('is-on', Number(b.getAttribute('data-dur')) === E.duracion);
      });
    }

    function pintarExtras() {
      botonesExtra.forEach(function (b) {
        var suyo = E.extras.indexOf(b.getAttribute('data-extra')) !== -1;
        b.classList.toggle('is-on', suyo);
        b.setAttribute('aria-pressed', String(suyo));
      });
    }

    function textoCuando() {
      if (!campoFecha || !campoFecha.value) return '';
      var partes = campoFecha.value.split('-');
      var dia = partes[2] + '/' + partes[1] + '/' + partes[0];
      var franja = campoFranja
        ? campoFranja.options[campoFranja.selectedIndex].textContent.trim()
        : '';
      return dia + (franja ? ' · ' + franja : '');
    }

    function textoPara() {
      if (E.para !== 'regalo') return '';
      var quien = campoNombre ? campoNombre.value.trim() : '';
      var modo = E.regaloModo === 'tarjeta'
        ? txt('re.regaloTarjeta', 'Tarjeta de regalo')
        : txt('re.regaloAgendar', 'Agendo yo la hora');
      return (quien || txt('re.regaloSin', 'Regalo')) + ' · ' + modo;
    }

    function pintarResumen(total, minutos, ex) {
      var puesto = function (sel, valor) {
        var el = $(sel, caja);
        if (el) el.textContent = valor;
      };
      var fila = function (sel, mostrar) {
        var el = $(sel, caja);
        if (el) el.hidden = !mostrar;
      };

      puesto('[data-r-servicio]', nombreServicio());

      var filaDur = $('[data-r-fila-dur]', caja);
      if (filaDur) filaDur.hidden = !minutos;
      puesto('[data-r-duracion]', minutos ? minutos + ' ' + txt('re.minutos', 'minutos') : '—');

      fila('[data-r-fila-extras]', ex.nombres.length > 0);
      puesto('[data-r-extras]', ex.nombres.join(' · ') || '—');

      var cuando = textoCuando();
      fila('[data-r-fila-cuando]', !!cuando);
      puesto('[data-r-cuando]', cuando || '—');

      var para = textoPara();
      fila('[data-r-fila-para]', !!para);
      puesto('[data-r-para]', para || '—');

      puesto('[data-r-total]', E.servicio ? pesos(total) : '—');
    }

    function pintarPie(total, minutos) {
      var mDur = $('[data-r-mini-dur]', caja);
      var mTot = $('[data-r-mini-total]', caja);

      if (mDur) {
        mDur.textContent = minutos
          ? minutos + ' ' + txt('re.minutos', 'minutos')
          : (esFijo() ? txt('re.varias', 'Varias sesiones') : txt('re.sinElegir', 'Sin elegir'));
      }
      if (mTot) mTot.textContent = E.servicio ? pesos(total) : '—';
    }

    /* ── Navegación entre etapas ── */
    function saltaDuracion() { return esFijo(); }

    /* Los packs, suscripciones y el Ritual no eligen duración:
       la etapa 2 se salta en los dos sentidos. */
    function etapaValida(n, sentido) {
      if (n === 2 && saltaDuracion()) return sentido < 0 ? 1 : 3;
      return n;
    }

    function irA(n) {
      E.etapa = Math.max(1, Math.min(TOTAL_ETAPAS, n));

      etapas.forEach(function (s) {
        s.classList.toggle('is-on', Number(s.getAttribute('data-etapa')) === E.etapa);
      });

      if (barra) barra.style.width = (E.etapa / TOTAL_ETAPAS * 100) + '%';
      if (btnAtras) btnAtras.hidden = E.etapa === 1;
      if (btnSiguiente) btnSiguiente.hidden = E.etapa === TOTAL_ETAPAS;

      var cuerpo = $('.reserva__cuerpo', caja);
      if (cuerpo) cuerpo.scrollTop = 0;

      pintarSiguiente();
      guardar();
    }

    function pintarSiguiente() {
      if (!btnSiguiente) return;
      var puede = E.etapa !== 1 || !!E.servicio;
      btnSiguiente.classList.toggle('esta-off', !puede);
      btnSiguiente.setAttribute('aria-disabled', String(!puede));
      btnSiguiente.textContent = E.etapa === 4
        ? txt('re.revisar', 'Revisar')
        : txt('re.continuar', 'Continuar');
    }

    function pintarEnviar() {
      var listo = !!E.servicio && !!(acepta && acepta.checked);

      if (btnEnviar) {
        btnEnviar.classList.toggle('esta-off', !listo);
        btnEnviar.setAttribute('aria-disabled', String(!listo));
      }

      /* El botón de pago aparece solo si existe un link real
         para lo que la persona eligió, y solo tras aceptar. */
      if (btnPagar) {
        var link = linkDePago();
        var muestro = listo && !!link;
        btnPagar.hidden = !muestro;
        if (muestro) btnPagar.href = link;
      }
    }

    /* Qué link corresponde a lo elegido */
    function linkDePago() {
      var P = CFG.pagos || {};
      if (!E.servicio) return '';
      if (FIJOS[E.servicio]) return P[E.servicio] || '';
      // Una sesión suelta: depende de la duración, y solo sin complementos
      if (datosExtras().precio > 0) return '';
      return (E.duracion === 90 ? P.s90 : P.s60) || '';
    }

    /* ── Abrir y cerrar ── */
    function abrir(servicio, minutos) {
      if (servicio) E.servicio = servicio;
      if (minutos) E.duracion = Number(minutos);

      caja.hidden = false;
      document.body.classList.add('sin-scroll', 'reservando');

      pintarServicios();
      calcular();
      // Con el servicio ya elegido, entramos directo al paso siguiente
      irA(servicio ? (saltaDuracion() ? 3 : 2) : 1);

      var c = $('[data-cerrar-reserva]', caja);
      if (c) c.focus();
    }

    function cerrar() {
      caja.hidden = true;
      document.body.classList.remove('sin-scroll', 'reservando');
      guardar();                 // no se pierde nada al cerrar
    }

    window.MV_reservar = abrir;

    /* ── Escuchas ── */
    $$('[data-abrir-reserva]').forEach(function (b) {
      b.addEventListener('click', function () { abrir(); });
    });

    $$('[data-elegir]').forEach(function (b) {
      b.addEventListener('click', function () {
        abrir(b.getAttribute('data-elegir'), b.getAttribute('data-min'));
      });
    });

    $$('[data-cerrar-reserva]', caja).forEach(function (b) {
      b.addEventListener('click', cerrar);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !caja.hidden) cerrar();
    });

    botonesDur.forEach(function (b) {
      b.addEventListener('click', function () {
        E.duracion = Number(b.getAttribute('data-dur'));
        calcular();
      });
    });

    botonesExtra.forEach(function (b) {
      b.addEventListener('click', function () {
        var clave = b.getAttribute('data-extra');
        var grupo = b.getAttribute('data-grupo');
        var i = E.extras.indexOf(clave);

        if (i === -1) {
          // +10 y +15 minutos son excluyentes entre sí
          if (grupo) {
            E.extras = E.extras.filter(function (otra) {
              var o = $('[data-extra="' + otra + '"]', caja);
              return !o || o.getAttribute('data-grupo') !== grupo;
            });
          }
          E.extras.push(clave);
        } else {
          E.extras.splice(i, 1);
        }
        calcular();
      });
    });

    botonesPara.forEach(function (b) {
      b.addEventListener('click', function () {
        E.para = b.getAttribute('data-para');
        botonesPara.forEach(function (o) {
          o.classList.toggle('is-on', o === b);
        });
        if (cajaRegalo) cajaRegalo.hidden = E.para !== 'regalo';
        calcular();
      });
    });

    botonesRegalo.forEach(function (b) {
      b.addEventListener('click', function () {
        E.regaloModo = b.getAttribute('data-regalo-modo');
        botonesRegalo.forEach(function (o) {
          o.classList.toggle('is-on', o === b);
        });
        calcular();
      });
    });

    [campoFecha, campoFranja, campoNombre, campoMensaje, campoComuna, campoContacto]
      .forEach(function (c) {
        if (c) c.addEventListener('input', calcular);
        if (c && c.tagName === 'SELECT') c.addEventListener('change', calcular);
      });

    if (acepta) acepta.addEventListener('change', pintarEnviar);

    if (btnSiguiente) {
      btnSiguiente.addEventListener('click', function () {
        if (btnSiguiente.getAttribute('aria-disabled') === 'true') return;
        irA(etapaValida(E.etapa + 1, 1));
      });
    }
    if (btnAtras) {
      btnAtras.addEventListener('click', function () { irA(etapaValida(E.etapa - 1, -1)); });
    }

    /* El envío: una solicitud honesta por WhatsApp */
    if (btnEnviar) {
      btnEnviar.addEventListener('click', function () {
        if (btnEnviar.getAttribute('aria-disabled') === 'true') return;

        btnEnviar.classList.add('esta-cargando');

        var ex = datosExtras();
        var fijo = FIJOS[E.servicio];
        var total = fijo
          ? fijo.precio
          : BASE_60 + (E.duracion === 90 ? EXTRA_90 : 0) + ex.precio;
        var minutos = fijo ? 0 : E.duracion + ex.min;

        var l = [txt('wsp.saludo', 'Hola, quiero reservar en Manos Vivas.'), ''];
        l.push(txt('re.rServicio', 'Servicio') + ': ' + nombreServicio());
        if (minutos) l.push(txt('re.rDuracion', 'Duración total') + ': ' + minutos + ' min');
        if (ex.nombres.length) l.push(txt('re.rExtras', 'Complementos') + ': ' + ex.nombres.join(', '));

        var cuando = textoCuando();
        if (cuando) l.push(txt('re.rCuando', 'Preferencia') + ': ' + cuando);

        var para = textoPara();
        if (para) l.push(txt('re.rPara', 'Para') + ': ' + para);
        if (E.para === 'regalo' && campoMensaje && campoMensaje.value.trim()) {
          l.push(txt('re.regaloMensaje', 'Mensaje') + ': ' + campoMensaje.value.trim());
        }
        if (campoComuna && campoComuna.value.trim()) {
          l.push(txt('re.comuna', 'Comuna') + ': ' + campoComuna.value.trim());
        }
        if (campoContacto && campoContacto.value.trim()) {
          l.push(txt('re.contacto', 'Contacto') + ': ' + campoContacto.value.trim());
        }
        l.push(txt('re.rTotal', 'Total') + ': ' + pesos(total));

        var url = 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(l.join('\n'));
        window.open(url, '_blank', 'noopener');

        setTimeout(function () { btnEnviar.classList.remove('esta-cargando'); }, 900);
      });
    }

    /* ── Arranque del flujo ── */
    recuperar();
    pintarServicios();
    if (cajaRegalo) cajaRegalo.hidden = E.para !== 'regalo';
    botonesPara.forEach(function (o) {
      o.classList.toggle('is-on', o.getAttribute('data-para') === E.para);
    });
    botonesRegalo.forEach(function (o) {
      o.classList.toggle('is-on', o.getAttribute('data-regalo-modo') === E.regaloModo);
    });
    calcular();
    pintarEnviar();

    // La fecha nunca puede ser de ayer
    if (campoFecha) {
      var hoy = new Date();
      campoFecha.min = hoy.getFullYear() + '-' +
        String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
        String(hoy.getDate()).padStart(2, '0');
    }

    // Cuando cambia el idioma, se repinta sin perder lo elegido
    document.addEventListener('mv:idioma', function () {
      pintarServicios();
      calcular();
      pintarSiguiente();
    });
  }


  /* ── Enlaces de la configuración ──────────────────────── */
  function iniciarEnlaces() {
    $$('[data-instagram]').forEach(function (a) { a.href = CFG.instagram; });
    $$('[data-facebook]').forEach(function (a) { a.href = CFG.facebook; });
    $$('[data-wsp]').forEach(function (a) {
      a.href = 'https://wa.me/' + CFG.whatsapp;
    });
  }


  /* ── Idiomas ──────────────────────────────────────────── */
  function iniciarIdiomas() {
    var D = window.IDIOMAS;
    if (!D) return;

    var botones = $$('[data-lang]');

    function aplicar(idioma) {
      var d = D[idioma];
      if (!d) return;

      $$('[data-t]').forEach(function (el) {
        var clave = el.getAttribute('data-t');
        if (d[clave] != null) el.innerHTML = d[clave];
      });

      $$('[data-t-label]').forEach(function (el) {
        var clave = el.getAttribute('data-t-label');
        if (d[clave]) el.setAttribute('aria-label', d[clave]);
      });

      if (d['doc.titulo']) document.title = d['doc.titulo'];
      var meta = $('meta[name="description"]');
      if (meta && d['doc.desc']) meta.setAttribute('content', d['doc.desc']);

      document.documentElement.setAttribute('lang', idioma);

      botones.forEach(function (b) {
        var suyo = b.getAttribute('data-lang') === idioma;
        b.classList.toggle('is-on', suyo);
        b.setAttribute('aria-pressed', String(suyo));
      });

      try { localStorage.setItem('mv_idioma', idioma); } catch (e) {}

      // Que el resto de la web se entere y se repinte
      document.dispatchEvent(new CustomEvent('mv:idioma', { detail: idioma }));
    }

    botones.forEach(function (b) {
      b.addEventListener('click', function () { aplicar(b.getAttribute('data-lang')); });
    });

    var guardado = null;
    try { guardado = localStorage.getItem('mv_idioma'); } catch (e) {}
    if (!guardado) {
      var nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
      guardado = D[nav] ? nav : 'es';
    }
    aplicar(D[guardado] ? guardado : 'es');
  }


  /* ── Arranque ─────────────────────────────────────────── */
  function arrancar() {
    seguro(iniciarIdiomas,     'idiomas');
    seguro(iniciarIntro,       'intro');
    seguro(iniciarNav,         'nav');
    seguro(iniciarApariciones, 'apariciones');
    seguro(iniciarAnimo,       'animo');
    seguro(iniciarDetalle,     'detalle');
    seguro(iniciarPestanas,    'pestanas');
    seguro(iniciarLegales,     'legales');
    seguro(iniciarReserva,     'reserva');
    seguro(iniciarEnlaces,     'enlaces');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }

})();
