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
