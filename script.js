/* LOADER & GLOBAL EMOJIS */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const emojis = ["🌹", "🌸", "💗", "🌷", "🌺", "✨"];
  
  if (loader) {
    // Pre-fill the screen immediately so the whole page is covered
    for (let i = 0; i < 40; i++) {
      const e = document.createElement("div");
      e.className = "loader-emoji";
      e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      e.style.left = (Math.random() * 100) + "%";
      e.style.top = (Math.random() * 100) + "%"; // Random start height
      e.style.animationDuration = (2 + Math.random() * 2) + "s";
      e.style.fontSize = (24 + Math.random() * 24) + "px";
      loader.appendChild(e);
      setTimeout(() => e.remove(), 4000);
    }

    // Fast spawning from the bottom
    const loaderInterval = setInterval(() => {
      const e = document.createElement("div");
      e.className = "loader-emoji";
      e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      e.style.left = (5 + Math.random() * 90) + "%";
      e.style.animationDuration = (2 + Math.random() * 2) + "s";
      e.style.fontSize = (24 + Math.random() * 24) + "px";
      loader.appendChild(e);
      setTimeout(() => e.remove(), 4000);
    }, 150);

    let opened = false, ready = false;
    setTimeout(() => { ready = true; loader.classList.add("ready"); }, 2400);
    const startExperience = () => {
      if (!ready || opened) return;
      opened = true;
      const bgMusic = document.getElementById("bg-music");
      if (bgMusic && bgMusic.paused) {
        bgMusic.play().catch((e) => console.log("Audio play failed:", e));
      }
      loader.classList.add("open");
      document.body.classList.remove("pre");
      if (window.revealName) window.revealName();
      if (window.startConfetti) window.startConfetti();
      setTimeout(() => {
        clearInterval(loaderInterval);
        loader.classList.add("fade-out");
        setTimeout(() => loader.remove(), 800);
      }, 2400);
      document.body.removeEventListener("click", startExperience);
    };
    document.body.addEventListener("click", startExperience);
  }

  // Continuous slower spawning for the whole page background
  setInterval(() => {
    const e = document.createElement("div");
    e.className = "page-emoji";
    e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.left = (Math.random() * 100) + "%";
    e.style.animationDuration = (5 + Math.random() * 5) + "s"; // Slower, more relaxing float
    e.style.fontSize = (16 + Math.random() * 20) + "px"; // Slightly smaller
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 10000); // Give it time to reach the top
  }, window.innerWidth < 768 ? 1500 : 400);
});

const IMGS = Array.from({ length: 17 }, (_, i) => `ammu di folder/img${i + 1}.jpg`);
const TH = Array.from({ length: 17 }, (_, i) => `ammu di folder/thumbs/img${i + 1}.jpg`);

/* ROSE BUILDER (pure SVG) */
function roseSVG() {
  const L = [[8, 1, "#7f0d2e", 0], [7, 0.84, "#a3123a", 20], [6, 0.66, "#c8174a", 10], [5, 0.48, "#e8325f", 30], [4, 0.31, "#f65b80", 5], [3, 0.17, "#ff9bb5", 0]];
  const leaf = "M0 0C-12-10-34-8-46 2-34 12-12 10 0 0Z";
  let s = `<svg class="rose-svg" viewBox="-52 -52 104 104"><g fill="#166534" stroke="#0b3a1e" stroke-width=".8"><path d="${leaf}" transform="rotate(-35)"/><path d="${leaf}" transform="scale(-1 1) rotate(-35)"/></g>`;
  L.forEach(([n, sc, fill, off], li) => {
    for (let k = 0; k < n; k++)
      s += `<g transform="rotate(${off + (k * 360) / n}) scale(${sc})"><path class="pl" style="--i:${li}" fill="${fill}" stroke="rgba(0,0,0,.25)" stroke-width="1" d="M0 0C-20-8-26-36 0-46 26-36 20-8 0 0Z"/></g>`;
  });
  return s + `<path d="M0-5C6-6 7 1 2 3-4 5-8-2-3-7" fill="none" stroke="#ffd0dd" stroke-width="1.4" stroke-linecap="round" opacity=".85"/></svg>`;
}
document.querySelectorAll("[data-rose]").forEach((el) => (el.innerHTML = roseSVG()));

