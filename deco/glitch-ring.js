/* ═══════════════════════════════════════════════
   TuZhi Deco — glitch-ring
   Glitchy pixel ring around avatar
   Inspired by: chromatic aberration + VHS glitch
   NO rotation — static ring with glitch bursts
   ═══════════════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160, H=160, CX=80, CY=80, R=58;

  /* ── GLITCH BLOCK POOL ──
     Coloured rectangles that pop in/out around the ring */
  const COLORS = [
    '#ffffff','#ff00ff','#ff44aa','#aa00ff',
    '#ffdd00','#ff4400','#00ccff','#44ff88',
    '#ff88cc','#cc44ff','#ffffaa','#ff6666',
  ];

  function makeBlock() {
    const angle  = Math.random() * Math.PI * 2;
    const spread = 4 + Math.random() * 14;  /* distance from ring edge */
    const side   = Math.random() < 0.55 ? 1 : -1; /* inside or outside */
    return {
      angle,
      r     : R + side * spread,
      w     : 3  + Math.random() * 14,
      h     : 3  + Math.random() * 20,
      color : COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha : 0.5 + Math.random() * 0.5,
      life  : 0,
      maxLife: 6 + Math.floor(Math.random() * 18),
      rot   : (Math.random() - 0.5) * 0.6,  /* slight tilt */
    };
  }

  let blocks = Array.from({length: 40}, makeBlock);

  /* ── SCAN LINE DATA ── */
  const scanLines = Array.from({length: 6}, () => ({
    y      : CY - R + Math.random() * R * 2,
    width  : 20 + Math.random() * 60,
    alpha  : 0.05 + Math.random() * 0.12,
    speed  : (Math.random() - 0.5) * 0.4,
    color  : COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  /* ── CHROMATIC OFFSET STATE ── */
  let glitchIntensity = 0;
  let glitchTimer     = 0;
  let nextGlitch      = 30 + Math.random() * 60;

  /* ── RING GLOW PULSE ── */
  let glowPulse = 0;

  let t = 0, raf;

  /* ── HELPERS ── */
  /* Point on ring at given radius & angle */
  function ringXY(angle, r) {
    return [CX + Math.cos(angle) * r, CY + Math.sin(angle) * r];
  }

  /* Draw white glowing base ring */
  function drawBaseRing(blur, alpha, width, color) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.strokeStyle = color || '#ffffff';
    ctx.lineWidth   = width || 5;
    ctx.shadowColor = color || '#ffffff';
    ctx.shadowBlur  = blur  || 28;
    ctx.globalAlpha = alpha || 0.9;
    ctx.stroke();
    ctx.restore();
  }

  /* Draw one glitch block anchored to ring */
  function drawBlock(b, glitchOff) {
    const [bx, by] = ringXY(b.angle, b.r);
    const prog  = b.life / b.maxLife;
    /* fade in fast, hold, fade out */
    const alpha = prog < 0.2
      ? (prog / 0.2) * b.alpha
      : prog > 0.75
        ? ((1 - prog) / 0.25) * b.alpha
        : b.alpha;

    ctx.save();
    ctx.translate(bx + (glitchOff || 0), by);
    ctx.rotate(b.rot);
    ctx.fillStyle   = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur  = 10;
    ctx.globalAlpha = alpha;
    ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
    ctx.restore();
  }

  /* ── MAIN DRAW ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;
    glowPulse = 0.75 + 0.25 * Math.sin(t * 0.04);

    /* ─── trigger glitch burst ─── */
    glitchTimer++;
    if(glitchTimer >= nextGlitch) {
      glitchIntensity = 6 + Math.random() * 8;
      glitchTimer     = 0;
      nextGlitch      = 20 + Math.random() * 80;
      /* spawn extra blocks on burst */
      for(let i=0;i<12;i++) blocks.push(makeBlock());
    }
    glitchIntensity *= 0.82;  /* decay */

    /* ─── outer purple atmospheric glow ─── */
    const outerGlow = ctx.createRadialGradient(CX,CY,R-12,CX,CY,R+22);
    outerGlow.addColorStop(0,   'rgba(180,50,255,0.35)');
    outerGlow.addColorStop(0.5, 'rgba(120,0,200,0.18)');
    outerGlow.addColorStop(1,   'rgba(80,0,160,0)');
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R+22,0,Math.PI*2);
    ctx.fillStyle = outerGlow;
    ctx.globalAlpha = glowPulse;
    ctx.fill();
    ctx.restore();

    /* ─── inner glow ─── */
    const innerGlow = ctx.createRadialGradient(CX,CY,R-18,CX,CY,R+2);
    innerGlow.addColorStop(0,  'rgba(220,160,255,0.22)');
    innerGlow.addColorStop(1,  'rgba(120,0,200,0)');
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R+2,0,Math.PI*2);
    ctx.fillStyle = innerGlow;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.restore();

    /* ─── chromatic rings (RGB split) ─── */
    const off = glitchIntensity * 0.4;
    /* red channel */
    ctx.save();
    ctx.beginPath(); ctx.arc(CX - off*0.6, CY, R, 0, Math.PI*2);
    ctx.strokeStyle='#ff0055'; ctx.lineWidth=4;
    ctx.shadowColor='#ff0055'; ctx.shadowBlur=18;
    ctx.globalAlpha=0.35 + glitchIntensity*0.02;
    ctx.stroke(); ctx.restore();
    /* blue channel */
    ctx.save();
    ctx.beginPath(); ctx.arc(CX + off*0.6, CY, R, 0, Math.PI*2);
    ctx.strokeStyle='#00ccff'; ctx.lineWidth=4;
    ctx.shadowColor='#00ccff'; ctx.shadowBlur=18;
    ctx.globalAlpha=0.35 + glitchIntensity*0.02;
    ctx.stroke(); ctx.restore();

    /* ─── main white ring (layered for thick bright look) ─── */
    drawBaseRing(40, 0.25 * glowPulse, 14, '#cc88ff');
    drawBaseRing(20, 0.55 * glowPulse, 8,  '#ffffff');
    drawBaseRing(8,  0.90,             4,  '#ffffff');

    /* ─── glitch blocks ─── */
    const gOff = glitchIntensity > 1 ? (Math.random()-0.5)*glitchIntensity : 0;
    blocks.forEach(b => {
      b.life++;
      if(b.life > b.maxLife) {
        /* respawn */
        Object.assign(b, makeBlock());
        b.life = 0;
      }
      drawBlock(b, gOff * (Math.random() < 0.3 ? 1 : 0));
    });

    /* ─── scanline stripes inside ring during glitch ─── */
    if(glitchIntensity > 2) {
      const lines = 3 + Math.floor(glitchIntensity * 0.5);
      for(let i=0;i<lines;i++){
        const sy   = CY - R + Math.random() * R * 2;
        const sw   = (10 + Math.random() * 80);
        const sx   = CX - sw/2 + (Math.random()-0.5)*20;
        const col  = COLORS[Math.floor(Math.random()*COLORS.length)];
        ctx.save();
        ctx.fillStyle   = col;
        ctx.shadowColor = col;
        ctx.shadowBlur  = 6;
        ctx.globalAlpha = 0.07 + Math.random()*0.1;
        ctx.fillRect(sx, sy - 1, sw, 1 + Math.random()*3);
        ctx.restore();
      }
    }

    /* ─── persistent dim scan lines ─── */
    scanLines.forEach(sl => {
      sl.y += sl.speed;
      if(sl.y < CY - R) sl.y = CY + R;
      if(sl.y > CY + R) sl.y = CY - R;
      ctx.save();
      ctx.fillStyle   = sl.color;
      ctx.globalAlpha = sl.alpha;
      ctx.fillRect(CX - sl.width/2, sl.y, sl.width, 1);
      ctx.restore();
    });

    /* ─── bright flare dots on ring at glitch peaks ─── */
    if(glitchIntensity > 3) {
      const nFlares = Math.floor(glitchIntensity * 0.8);
      for(let i=0;i<nFlares;i++){
        const fa  = Math.random() * Math.PI * 2;
        const [fx,fy] = ringXY(fa, R + (Math.random()-0.5)*4);
        ctx.save();
        ctx.beginPath(); ctx.arc(fx, fy, 1.5+Math.random()*3, 0, Math.PI*2);
        ctx.fillStyle   = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur  = 16;
        ctx.globalAlpha = 0.6 + Math.random()*0.4;
        ctx.fill();
        ctx.restore();
      }
    }

    window._decoRaf = raf = requestAnimationFrame(draw);
  }

  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
                             
