// Easter egg: panel de juegos (Gato y Conecta 4 contra la computadora, y Buscaminas).
// Se carga bajo demanda desde script.js al hacer clic en el punto del titular, y
// expone window.JRHM_JUEGOS.abrir(). Sin dependencias.
(() => {
  'use strict';
  if (window.JRHM_JUEGOS) return;

  // ===== Textos =====
  const TXT = {
    es: {
      titulo: 'Juegos',
      cerrar: 'Cerrar',
      gato: 'Gato',
      conecta: 'Conecta 4',
      minas: 'Buscaminas',
      nueva: 'Nueva partida',
      tuTurno: 'Tu turno',
      pensando: 'Pensando…',
      ganaste: '¡Ganaste!',
      perdiste: 'Perdiste',
      empate: 'Empate',
      marcador: (g, e, p) => `Ganadas ${g} · Empates ${e} · Perdidas ${p}`,
      leyendaGato: 'Tú: X · Computadora: O',
      leyendaC4: 'Tú: ● · Computadora: ○',
      columna: (n) => `Columna ${n}`,
      casilla: (f, c, v) => `Fila ${f}, columna ${c}: ${v}`,
      vacia: 'vacía',
      cerrada: 'cerrada',
      bandera: 'bandera',
      mina: 'mina',
      sinMinas: 'sin minas cerca',
      minasCerca: (n) => `${n} minas cerca`,
      minasRestantes: 'Minas',
      tiempo: 'Tiempo',
      modoBandera: 'Modo bandera',
      ayudaMinas: 'Clic: descubrir · Clic derecho o mantener pulsado: bandera',
      ganasteMinas: '¡Despejaste el campo!',
      perdisteMinas: 'Pisaste una mina',
    },
    en: {
      titulo: 'Games',
      cerrar: 'Close',
      gato: 'Tic-tac-toe',
      conecta: 'Connect 4',
      minas: 'Minesweeper',
      nueva: 'New game',
      tuTurno: 'Your turn',
      pensando: 'Thinking…',
      ganaste: 'You won!',
      perdiste: 'You lost',
      empate: 'Draw',
      marcador: (g, e, p) => `Won ${g} · Draws ${e} · Lost ${p}`,
      leyendaGato: 'You: X · Computer: O',
      leyendaC4: 'You: ● · Computer: ○',
      columna: (n) => `Column ${n}`,
      casilla: (f, c, v) => `Row ${f}, column ${c}: ${v}`,
      vacia: 'empty',
      cerrada: 'closed',
      bandera: 'flag',
      mina: 'mine',
      sinMinas: 'no mines nearby',
      minasCerca: (n) => `${n} mines nearby`,
      minasRestantes: 'Mines',
      tiempo: 'Time',
      modoBandera: 'Flag mode',
      ayudaMinas: 'Click: reveal · Right-click or long press: flag',
      ganasteMinas: 'You cleared the field!',
      perdisteMinas: 'You hit a mine',
    },
  };
  const idioma = () => (document.documentElement.lang === 'en' ? 'en' : 'es');
  const t = (clave, ...args) => {
    const v = TXT[idioma()][clave];
    return typeof v === 'function' ? v(...args) : v;
  };

  // Marcadores de la sesión (se conservan mientras no se recargue la página).
  const sesion = { gato: { g: 0, e: 0, p: 0 }, conecta: { g: 0, e: 0, p: 0 }, humanoEmpiezaGato: true };

  const azar = (n) => Math.floor(Math.random() * n);
  const elegirAlAzar = (lista) => lista[azar(lista.length)];

  // ===== Gato =====
  function crearGato(contenedor) {
    // Cada partida cuelga de su propio nodo: así sus detectores de eventos se van con
    // él al cambiar de juego y no quedan escuchando sobre el contenedor compartido.
    const cuerpo = document.createElement('div');
    contenedor.appendChild(cuerpo);
    const LINEAS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const marcador = sesion.gato;
    let b, fin, ganadora, resultado, pensando, temporizador;

    cuerpo.innerHTML = `
      <p class="juegos__leyenda"></p>
      <p class="juegos__estado" aria-live="polite"></p>
      <div class="gato">${'<button type="button" class="gato__celda"></button>'.repeat(9)}</div>
      <div class="juegos__pie"><button type="button" class="juegos__btn" data-nueva></button><p class="juegos__marcador"></p></div>`;
    const celdas = Array.from(cuerpo.querySelectorAll('.gato__celda'));
    const q = (s) => cuerpo.querySelector(s);

    const ganadorDe = (t9) => {
      for (const l of LINEAS) {
        if (t9[l[0]] && t9[l[0]] === t9[l[1]] && t9[l[0]] === t9[l[2]]) return { j: t9[l[0]], l };
      }
      return null;
    };
    // Minimax: puntuación desde el punto de vista de la computadora (O). Se prefieren
    // las victorias rápidas y las derrotas lentas.
    function minimax(t9, turnoCpu, prof) {
      const g = ganadorDe(t9);
      if (g) return g.j === 'O' ? 10 - prof : prof - 10;
      if (t9.every(Boolean)) return 0;
      let mejor = turnoCpu ? -Infinity : Infinity;
      for (let i = 0; i < 9; i++) {
        if (t9[i]) continue;
        t9[i] = turnoCpu ? 'O' : 'X';
        const p = minimax(t9, !turnoCpu, prof + 1);
        t9[i] = '';
        mejor = turnoCpu ? Math.max(mejor, p) : Math.min(mejor, p);
      }
      return mejor;
    }
    function jugadaCpu() {
      const libres = [];
      for (let i = 0; i < 9; i++) if (!b[i]) libres.push(i);
      // De vez en cuando se equivoca a propósito: si no, nunca se le podría ganar.
      if (Math.random() < 0.15) return elegirAlAzar(libres);
      let mejor = -Infinity;
      let opciones = [];
      for (const i of libres) {
        b[i] = 'O';
        const p = minimax(b, false, 1);
        b[i] = '';
        if (p > mejor) { mejor = p; opciones = [i]; } else if (p === mejor) opciones.push(i);
      }
      return elegirAlAzar(opciones);
    }

    function revisar() {
      const g = ganadorDe(b);
      if (g) {
        fin = true;
        ganadora = g.l;
        resultado = g.j === 'X' ? 'g' : 'p';
      } else if (b.every(Boolean)) {
        fin = true;
        resultado = 'e';
      }
      if (fin) marcador[resultado]++;
      return fin;
    }
    function turnoCpu() {
      pensando = true;
      pintar();
      temporizador = setTimeout(() => {
        pensando = false;
        b[jugadaCpu()] = 'O';
        revisar();
        pintar();
      }, 450);
    }
    function jugar(i) {
      if (fin || pensando || b[i]) return;
      b[i] = 'X';
      if (!revisar()) turnoCpu(); else pintar();
    }
    function nueva(primera) {
      clearTimeout(temporizador);
      if (!primera) sesion.humanoEmpiezaGato = !sesion.humanoEmpiezaGato;
      b = Array(9).fill('');
      fin = false;
      ganadora = null;
      resultado = null;
      pensando = false;
      if (!sesion.humanoEmpiezaGato) turnoCpu(); else pintar();
    }
    function pintar() {
      celdas.forEach((c, i) => {
        c.textContent = b[i];
        c.classList.toggle('es-ganadora', !!ganadora && ganadora.includes(i));
        c.setAttribute('aria-label', t('casilla', Math.floor(i / 3) + 1, (i % 3) + 1, b[i] || t('vacia')));
        c.setAttribute('aria-disabled', String(fin || pensando || !!b[i]));
      });
      q('.juegos__leyenda').textContent = t('leyendaGato');
      q('.juegos__estado').textContent = fin
        ? { g: t('ganaste'), p: t('perdiste'), e: t('empate') }[resultado]
        : pensando ? t('pensando') : t('tuTurno');
      q('[data-nueva]').textContent = t('nueva');
      q('.juegos__marcador').textContent = t('marcador', marcador.g, marcador.e, marcador.p);
    }

    cuerpo.addEventListener('click', (e) => {
      const celda = e.target.closest('.gato__celda');
      if (celda) return jugar(celdas.indexOf(celda));
      if (e.target.closest('[data-nueva]')) nueva(false);
    });
    nueva(true);
    return { refrescar: pintar, destruir: () => clearTimeout(temporizador) };
  }

  // ===== Conecta 4 =====
  function crearConecta4(contenedor) {
    // Cada partida cuelga de su propio nodo: así sus detectores de eventos se van con
    // él al cambiar de juego y no quedan escuchando sobre el contenedor compartido.
    const cuerpo = document.createElement('div');
    contenedor.appendChild(cuerpo);
    const F = 6;
    const C = 7;
    const HUMANO = 1;
    const CPU = 2;
    const PROFUNDIDAD = 4;
    const ORDEN = [3, 2, 4, 1, 5, 0, 6]; // el centro primero: mejora la poda
    const marcador = sesion.conecta;

    // Todas las rectas de 4 casillas del tablero.
    const VENTANAS = [];
    for (let r = 0; r < F; r++) {
      for (let c = 0; c < C; c++) {
        for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
          const er = r + 3 * dr;
          const ec = c + 3 * dc;
          if (er < 0 || er >= F || ec < 0 || ec >= C) continue;
          VENTANAS.push([0, 1, 2, 3].map((k) => (r + k * dr) * C + c + k * dc));
        }
      }
    }
    const ganadorDe = (t42) => {
      for (const v of VENTANAS) {
        const a = t42[v[0]];
        if (a && a === t42[v[1]] && a === t42[v[2]] && a === t42[v[3]]) return v;
      }
      return null;
    };
    const filaLibre = (t42, c) => {
      for (let r = F - 1; r >= 0; r--) if (!t42[r * C + c]) return r;
      return -1;
    };
    function evaluar(t42, j) {
      const o = 3 - j;
      let s = 0;
      for (let r = 0; r < F; r++) if (t42[r * C + 3] === j) s += 3;
      for (const v of VENTANAS) {
        let mias = 0;
        let suyas = 0;
        for (const i of v) { if (t42[i] === j) mias++; else if (t42[i] === o) suyas++; }
        if (mias && suyas) continue;
        if (mias === 3) s += 5; else if (mias === 2) s += 2;
        else if (suyas === 3) s -= 4; else if (suyas === 2) s -= 1;
      }
      return s;
    }
    // Negamax con poda alfa-beta: puntuación para quien tiene el turno (j).
    function negamax(t42, prof, alfa, beta, j) {
      if (ganadorDe(t42)) return -(100000 + prof); // ganó quien movió antes
      if (prof === 0) return evaluar(t42, j);
      let hayJugada = false;
      let mejor = -Infinity;
      for (const c of ORDEN) {
        const r = filaLibre(t42, c);
        if (r < 0) continue;
        hayJugada = true;
        t42[r * C + c] = j;
        const p = -negamax(t42, prof - 1, -beta, -alfa, 3 - j);
        t42[r * C + c] = 0;
        if (p > mejor) mejor = p;
        if (mejor > alfa) alfa = mejor;
        if (alfa >= beta) break;
      }
      return hayJugada ? mejor : 0;
    }
    function jugadaCpu() {
      let mejor = -Infinity;
      let opciones = [];
      for (const c of ORDEN) {
        const r = filaLibre(b, c);
        if (r < 0) continue;
        b[r * C + c] = CPU;
        const p = -negamax(b, PROFUNDIDAD - 1, -Infinity, Infinity, HUMANO);
        b[r * C + c] = 0;
        if (p > mejor) { mejor = p; opciones = [c]; } else if (p === mejor) opciones.push(c);
      }
      return elegirAlAzar(opciones);
    }

    let b, fin, ganadora, resultado, pensando, temporizador, ultima;
    cuerpo.innerHTML = `
      <p class="juegos__leyenda"></p>
      <p class="juegos__estado" aria-live="polite"></p>
      <div class="c4">${Array.from({ length: C }, (_, c) =>
        `<button type="button" class="c4__col" data-col="${c}">${'<span class="c4__celda"></span>'.repeat(F)}</button>`).join('')}</div>
      <div class="juegos__pie"><button type="button" class="juegos__btn" data-nueva></button><p class="juegos__marcador"></p></div>`;
    const columnas = Array.from(cuerpo.querySelectorAll('.c4__col'));
    const q = (s) => cuerpo.querySelector(s);

    function colocar(c, j) {
      const r = filaLibre(b, c);
      b[r * C + c] = j;
      ultima = r * C + c;
      const g = ganadorDe(b);
      if (g) {
        fin = true;
        ganadora = g;
        resultado = j === HUMANO ? 'g' : 'p';
      } else if (b.every(Boolean)) {
        fin = true;
        resultado = 'e';
      }
      if (fin) marcador[resultado]++;
      return fin;
    }
    function turnoCpu() {
      pensando = true;
      pintar();
      temporizador = setTimeout(() => {
        pensando = false;
        colocar(jugadaCpu(), CPU);
        pintar();
      }, 500);
    }
    function jugar(c) {
      if (fin || pensando || filaLibre(b, c) < 0) return;
      if (!colocar(c, HUMANO)) turnoCpu(); else pintar();
    }
    function nueva() {
      clearTimeout(temporizador);
      b = Array(F * C).fill(0);
      fin = false;
      ganadora = null;
      resultado = null;
      pensando = false;
      ultima = -1;
      pintar();
    }
    function pintar() {
      columnas.forEach((col, c) => {
        col.setAttribute('aria-label', t('columna', c + 1));
        col.setAttribute('aria-disabled', String(fin || pensando || filaLibre(b, c) < 0));
        Array.from(col.children).forEach((celda, r) => {
          const i = r * C + c;
          celda.className = 'c4__celda'
            + (b[i] === HUMANO ? ' es-humano' : b[i] === CPU ? ' es-cpu' : '')
            + (ganadora && ganadora.includes(i) ? ' es-ganadora' : '')
            + (i === ultima ? ' cae' : '');
          celda.style.setProperty('--fila', r);
        });
      });
      ultima = -1; // la animación de caída solo se dispara una vez
      q('.juegos__leyenda').textContent = t('leyendaC4');
      q('.juegos__estado').textContent = fin
        ? { g: t('ganaste'), p: t('perdiste'), e: t('empate') }[resultado]
        : pensando ? t('pensando') : t('tuTurno');
      q('[data-nueva]').textContent = t('nueva');
      q('.juegos__marcador').textContent = t('marcador', marcador.g, marcador.e, marcador.p);
    }

    cuerpo.addEventListener('click', (e) => {
      const col = e.target.closest('.c4__col');
      if (col) return jugar(Number(col.dataset.col));
      if (e.target.closest('[data-nueva]')) nueva();
    });
    nueva();
    return { refrescar: pintar, destruir: () => clearTimeout(temporizador) };
  }

  // ===== Buscaminas =====
  function crearBuscaminas(contenedor) {
    // Cada partida cuelga de su propio nodo: así sus detectores de eventos se van con
    // él al cambiar de juego y no quedan escuchando sobre el contenedor compartido.
    const cuerpo = document.createElement('div');
    contenedor.appendChild(cuerpo);
    const N = 9; // 9 x 9
    const MINAS = 10;
    let celdas, minasColocadas, fin, perdio, abiertas, banderas, segundos, reloj, modoBandera, explotada;
    let pulsacion = null; // pulsación larga en táctil = bandera
    let sinClic = false;

    cuerpo.innerHTML = `
      <p class="juegos__leyenda"></p>
      <p class="juegos__estado" aria-live="polite"></p>
      <div class="minas__barra">
        <span class="minas__dato"><span data-et-minas></span> <b data-minas></b></span>
        <button type="button" class="juegos__btn juegos__btn--chico" data-modo aria-pressed="false"></button>
        <span class="minas__dato"><span data-et-tiempo></span> <b data-tiempo></b></span>
      </div>
      <div class="minas" role="grid">${'<button type="button" class="minas__celda"></button>'.repeat(N * N)}</div>
      <div class="juegos__pie"><button type="button" class="juegos__btn" data-nueva></button></div>`;
    const botones = Array.from(cuerpo.querySelectorAll('.minas__celda'));
    const q = (s) => cuerpo.querySelector(s);

    const vecinos = (i) => {
      const r = Math.floor(i / N);
      const c = i % N;
      const res = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const rr = r + dr;
          const cc = c + dc;
          if (rr >= 0 && rr < N && cc >= 0 && cc < N) res.push(rr * N + cc);
        }
      }
      return res;
    };
    const VECINOS = Array.from({ length: N * N }, (_, i) => vecinos(i));

    function colocarMinas(segura) {
      // La primera casilla (y las de alrededor) nunca tienen mina.
      const prohibidas = new Set([segura, ...VECINOS[segura]]);
      let puestas = 0;
      while (puestas < MINAS) {
        const i = azar(N * N);
        if (prohibidas.has(i) || celdas[i].mina) continue;
        celdas[i].mina = true;
        puestas++;
      }
      celdas.forEach((c, i) => { c.n = VECINOS[i].filter((v) => celdas[v].mina).length; });
      minasColocadas = true;
      reloj = setInterval(() => { segundos++; pintarBarra(); }, 1000);
    }
    function abrir(i) {
      const pila = [i];
      while (pila.length) {
        const k = pila.pop();
        const c = celdas[k];
        if (c.abierta || c.bandera) continue;
        c.abierta = true;
        abiertas++;
        if (c.mina) return; // el llamador decide qué hacer
        if (c.n === 0) VECINOS[k].forEach((v) => { if (!celdas[v].abierta) pila.push(v); });
      }
    }
    function terminar(gano) {
      fin = true;
      perdio = !gano;
      clearInterval(reloj);
      if (gano) {
        // Al ganar, todas las minas quedan marcadas (no puede haber banderas de más:
        // una casilla con bandera no se abre, y ganar exige abrir todas las demás).
        celdas.forEach((c) => { if (c.mina) c.bandera = true; });
        banderas = MINAS;
      } else celdas.forEach((c) => { if (c.mina && !c.bandera) c.abierta = true; });
    }
    function revelar(i) {
      if (fin) return;
      const c = celdas[i];
      if (c.bandera) return;
      if (c.abierta) {
        // Clic en un número cuyas banderas ya coinciden: abre el resto de vecinos.
        if (c.n > 0 && VECINOS[i].filter((v) => celdas[v].bandera).length === c.n) {
          for (const v of VECINOS[i]) {
            if (celdas[v].bandera || celdas[v].abierta) continue;
            abrir(v);
            if (celdas[v].mina) { explotada = v; terminar(false); return pintar(); }
          }
        }
      } else {
        if (!minasColocadas) colocarMinas(i);
        abrir(i);
        if (c.mina) { explotada = i; terminar(false); return pintar(); }
      }
      if (abiertas === N * N - MINAS) terminar(true);
      pintar();
    }
    function marcar(i) {
      if (fin) return;
      const c = celdas[i];
      if (c.abierta) return;
      c.bandera = !c.bandera;
      banderas += c.bandera ? 1 : -1;
      pintar();
    }

    function nueva() {
      clearInterval(reloj);
      celdas = Array.from({ length: N * N }, () => ({ mina: false, abierta: false, bandera: false, n: 0 }));
      minasColocadas = false;
      fin = false;
      perdio = false;
      abiertas = 0;
      banderas = 0;
      segundos = 0;
      explotada = -1;
      modoBandera = false;
      pintar();
    }
    function pintarBarra() {
      q('[data-et-minas]').textContent = t('minasRestantes');
      q('[data-minas]').textContent = String(MINAS - banderas);
      q('[data-et-tiempo]').textContent = t('tiempo');
      q('[data-tiempo]').textContent = String(Math.min(segundos, 999));
    }
    function pintar() {
      botones.forEach((b, i) => {
        const c = celdas[i];
        let texto = '';
        let estado = t('cerrada');
        if (c.abierta) {
          if (c.mina) { texto = '✱'; estado = t('mina'); } else if (c.n > 0) { texto = String(c.n); estado = t('minasCerca', c.n); } else estado = t('sinMinas');
        } else if (c.bandera) { texto = '⚑'; estado = t('bandera'); }
        b.textContent = texto;
        b.className = 'minas__celda'
          + (c.abierta ? ' es-abierta' : '')
          + (c.bandera && !c.abierta ? ' es-bandera' : '')
          + (c.abierta && c.mina ? ' es-mina' : '')
          + (i === explotada ? ' es-explotada' : '')
          + (c.abierta && c.n ? ` n${c.n}` : '')
          + (fin && perdio && c.bandera && !c.mina ? ' es-error' : '');
        b.setAttribute('aria-label', t('casilla', Math.floor(i / N) + 1, (i % N) + 1, estado));
        b.tabIndex = i === (b.parentElement.__foco ?? 0) ? 0 : -1;
      });
      q('.juegos__leyenda').textContent = t('ayudaMinas');
      q('.juegos__estado').textContent = fin ? (perdio ? t('perdisteMinas') : t('ganasteMinas')) : ' ';
      const modo = q('[data-modo]');
      modo.textContent = t('modoBandera');
      modo.setAttribute('aria-pressed', String(modoBandera));
      q('[data-nueva]').textContent = t('nueva');
      pintarBarra();
    }

    const rejilla = q('.minas');
    rejilla.__foco = 0;
    const indiceDe = (el) => botones.indexOf(el.closest('.minas__celda'));
    rejilla.addEventListener('click', (e) => {
      if (sinClic) { sinClic = false; return; }
      const i = indiceDe(e.target);
      if (i < 0) return;
      rejilla.__foco = i;
      if (modoBandera) marcar(i); else revelar(i);
    });
    rejilla.addEventListener('contextmenu', (e) => {
      const i = indiceDe(e.target);
      e.preventDefault();
      if (i >= 0) marcar(i);
    });
    // Pulsación larga (táctil): bandera. El clic que sigue se descarta.
    rejilla.addEventListener('pointerdown', (e) => {
      sinClic = false;
      if (e.pointerType === 'mouse') return;
      const i = indiceDe(e.target);
      if (i < 0) return;
      pulsacion = setTimeout(() => { pulsacion = null; sinClic = true; marcar(i); }, 450);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => rejilla.addEventListener(ev, () => {
      if (pulsacion) { clearTimeout(pulsacion); pulsacion = null; }
    }));
    // Teclado: flechas para moverse, F para la bandera.
    rejilla.addEventListener('keydown', (e) => {
      const i = indiceDe(e.target);
      if (i < 0) return;
      const r = Math.floor(i / N);
      const c = i % N;
      const destino = { ArrowUp: [r - 1, c], ArrowDown: [r + 1, c], ArrowLeft: [r, c - 1], ArrowRight: [r, c + 1] }[e.key];
      if (destino) {
        e.preventDefault();
        const [rr, cc] = destino;
        if (rr >= 0 && rr < N && cc >= 0 && cc < N) {
          rejilla.__foco = rr * N + cc;
          pintar();
          botones[rejilla.__foco].focus();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        marcar(i);
      }
    });
    cuerpo.addEventListener('click', (e) => {
      if (e.target.closest('[data-nueva]')) nueva();
      else if (e.target.closest('[data-modo]')) { modoBandera = !modoBandera; pintar(); }
    });

    nueva();
    return { refrescar: pintar, destruir: () => { clearInterval(reloj); clearTimeout(pulsacion); } };
  }

  // ===== Panel =====
  const JUEGOS = [
    { id: 'gato', crear: crearGato },
    { id: 'conecta', crear: crearConecta4 },
    { id: 'minas', crear: crearBuscaminas },
  ];
  let dialogo = null;
  let cuerpoEl = null;
  let instancia = null;
  let actual = 'gato';
  let cssListo = null;

  function cargarCss() {
    if (!cssListo) {
      cssListo = new Promise((ok) => {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'juegos.css';
        l.onload = ok;
        l.onerror = ok; // sin estilos el panel sigue funcionando
        document.head.appendChild(l);
      });
    }
    return cssListo;
  }
  function elegir(id) {
    if (instancia) instancia.destruir();
    actual = id;
    cuerpoEl.replaceChildren();
    instancia = JUEGOS.find((j) => j.id === id).crear(cuerpoEl);
    dialogo.querySelectorAll('.juegos__tab').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.juego === id)));
  }
  function traducirPanel() {
    dialogo.querySelector('.juegos__titulo').textContent = t('titulo');
    dialogo.querySelector('.juegos__cerrar').setAttribute('aria-label', t('cerrar'));
    dialogo.querySelectorAll('.juegos__tab').forEach((b) => { b.textContent = t(b.dataset.juego); });
    if (instancia) instancia.refrescar();
  }
  function crearPanel() {
    dialogo = document.createElement('dialog');
    dialogo.className = 'juegos';
    dialogo.setAttribute('aria-labelledby', 'juegos-titulo');
    dialogo.innerHTML = `
      <div class="juegos__panel">
        <header class="juegos__cab">
          <h2 class="juegos__titulo" id="juegos-titulo"></h2>
          <button type="button" class="juegos__cerrar">×</button>
        </header>
        <div class="juegos__tabs">${JUEGOS.map((j) => `<button type="button" class="juegos__tab" data-juego="${j.id}" aria-pressed="false"></button>`).join('')}</div>
        <div class="juegos__cuerpo"></div>
      </div>`;
    document.body.appendChild(dialogo);
    cuerpoEl = dialogo.querySelector('.juegos__cuerpo');

    dialogo.addEventListener('click', (e) => {
      if (e.target === dialogo || e.target.closest('.juegos__cerrar')) dialogo.close();
      const tab = e.target.closest('.juegos__tab');
      if (tab) elegir(tab.dataset.juego);
    });
    // La página de atrás no debe desplazarse mientras el panel está abierto.
    dialogo.addEventListener('wheel', (e) => { if (!e.target.closest('.juegos__panel')) e.preventDefault(); }, { passive: false });
    dialogo.addEventListener('touchmove', (e) => { if (!e.target.closest('.juegos__panel')) e.preventDefault(); }, { passive: false });
    dialogo.addEventListener('close', () => {
      if (instancia) instancia.destruir();
      instancia = null;
      cuerpoEl.replaceChildren();
    });
    document.addEventListener('jrhm:idioma', () => { if (dialogo.open) traducirPanel(); });
  }

  async function abrir() {
    await cargarCss();
    if (!dialogo) crearPanel();
    if (dialogo.open) return;
    elegir(actual);
    traducirPanel();
    dialogo.showModal();
  }

  window.JRHM_JUEGOS = { abrir };
})();