/* SCROLL PROGRESS */
const sp = document.getElementById("sprog");
window.addEventListener(
  "scroll",
  () => {
    sp.style.width =
      (scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100 +
      "%";
  },
  { passive: true },
);

/* CURSOR */
const cur = document.getElementById("cur"),
  cring = document.getElementById("cring");
const sc = document.getElementById("sc"),
  sctx = sc.getContext("2d");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
const rsz = () => {
  sc.width = innerWidth;
  sc.height = innerHeight;
};
rsz();
window.addEventListener("resize", rsz);
const sparks = [];
document.addEventListener(
  "mousemove",
  (e) => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + "px";
    cur.style.top = my + "px";
    if (Math.random() < 0.3)
      sparks.push({
        x: mx,
        y: my,
        vx: (Math.random() - 0.5) * 3.5,
        vy: (Math.random() - 0.5) * 3.5,
        r: Math.random() * 2.5 + 0.7,
        life: 1,
        c: Math.random() < 0.5 ? "#f472a0" : "#fb7185",
      });
  },
  { passive: true },
);
(function loop() {
  sctx.clearRect(0, 0, sc.width, sc.height);
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.042;
    s.r *= 0.97;
    if (s.life <= 0) {
      sparks.splice(i, 1);
      continue;
    }
    sctx.save();
    sctx.globalAlpha = s.life * 0.8;
    sctx.fillStyle = s.c;
    sctx.beginPath();
    sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sctx.fill();
    sctx.restore();
  }
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  cring.style.left = rx + "px";
  cring.style.top = ry + "px";
  requestAnimationFrame(loop);
})();
document.addEventListener(
  "click",
  (e) => {
    "✨🌸♪♫💛🎵⭐🌺".split("").forEach((em) => {
      const d = document.createElement("div");
      d.className = "pop";
      d.textContent = em;
      d.style.left = e.clientX + "px";
      d.style.top = e.clientY + "px";
      const a = Math.random() * Math.PI * 2,
        dist = 50 + Math.random() * 65;
      d.style.setProperty("--dx", Math.cos(a) * dist + "px");
      d.style.setProperty("--dy", Math.sin(a) * dist - 52 + "px");
      d.style.animationDuration = 0.38 + Math.random() * 0.5 + "s";
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 900);
    });
  },
  { passive: true },
);

/* HERO — ROSE WREATH + PETAL RAIN */
(() => {
  const wr = document.getElementById("hwreath");
  const N = 14;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2, d = document.createElement("div");
    d.className = "hr";
    d.style.left = (50 + 50 * Math.cos(a)).toFixed(2) + "%";
    d.style.top = (50 + 50 * Math.sin(a)).toFixed(2) + "%";
    d.style.setProperty("--s", [1, 0.72, 0.88][i % 3]);
    d.style.setProperty("--d", (i * 0.35).toFixed(2) + "s");
    d.innerHTML = roseSVG();
    wr.appendChild(d);
  }
  const cv = document.getElementById("hcv"), ctx = cv.getContext("2d");
  const cols = ["#be123c", "#e11d48", "#fb7185", "#fda4af", "#9f1239", "#ffc2d6"];
  let W, H, ps = [];
  const setup = () => {
    W = cv.width = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
    const n = innerWidth < 768 ? 16 : 34;
    ps = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, s: 7 + Math.random() * 10,
      vy: 0.35 + Math.random() * 0.8, vx: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.03, w: Math.random() * 6.28,
      c: cols[Math.floor(Math.random() * cols.length)], a: 0.45 + Math.random() * 0.45,
    }));
  };
  new ResizeObserver(setup).observe(cv.parentElement);
  setup();
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    ps.forEach((p) => {
      p.y += p.vy; p.w += 0.02; p.x += p.vx + Math.sin(p.w) * 0.5; p.r += p.vr;
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.7, 0, p.s);
      ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  })();
})();

