/* ═══════════════════════════════════════════════════════════
   MANOS VIVAS · fondo sensorial

   Un campo de fibras que reacciona a tus dedos como el aceite
   sobre la piel: se apartan cuando pasas, se tensan cuando
   presionas, y vuelven despacio a su lugar.

   No hace falta editar nada de este archivo.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var lienzo = document.querySelector('[data-fondo]');
  if (!lienzo || !lienzo.getContext) return;

  var ctx = lienzo.getContext('2d');
  if (!ctx) return;

  var quieto = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Estado ─────────────────────────────────────────── */
  var W = 0, H = 0, dpr = 1;
  var fibras = [];
  var ondas = [];
  var puntero = { x: -9999, y: -9999, px: -9999, py: -9999, activo: false, fuerza: 0 };
  var t = 0;
  var animando = false;
  var rafId = null;

  /* Separación entre fibras: más juntas en pantallas grandes */
  function paso() {
    var ancho = window.innerWidth;
    if (ancho < 560) return 46;
    if (ancho < 1000) return 42;
    return 38;
  }

  /* ── Colores según el modo día o noche ──────────────── */
  function tinta() {
    var noche = document.documentElement.getAttribute('data-modo') === 'noche';
    return noche
      ? { fibra: 'rgba(212,165,116,', base: 0.15, brillo: 'rgba(226,190,145,' }
      : { fibra: 'rgba(120,104,80,',  base: 0.13, brillo: 'rgba(181,101,29,' };
  }

  /* ── Construcción del campo ─────────────────────────── */
  function medir() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;

    lienzo.width = Math.floor(W * dpr);
    lienzo.height = Math.floor(H * dpr);
    lienzo.style.width = W + 'px';
    lienzo.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    sembrar();
  }

  function sembrar() {
    fibras = [];
    var d = paso();

    for (var y = -d; y < H + d; y += d) {
      for (var x = -d; x < W + d; x += d) {
        // Un poco de desorden para que no se vea una cuadrícula
        var jx = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
        var jy = (Math.sin(x * 39.3468 + y * 11.135) * 24634.6345) % 1;

        fibras.push({
          x: x + jx * d * 0.5,
          y: y + jy * d * 0.5,
          dx: 0, dy: 0,       // desplazamiento actual
          largo: d * 0.42 + Math.abs(jx) * d * 0.22,
          tension: 0
        });
      }
    }
  }

  /* ── Onda al presionar ──────────────────────────────── */
  function nacerOnda(x, y) {
    if (ondas.length > 5) ondas.shift();
    ondas.push({ x: x, y: y, r: 0, vida: 1 });
  }

  /* ── Dibujo ─────────────────────────────────────────── */
  function pintar() {
    ctx.clearRect(0, 0, W, H);

    var c = tinta();
    var radio = 190;              // alcance de los dedos
    var radio2 = radio * radio;

    // La fuerza sube cuando presionas y baja sola
    puntero.fuerza += ((puntero.activo ? 1 : 0) - puntero.fuerza) * 0.09;

    ctx.lineCap = 'round';

    for (var i = 0; i < fibras.length; i++) {
      var f = fibras[i];

      /* Corriente de fondo: la respiración del campo */
      var ang = Math.sin(f.x * 0.0055 + t * 0.00042) * 1.15 +
                Math.cos(f.y * 0.0068 - t * 0.00031) * 1.15;

      /* Empuje de los dedos */
      var ex = f.x - puntero.x;
      var ey = f.y - puntero.y;
      var d2 = ex * ex + ey * ey;

      var objetivoTension = 0;

      if (d2 < radio2 && puntero.x > -9000) {
        var d = Math.sqrt(d2) || 1;
        var cerca = 1 - d / radio;           // 1 en el centro, 0 en el borde
        var empuje = cerca * cerca * (16 + puntero.fuerza * 26);

        f.dx += (ex / d) * empuje * 0.05;
        f.dy += (ey / d) * empuje * 0.05;

        // Las fibras se peinan siguiendo la dirección del movimiento
        var vx = puntero.x - puntero.px;
        var vy = puntero.y - puntero.py;
        var vel = Math.min(Math.sqrt(vx * vx + vy * vy), 60);

        if (vel > 0.6) {
          ang = Math.atan2(vy, vx) * cerca + ang * (1 - cerca);
        }

        objetivoTension = cerca;
      }

      /* Ondas que se expanden desde donde presionaste */
      for (var o = 0; o < ondas.length; o++) {
        var on = ondas[o];
        var odx = f.x - on.x;
        var ody = f.y - on.y;
        var od = Math.sqrt(odx * odx + ody * ody) || 1;
        var borde = Math.abs(od - on.r);

        if (borde < 60) {
          var pulso = (1 - borde / 60) * on.vida;
          f.dx += (odx / od) * pulso * 5.5;
          f.dy += (ody / od) * pulso * 5.5;
          objetivoTension = Math.max(objetivoTension, pulso * 0.75);
        }
      }

      /* Vuelta lenta a su sitio: el músculo relajándose */
      f.dx *= 0.90;
      f.dy *= 0.90;
      f.tension += (objetivoTension - f.tension) * 0.14;

      /* Trazo */
      var largo = f.largo * (1 + f.tension * 0.75);
      var cx = f.x + f.dx;
      var cy = f.y + f.dy;
      var hx = Math.cos(ang) * largo * 0.5;
      var hy = Math.sin(ang) * largo * 0.5;

      var alfa = c.base + f.tension * 0.42;
      ctx.strokeStyle = (f.tension > 0.12 ? c.brillo : c.fibra) + alfa.toFixed(3) + ')';
      ctx.lineWidth = 1 + f.tension * 1.7;

      ctx.beginPath();
      ctx.moveTo(cx - hx, cy - hy);
      // Curvatura suave: la fibra se arquea con la tensión
      ctx.quadraticCurveTo(
        cx - hy * f.tension * 0.55,
        cy + hx * f.tension * 0.55,
        cx + hx, cy + hy
      );
      ctx.stroke();
    }

    /* Calor de la mano: un halo cálido bajo el puntero */
    if (puntero.x > -9000) {
      var halo = ctx.createRadialGradient(
        puntero.x, puntero.y, 0,
        puntero.x, puntero.y, 150 + puntero.fuerza * 70
      );
      halo.addColorStop(0, c.brillo + (0.075 + puntero.fuerza * 0.075).toFixed(3) + ')');
      halo.addColorStop(1, c.brillo + '0)');
      ctx.fillStyle = halo;
      ctx.fillRect(
        puntero.x - 230, puntero.y - 230,
        460, 460
      );
    }

    /* Envejecer las ondas */
    for (var k = ondas.length - 1; k >= 0; k--) {
      ondas[k].r += 7.5;
      ondas[k].vida -= 0.014;
      if (ondas[k].vida <= 0) ondas.splice(k, 1);
    }

    puntero.px = puntero.x;
    puntero.py = puntero.y;
  }

  /* ── Bucle ──────────────────────────────────────────── */
  function latir() {
    t += 16;
    pintar();
    rafId = requestAnimationFrame(latir);
  }

  function arrancarBucle() {
    if (animando || quieto) return;
    animando = true;
    rafId = requestAnimationFrame(latir);
  }

  function detenerBucle() {
    animando = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* ── Escuchar los dedos ─────────────────────────────── */
  function seguir(x, y) {
    puntero.x = x;
    puntero.y = y;
    if (puntero.px < -9000) { puntero.px = x; puntero.py = y; }
  }

  function soltar() {
    puntero.activo = false;
  }

  window.addEventListener('pointermove', function (e) {
    seguir(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('pointerdown', function (e) {
    seguir(e.clientX, e.clientY);
    puntero.activo = true;
    nacerOnda(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('pointerup', soltar, { passive: true });
  window.addEventListener('pointercancel', soltar, { passive: true });

  window.addEventListener('pointerleave', function () {
    puntero.x = -9999; puntero.y = -9999;
    puntero.px = -9999; puntero.py = -9999;
    puntero.activo = false;
  }, { passive: true });

  /* En el celular, el dedo deslizando deja su rastro */
  window.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches[0]) {
      seguir(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  /* ── Ajustes de ventana ─────────────────────────────── */
  var esperaMedida = null;
  window.addEventListener('resize', function () {
    clearTimeout(esperaMedida);
    esperaMedida = setTimeout(medir, 180);
  }, { passive: true });

  /* Pausa cuando la pestaña no se ve: no gastar batería */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) detenerBucle();
    else arrancarBucle();
  });

  /* ── Encendido ──────────────────────────────────────── */
  try {
    medir();

    if (quieto) {
      // Sin movimiento: un solo trazo estático, igual de bonito
      pintar();
    } else {
      arrancarBucle();
    }
  } catch (e) {
    console.warn('[fondo]', e);
    lienzo.style.display = 'none';
  }

})();
