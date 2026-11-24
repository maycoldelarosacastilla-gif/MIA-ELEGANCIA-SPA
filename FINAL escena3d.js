/* Fondo 3D FIJO de toda la página (three.js). Objetos de salón con reflejos reales:
   tijeras que cortan, peine, cepillo redondo, perfume de cristal, esmalte, perlas, anillos y polvo dorado.
   Al hacer scroll la cámara "viaja" por la escena. */
(function () {
  if (!window.THREE) return;
  const T = THREE;
  const cv = document.createElement("canvas");
  cv.id = "fondo3d"; cv.setAttribute("aria-hidden", "true"); document.body.prepend(cv);
  let R;
  try { R = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); } catch (e) { cv.remove(); return; }
  R.outputEncoding = T.sRGBEncoding; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.15;
  const scene = new T.Scene(), cam = new T.PerspectiveCamera(40, 1, 0.1, 120);
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Entorno de estudio (softboxes) para reflejos metálicos y de cristal realistas ---- */
  const env = new T.Scene(); env.background = new T.Color(0x6b5560);
  function caja(w, h, x, y, z, col, i) {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(col).multiplyScalar(i), side: T.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m);
  }
  caja(30, 8, 0, 18, 0, 0xffffff, 3); caja(8, 26, -18, 2, 4, 0xff9cc8, 2.4);
  caja(8, 26, 18, 2, 4, 0xffd58a, 2.4); caja(26, 6, 0, -2, 18, 0xffffff, 1.6); caja(20, 5, 0, -16, -6, 0xffe6ef, 1.2);
  const pm = new T.PMREMGenerator(R); scene.environment = pm.fromScene(env, 0.03).texture;
  scene.add(new T.AmbientLight(0xffffff, 0.35));
  const sol = new T.DirectionalLight(0xffffff, 0.8); sol.position.set(4, 8, 8); scene.add(sol);

  const M = (o) => new T.MeshPhysicalMaterial(o);
  const cromo = M({ color: 0xf4f1f2, metalness: 1, roughness: 0.1 });
  const oro = M({ color: 0xe0b765, metalness: 1, roughness: 0.18 });
  const oroRosa = M({ color: 0xeaa58f, metalness: 1, roughness: 0.2 });
  const lacaRosa = M({ color: 0xe9609f, metalness: 0.1, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05 });
  const perla = M({ color: 0xfff1f4, metalness: 0.2, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 });
  const cristal = M({ color: 0xffdbe8, metalness: 0, roughness: 0.04, clearcoat: 1, transparent: true, opacity: 0.5, envMapIntensity: 1.6 });
  const liquido = M({ color: 0xf06aa8, metalness: 0, roughness: 0.1, clearcoat: 1 });
  const bisel = (d) => ({ depth: d, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 3, curveSegments: 24 });

  /* ---- Objetos ---- */
  function tijeras() {
    const g = new T.Group(); g.userData.hojas = [];
    [1, -1].forEach((l) => {
      const m = new T.Group();
      const f = new T.Shape(); f.moveTo(-0.4, -0.2); f.quadraticCurveTo(2, -0.16, 4, 0); f.lineTo(4, 0.03); f.quadraticCurveTo(2, 0.12, -0.4, 0.2); f.closePath();
      const hoja = new T.Mesh(new T.ExtrudeGeometry(f, bisel(0.04)), cromo);
      const anillo = new T.Shape(); anillo.absellipse(0, 0, 0.7, 0.5, 0, Math.PI * 2);
      const hueco = new T.Path(); hueco.absellipse(0, 0, 0.46, 0.3, 0, Math.PI * 2); anillo.holes.push(hueco);
      const asa = new T.Mesh(new T.ExtrudeGeometry(anillo, bisel(0.1)), oroRosa); asa.position.set(-1.35, -0.12 * l, -0.03);
      const cuello = new T.Mesh(new T.BoxGeometry(0.8, 0.14, 0.1), oroRosa); cuello.position.set(-0.65, -0.05 * l, 0.02);
      m.add(hoja, asa, cuello); m.position.z = l * 0.04; g.add(m); g.userData.hojas.push([m, l]);
    });
    const tornillo = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.3, 24), oro); tornillo.rotation.x = Math.PI / 2; g.add(tornillo);
    g.position.x -= 0.6; return g;
  }
  function peine() {
    const s = new T.Shape(); s.moveTo(-1.7, 0.55); s.lineTo(1.7, 0.55); s.lineTo(1.7, 0.25);
    for (let i = 0; i < 18; i++) { const x = 1.7 - i * 0.19; s.lineTo(x, -0.9); s.lineTo(x - 0.1, -0.9); s.lineTo(x - 0.1, 0.25); s.lineTo(x - 0.19, 0.25); }
    s.closePath(); const m = new T.Mesh(new T.ExtrudeGeometry(s, bisel(0.08)), oroRosa); const g = new T.Group(); g.add(m); return g;
  }
  function frasco(perfil, tapa, hLiq) {
    const g = new T.Group(); const P = (a) => a.map((p) => new T.Vector2(p[0], p[1]));
    g.add(new T.Mesh(new T.LatheGeometry(P(perfil), 48), cristal));
    g.add(new T.Mesh(new T.LatheGeometry(P([[0, 0.08], [0.62, 0.08], [0.62, hLiq], [0, hLiq]]), 40), liquido));
    const c = new T.Mesh(new T.CylinderGeometry(tapa[0], tapa[0], tapa[1], 36), oro); c.position.y = perfil[perfil.length - 1][1] + tapa[1] / 2 - 0.05; g.add(c);
    return g;
  }
  const perfume = () => frasco([[0, 0], [0.8, 0], [0.9, 0.15], [0.9, 1.6], [0.75, 1.8], [0.3, 1.9], [0.28, 2.1], [0, 2.1]], [0.38, 0.7], 1.5);
  function esmalte() {
    const g = new T.Group();
    const P = [[0, 0], [0.62, 0], [0.7, 0.12], [0.7, 1.2], [0.55, 1.4], [0.22, 1.5], [0, 1.5]].map((p) => new T.Vector2(p[0], p[1]));
    g.add(new T.Mesh(new T.LatheGeometry(P, 40), lacaRosa));
    const t = new T.Mesh(new T.CylinderGeometry(0.26, 0.26, 1.2, 28), oro); t.position.y = 2; g.add(t); return g;
  }
  function cepillo() {
    const g = new T.Group();
    const nucleo = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 2.6, 32), oroRosa); nucleo.rotation.z = Math.PI / 2; g.add(nucleo);
    const mango = new T.Mesh(new T.CylinderGeometry(0.2, 0.28, 2.2, 24), oro); mango.rotation.z = Math.PI / 2; mango.position.x = 2.3; g.add(mango);
    const cerda = new T.InstancedMesh(new T.CylinderGeometry(0.018, 0.012, 0.6, 6), M({ color: 0x2a1a20, roughness: 0.5 }), 260), o = new T.Object3D(); let k = 0;
    for (let i = 0; i < 13; i++) for (let j = 0; j < 20; j++) {
      const a = (j / 20) * Math.PI * 2 + (i % 2) * 0.15; o.position.set(-1.2 + i * 0.2, Math.cos(a) * 0.68, Math.sin(a) * 0.68);
      o.rotation.set(a - Math.PI / 2 + Math.PI, 0, 0); o.rotation.set(a + Math.PI / 2, 0, 0); o.updateMatrix(); cerda.setMatrixAt(k++, o.matrix);
    }
    g.add(cerda); return g;
  }
  const perlaM = (r) => new T.Mesh(new T.SphereGeometry(r, 40, 40), perla);
  const aro = (r, t, mat) => new T.Mesh(new T.TorusGeometry(r, t, 24, 120), mat || oro);

  /* ---- Colocación a lo largo de toda la página ---- */
  const items = [], ALTO = 62;
  function poner(obj, x, y, z, esc, vel, flota) {
    obj.scale.setScalar(esc); obj.position.set(x, y, z);
    obj.userData.base = { x, y, v: vel, f: flota, fase: Math.random() * 6 }; scene.add(obj); items.push(obj);
  }
  const hero = tijeras(); poner(hero, 1.5, 0.3, -1, 0.85, 0.25, 0.25);
  poner(aro(3.1, 0.018), 1.5, 0.3, -1.5, 1, 0.15, 0); poner(aro(3.6, 0.012), 1.5, 0.3, -2, 1, -0.1, 0);
  poner(perfume(), -7.5, -6, -2, 1, 0.4, 0.3); poner(esmalte(), 7.5, -9, -2.5, 1, -0.45, 0.35);
  poner(peine(), -7.8, -14, -3, 1.1, 0.3, 0.3); poner(cepillo(), 7.6, -19, -3, 0.9, -0.3, 0.3);
  poner(tijeras(), -7, -24, -4, 0.6, 0.3, 0.3); poner(perfume(), 7.8, -29, -3, 1.2, 0.35, 0.3);
  poner(aro(2.2, 0.03), -7.5, -33, -4, 1, 0.3, 0.2); poner(esmalte(), -7.5, -38, -2.5, 1.1, 0.4, 0.3);
  poner(peine(), 7.5, -42, -3.5, 1, -0.3, 0.3); poner(cepillo(), -7.8, -47, -3.5, 0.9, 0.3, 0.3);
  poner(tijeras(), 7.2, -52, -3, 0.7, -0.3, 0.3); poner(perfume(), -7.2, -57, -3, 1, 0.35, 0.3);
  [[-4, -3], [5, -4.5], [-5.5, -11], [4.5, -16], [-4.5, -22], [5.5, -27], [-5, -35], [4.5, -40], [-4.5, -50], [5, -55]]
    .forEach((p, i) => poner(perlaM(0.28 + (i % 3) * 0.12), p[0], p[1], -1 - (i % 3), 1, 0.2, 0.5));
  poner(aro(1.4, 0.05, oroRosa), 5.2, -13, -4, 1, 0.5, 0.2); poner(aro(1.1, 0.05), -5, -31, -4, 1, -0.5, 0.2); poner(aro(1.6, 0.05, oroRosa), 5, -46, -4, 1, 0.4, 0.2);

  /* ---- Polvo dorado (partículas) ---- */
  const N = 520, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 24; pos[i * 3 + 1] = 6 - Math.random() * (ALTO + 14); pos[i * 3 + 2] = -9 + Math.random() * 10; }
  const gg = new T.BufferGeometry(); gg.setAttribute("position", new T.BufferAttribute(pos, 3));
  const polvo = new T.Points(gg, new T.PointsMaterial({ color: 0xe6c27a, size: 0.07, transparent: true, opacity: 0.8, depthWrite: false })); scene.add(polvo);

  /* ---- Interacción y bucle ---- */
  let mx = 0, my = 0, sp = 0, spSuave = 0, ancho = 1, activo = true;
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
  function medir() {
    const w = innerWidth, h = innerHeight; ancho = Math.max(0.42, Math.min(1.1, (w / h) / 1.6));
    R.setPixelRatio(Math.min(devicePixelRatio, 1.75)); R.setSize(w, h, false);
    cam.aspect = w / h; cam.position.z = w < 700 ? 21 : 14; cam.updateProjectionMatrix();
    items.forEach((o) => (o.position.x = o.userData.base.x * ancho));
  }
  const reloj = new T.Clock();
  function dibujar() {
    const t = reloj.getElapsedTime(), max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    sp = scrollY / max; spSuave += (sp - spSuave) * 0.07;
    items.forEach((o) => {
      const b = o.userData.base; o.rotation.y = t * b.v + b.fase; o.rotation.x = Math.sin(t * 0.5 + b.fase) * 0.35;
      o.position.y = b.y + Math.sin(t * 0.8 + b.fase) * b.f;
      if (o.userData.hojas) o.userData.hojas.forEach((h) => (h[0].rotation.z = h[1] * (0.1 + 0.16 * (0.5 + 0.5 * Math.sin(t * 2.2)))));
    });
    polvo.rotation.y = t * 0.02;
    cam.position.x += (mx * 2 - cam.position.x) * 0.04;
    cam.position.y = -spSuave * ALTO + (-my * 1.2);
    cam.lookAt(cam.position.x * 0.3, -spSuave * ALTO, 0);
    R.render(scene, cam);
  }
  function bucle() { if (!activo) return; dibujar(); requestAnimationFrame(bucle); }
  medir(); addEventListener("resize", () => { medir(); if (calmo) dibujar(); });
  if (calmo) { dibujar(); addEventListener("scroll", dibujar, { passive: true }); return; }
  document.addEventListener("visibilitychange", () => { const v = !document.hidden; if (v && !activo) { activo = true; bucle(); } activo = v; });
  bucle();
})();