/* NAME STAGGER */
const hn = document.getElementById("hname");
[
  { t: "Amu", c: "gld" },
].forEach(({ t, c }) =>
  [...t].forEach((ch) => {
    const s = document.createElement("span");
    s.className = "hc " + c;
    s.textContent = ch;
    hn.appendChild(s);
  }),
);
window.revealName = () =>
  hn.querySelectorAll(".hc").forEach((el, i) =>
    setTimeout(() => el.classList.add("on"), 800 + i * 100));

/* WAVE CANVAS */
(() => {
  const cv = document.getElementById("wcv");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  let W, H, t = 0;
  const sz = () => {
    W = cv.width = cv.offsetWidth * devicePixelRatio;
    H = cv.height = 80 * devicePixelRatio;
    cv.style.height = "80px";
  };
  window.addEventListener("resize", sz);
  sz();
  const layers = [
    { a: 0.38, f: 0.016, sp: 0.034, c: "rgba(192,132,255," },
    { a: 0.27, f: 0.025, sp: 0.053, c: "rgba(232,121,249," },
    { a: 0.17, f: 0.011, sp: 0.027, c: "rgba(167,139,250," },
  ];
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    layers.forEach((l) => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = H / 2 + Math.sin(x * l.f + t * l.sp) * H * l.a +
          Math.sin(x * l.f * 0.6 + t * l.sp * 0.7) * H * l.a * 0.34;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = l.c + ".68)";
      ctx.lineWidth = 1.6;
      ctx.stroke();
    });
    t++;
    requestAnimationFrame(draw);
  })();
})();

/* TICKER */
(() => {
  const tk = document.getElementById("ticker");
  if (!tk) return;
  ["✦ Amu","♪ Singer ♪","✦ Born to Shine","♬ Happy Birthday",
   "✦ The Stage is Yours","🎤 Your Voice Our Joy","♩ Melodies & Memories",
   "✦ Forever Our Star","🌸 With Love","♫ Keep Singing"]
    .flatMap((p) => [p, p, p])
    .forEach((t) => {
      const s = document.createElement("span");
      s.className = "titem";
      s.innerHTML = t.replace(/Amu/g, "<b>Amu</b>");
      tk.appendChild(s);
    });
})();

/* ROSE PHOTO SECTIONS */
(() => {
  // dividers
  document.querySelectorAll(".rosediv").forEach((el) => {
    el.innerHTML = [0, 1, 2].map(() => `<i>${roseSVG()}</i>`).join("");
  });
  // 1) Rose Garden arches
  const ag = document.getElementById("archgrid");
  [[0, "Velvet Red"], [2, "Sweet Blush"], [9, "Soft Petal"], [7, "Golden Hour"], [11, "Garden Girl"], [16, "Pure Bloom"]].forEach(([i, cap]) => {
    const a = document.createElement("div");
    a.className = "arch";
    a.innerHTML = `<div class="archrose">${roseSVG()}</div><div class="arch-in"><img src="${TH[i]}" alt="Amu" loading="lazy"/></div><div class="archcap">${cap} 🌹</div>`;
    a.onclick = () => openLB(i);
    ag.appendChild(a);
  });
  // 2) Rose reels (two rows, opposite directions)
  [["reel1", [1, 5, 6, 10, 13, 15, 7, 0]], ["reel2", [16, 11, 2, 9, 13, 0, 15, 5]]].forEach(([id, list]) => {
    const tr = document.createElement("div");
    tr.className = "rtrack";
    [...list, ...list].forEach((i) => {
      const d = document.createElement("div");
      d.className = "ritem";
      d.innerHTML = `<img src="${TH[i]}" alt="Amu" loading="lazy"/><span>🌹</span>`;
      d.onclick = () => openLB(i);
      tr.appendChild(d);
    });
    document.getElementById(id).appendChild(tr);
  });
  // 3) Petals of Wishes (flip cards)
  const wg = document.getElementById("wishgrid");
  [[0, "Like a rose, you make every place more beautiful."], [5, "May your life bloom with endless joy, Amu."],
   [6, "Your smile is the prettiest flower in any garden."], [10, "Soft like petals, strong like thorns — that's you."],
   [13, "May every day of this year smell like roses."], [15, "You deserve a whole garden full of happiness."],
   [2, "Stay beautiful, stay you — always."], [16, "Happy Birthday, my rose! 🌹"]].forEach(([i, t]) => {
    const c = document.createElement("div");
    c.className = "wcard";
    c.innerHTML = `<div class="wi"><div class="wf"><img src="${TH[i]}" alt="Amu" loading="lazy"/><span class="wtap">🌹 TAP</span></div><div class="wb"><div class="wbrose">${roseSVG()}</div><p>${t}</p></div></div>`;
    c.onclick = () => c.classList.toggle("flip");
    wg.appendChild(c);
  });
})();

