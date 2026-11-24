/* MEJORAS (solo se AGREGA): imágenes de respaldo + chispas al hacer clic */
(function () {
  /* 1) Si una imagen no carga, se reemplaza por una imagen local acorde al servicio (nunca queda vacío) */
  const tema = (alt) => {
    alt = (alt || "").toLowerCase();
    if (/yape/.test(alt)) return "img/yape.png";
    if (/plin/.test(alt)) return "img/plin.png";
    if (/u[ñn]as|manicure|esmalt/.test(alt)) return "img/fb-unas.jpg";
    if (/cabell|corte|peinad|estilista/.test(alt)) return "img/fb-cabello.jpg";
    if (/maquill/.test(alt)) return "img/fb-maquillaje.jpg";
    if (/facial|relaj|bata|spa|masaje/.test(alt)) return "img/fb-facial.jpg";
    return "img/fb-general.jpg";
  };
  const respaldo = (img) => {
    if (img.dataset.respaldo) return; img.dataset.respaldo = "1";
    img.removeAttribute("srcset"); img.src = tema(img.alt);
  };
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => respaldo(img));
    if (img.complete && img.naturalWidth === 0 && img.src) respaldo(img);
  });

  /* 2) Chispas: estrellas doradas, perlas rosadas y un aro, al hacer clic */
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rnd = (a, b) => a + Math.random() * (b - a);
  function pieza(x, y, clase, tam, dx, dy, rot, dur) {
    const e = document.createElement("span");
    e.className = "chispa " + clase; e.style.cssText = `left:${x}px;top:${y}px;--s:${tam}px`;
    document.body.appendChild(e);
    const a = e.animate([
      { transform: "translate(-50%,-50%) scale(0) rotate(0deg)", opacity: 1 },
      { transform: `translate(calc(-50% + ${dx * 0.7}px),calc(-50% + ${dy * 0.7}px)) scale(1) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy + 14}px)) scale(.2) rotate(${rot}deg)`, opacity: 0 },
    ], { duration: dur, easing: "cubic-bezier(.2,.8,.2,1)" });
    a.onfinish = () => e.remove();
  }
  document.addEventListener("pointerdown", (ev) => {
    const x = ev.clientX, y = ev.clientY;
    const aro = document.createElement("span"); aro.className = "chispa chispa-aro"; aro.style.cssText = `left:${x}px;top:${y}px;--s:14px`;
    document.body.appendChild(aro);
    aro.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 0.9 }, { transform: "translate(-50%,-50%) scale(3.2)", opacity: 0 }], { duration: 550, easing: "ease-out" }).onfinish = () => aro.remove();
    for (let i = 0; i < 9; i++) {
      const ang = (i / 9) * Math.PI * 2 + rnd(-0.3, 0.3), dist = rnd(34, 78);
      const estrella = i % 3 !== 2;
      pieza(x, y, estrella ? "chispa-estrella" : "chispa-perla", estrella ? rnd(10, 18) : rnd(5, 8),
        Math.cos(ang) * dist, Math.sin(ang) * dist, rnd(-120, 120), rnd(600, 950));
    }
  }, { passive: true });
})();

/* 3) Fotos propias por sección: si existe el archivo en img/, se usa; si no, queda la foto actual.
      Así cada sección puede tener su foto distinta sin tocar el HTML (ver img/LEEME-FOTOS.txt). */
(function () {
  const ranuras = {
    ".portada-foto img": "portada.jpg",
    ".arco img": "hero.jpg",
    ".burbuja img": "hero-detalle.jpg",
    "#servicios .tarjeta:nth-of-type(1) img": "servicio-unas.jpg",
    "#servicios .tarjeta:nth-of-type(2) img": "servicio-cabello.jpg",
    "#servicios .tarjeta:nth-of-type(3) img": "servicio-maquillaje.jpg",
    "#servicios .tarjeta:nth-of-type(4) img": "servicio-facial.jpg",
    "#cuidado img": "cuidado.jpg",
    "#ritual img": "ritual.jpg",
    ".g-facial img": "galeria-facial.jpg",
    ".g-corte img": "galeria-cabello.jpg",
    ".g-unas img": "galeria-unas.jpg",
    ".g-maquillaje img": "galeria-maquillaje.jpg",
  };
  Object.keys(ranuras).forEach((sel) => {
    const img = document.querySelector(sel); if (!img) return;
    const prueba = new Image(); const ruta = "img/" + ranuras[sel];
    prueba.onload = () => { img.removeAttribute("srcset"); img.dataset.respaldo = "1"; img.src = ruta; };
    prueba.src = ruta; /* si no existe, no pasa nada */
  });
})();