/* SOUND CANVAS */
(() => {
  const cv = document.getElementById("scv"),
    ctx = cv.getContext("2d");
  let W,
    H,
    t = 0;
  const sz = () => {
    W = cv.width = cv.offsetWidth * devicePixelRatio;
    H = cv.height = 100 * devicePixelRatio;
    cv.style.height = "100px";
  };
  window.addEventListener("resize", sz);
  sz();
  const N = 54;
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    const bw = W / N;
    for (let i = 0; i < N; i++) {
      const h =
        (Math.sin(i * 0.2 + t * 0.07) + 1.1) *
        0.48 *
        H *
        (Math.sin(i * 0.08 + t * 0.05) * 0.3 + 0.72);
      const x = i * bw + bw * 0.2,
        bww = bw * 0.62,
        by = H / 2 - h / 2,
        r = Math.min(4, h / 2);
      const grd = ctx.createLinearGradient(x, by, x, by + h);
      grd.addColorStop(0, "rgba(192,132,255,.95)");
      grd.addColorStop(0.45, "rgba(232,121,249,.8)");
      grd.addColorStop(1, "rgba(192,132,255,.95)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(x + r, by);
      ctx.lineTo(x + bww - r, by);
      ctx.quadraticCurveTo(x + bww, by, x + bww, by + r);
      ctx.lineTo(x + bww, by + h - r);
      ctx.quadraticCurveTo(x + bww, by + h, x + bww - r, by + h);
      ctx.lineTo(x + r, by + h);
      ctx.quadraticCurveTo(x, by + h, x, by + h - r);
      ctx.lineTo(x, by + r);
      ctx.quadraticCurveTo(x, by, x + r, by);
      ctx.closePath();
      ctx.fill();
    }
    t++;
    requestAnimationFrame(draw);
  })();
})();

/* LIGHTBOX */
let lbI = 0;
const lb = document.getElementById("lb"),
  lbimg = document.getElementById("lbimg"),
  lbcnt = document.getElementById("lbcnt");
lbimg.style.transition = "opacity .2s";
function openLB(i) {
  lbI = i;
  lbimg.src = IMGS[i];
  lbcnt.textContent = `${i + 1} / ${IMGS.length}`;
  lb.classList.add("on");
}
function moveLB(d) {
  lbI = (lbI + d + IMGS.length) % IMGS.length;
  lbimg.style.opacity = 0;
  setTimeout(() => {
    lbimg.src = IMGS[lbI];
    lbcnt.textContent = `${lbI + 1} / ${IMGS.length}`;
    lbimg.style.opacity = 1;
  }, 180);
}
document.getElementById("lbx").onclick = () => lb.classList.remove("on");
document.getElementById("lbprev").onclick = (e) => {
  e.stopPropagation();
  moveLB(-1);
};
document.getElementById("lbnext").onclick = (e) => {
  e.stopPropagation();
  moveLB(1);
};
lb.addEventListener("click", (e) => {
  if (e.target === lb) lb.classList.remove("on");
});
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("on")) return;
  if (e.key === "Escape") lb.classList.remove("on");
  if (e.key === "ArrowLeft") moveLB(-1);
  if (e.key === "ArrowRight") moveLB(1);
});
let ts = 0;
lb.addEventListener(
  "touchstart",
  (e) => {
    ts = e.touches[0].clientX;
  },
  { passive: true },
);
lb.addEventListener(
  "touchend",
  (e) => {
    const d = ts - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) moveLB(d > 0 ? 1 : -1);
  },
  { passive: true },
);

/* CONFETTI */
(() => {
  const cv = document.getElementById("cfc"),
    ctx = cv.getContext("2d");
  const r = () => {
    cv.width = innerWidth;
    cv.height = innerHeight;
  };
  r();
  window.addEventListener("resize", r);
  const pieces = [],
    cols = [
      "#f472a0",
      "#ffc2d6",
      "#fb7185",
      "#ffb3c6",
      "#fda4af",
      "#fda4af",
      "#f472a0",
      "#fff4f7",
    ];
  const spawn = () => {
    for (let i = 0; i < 200; i++)
      pieces.push({
        x: Math.random() * cv.width,
        y: -15,
        vx: (Math.random() - 0.5) * 6,
        vy: 2.5 + Math.random() * 4,
        rot: Math.random() * 360,
        rv: (Math.random() - 0.5) * 11,
        w: 5 + Math.random() * 9,
        h: 3 + Math.random() * 5,
        color: cols[Math.floor(Math.random() * cols.length)],
        life: 1,
        decay: 0.005 + Math.random() * 0.004,
      });
  };
  window.startConfetti = () => {
    setTimeout(spawn, 300);
    setTimeout(spawn, 1300);
    setTimeout(spawn, 2600);
  };
  (function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.rot += p.rv;
      p.life -= p.decay;
      if (p.life <= 0 || p.y > cv.height + 20) {
        pieces.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    requestAnimationFrame(draw);
  })();
})();

/* SPARK CARDS — TILT + GLOW + SHIMMER */
document.querySelectorAll(".sparkcard").forEach((card) => {
  const gl = document.createElement("div");
  gl.className = "card-glow";
  const sh = document.createElement("div");
  sh.className = "card-shimmer";
  card.prepend(sh);
  card.prepend(gl);
  let raf = null;
  card.addEventListener(
    "mousemove",
    (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        const rx = ((y - 0.5) * -13).toFixed(2),
          ry = ((x - 0.5) * 13).toFixed(2);
        card.style.transform = `perspective(720px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
        gl.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
        gl.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      });
    },
    { passive: true },
  );
  card.addEventListener("mouseleave", () => {
    if (raf) cancelAnimationFrame(raf);
    card.style.transform = "";
  });
});

/* SCROLL REVEAL */
const io = new IntersectionObserver(
  (ens) => {
    ens.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("vis");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ══════════════════════════════════════════════
   GLOBAL BACKGROUND PALETTE
   Unified pure purple mix
   ══════════════════════════════════════════════ */
(() => {
  const blobs = document.querySelectorAll(".mesh-blob");
  const PURPLE_PALETTE = {
    blobs: [
      [190, 24, 80, 0.16],    // deep purple
      [120, 10, 45, 0.16],     // dark violet
      [236, 72, 120, 0.11],    // bright purple
      [255, 120, 150, 0.08],    // violet
      [150, 20, 60, 0.15],    // dark magenta
    ],
    particles: [
      { r: 255, g: 120, b: 160 },  // bright purple
      { r: 255, g: 170, b: 190 }, // light purple
      { r: 225, g: 50, b: 100 },  // mid violet
      { r: 255, g: 190, b: 205 }, // pinkish purple
      { r: 251, g: 113, b: 133 }, // magenta
    ]
  };

  window.targetParticleColors = PURPLE_PALETTE.particles;

  blobs.forEach((blob, i) => {
    const [r, g, b, a] = PURPLE_PALETTE.blobs[i];
    blob.style.backgroundColor = `rgba(${r},${g},${b},${a})`;
  });

  /* ══════════════════════════════════════
     GLOBAL FLOATING PARTICLES
     (with per-section color lerping)
     ══════════════════════════════════════ */
  const cv = document.getElementById("globeParticles"),
    ctx = cv.getContext("2d");
  let W, H;
  const particles = [];
  const stars = [];

  const resize = () => {
    W = cv.width = innerWidth;
    H = cv.height = innerHeight;
    
    // Generate stars
    stars.length = 0;
    const starDensity = window.innerWidth < 768 ? 15000 : 6000;
    const starCount = Math.floor((W * H) / starDensity); 
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.02
      });
    }
  };
  resize();
  window.addEventListener("resize", resize);

  const COUNT = Math.min(60, Math.floor((innerWidth * innerHeight) / 22000));
  const EMOJIS = ["🌹", "🌸", "💗", "🌷", "🌺", "✨"];

  for (let i = 0; i < COUNT; i++) {
    const c = window.targetParticleColors[Math.floor(Math.random() * 5)];
    const isEmoji = Math.random() < 0.25; // 25% chance to be an emoji
    particles.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.08 - Math.random() * 0.18,
      r: Math.random() * 2 + 0.5,
      baseAlpha: 0.15 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.012,
      color: { r: c.r, g: c.g, b: c.b },
      targetColor: { r: c.r, g: c.g, b: c.b },
      colorIndex: i % 5,
      drift: (Math.random() - 0.5) * 0.0004,
      emoji: isEmoji ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : null,
      fontSize: isEmoji ? 20 + Math.random() * 15 : null
    });
  }

  // Lerp helper
  const lerp = (a, b, t) => a + (b - a) * t;
  const COLOR_LERP_SPEED = 0.012;

  let t = 0;
  (function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw twinkling stars
    ctx.save();
    ctx.fillStyle = "#ffffff";
    for (const s of stars) {
      const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    for (const p of particles) {
      // Update target color from current palette
      const tc = targetParticleColors[p.colorIndex];
      p.targetColor.r = tc.r;
      p.targetColor.g = tc.g;
      p.targetColor.b = tc.b;

      // Lerp current color toward target
      p.color.r = lerp(p.color.r, p.targetColor.r, COLOR_LERP_SPEED);
      p.color.g = lerp(p.color.g, p.targetColor.g, COLOR_LERP_SPEED);
      p.color.b = lerp(p.color.b, p.targetColor.b, COLOR_LERP_SPEED);

      p.x += p.vx + Math.sin(t * 0.02 + p.phase) * 0.12;
      p.y += p.vy;
      p.vx += p.drift;
      p.phase += p.speed;

      // Wrap around
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      const alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(p.phase));

      if (p.emoji) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, alpha * 2.5); // Make emojis more opaque
        ctx.font = `${p.fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Subtle glow for emoji
        ctx.shadowColor = "rgba(255,255,255,0.4)";
        ctx.shadowBlur = 10;
        ctx.fillText(p.emoji, p.x, p.y);
        ctx.restore();
      } else {
        const cr = Math.round(p.color.r);
        const cg = Math.round(p.color.g);
        const cb = Math.round(p.color.b);

        // Glow
        ctx.save();
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = `rgba(${cr},${cg},${cb},1)`;
        ctx.shadowColor = `rgba(${cr},${cg},${cb},0.8)`;
        ctx.shadowBlur = p.r * 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Core
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgba(${cr},${cg},${cb},1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    t++;
    requestAnimationFrame(draw);
  })();
})();




/* STARS — STACKING CARDS: shrink + dim cards as the next one covers them */
(() => {
  const cards = [...document.querySelectorAll(".chapters .chap")];
  if (!cards.length) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) { card.style.setProperty("--s", 1); card.style.setProperty("--b", 1); return; }
      const nTop = next.getBoundingClientRect().top;
      const cTop = card.getBoundingClientRect().top;
      const h = card.offsetHeight || 1;
      // 0 when next card is a full card-height below, 1 once it has landed on top
      const p = Math.min(1, Math.max(0, 1 - (nTop - cTop) / h));
      card.style.setProperty("--s", (1 - p * 0.05).toFixed(4));
      card.style.setProperty("--b", (1 - p * 0.35).toFixed(3));
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
