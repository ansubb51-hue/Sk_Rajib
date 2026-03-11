/* ═══════════════════════════════════════════════
   TuZhi Deco — spooky-ring
   Spooky-cute creature ring — no rotation
   Glowing pulse + light sparkle animation only
   ═══════════════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160, H=160, CX=80, CY=80;

  /* ── PALETTE ── */
  const D  = '#150b13';   /* dark body */
  const D2 = '#1f0e1a';   /* slightly lighter dark */
  const PK = '#ff3399';   /* main pink */
  const PK2= '#ff77bb';   /* light pink */
  const PK3= '#ffaad4';   /* very light pink highlight */
  const WH = '#ffffff';

  let t=0, raf;

  /* ── HELPERS ── */
  const f = (color,blur,alpha) => {
    ctx.fillStyle   = color;
    ctx.shadowColor = color;
    ctx.shadowBlur  = blur||0;
    ctx.globalAlpha = alpha||1;
  };
  const s = (color,w,blur,alpha) => {
    ctx.strokeStyle = color;
    ctx.lineWidth   = w||1;
    ctx.shadowColor = color;
    ctx.shadowBlur  = blur||0;
    ctx.globalAlpha = alpha||1;
  };

  /* draw X-eye at (x,y) size r */
  function xEye(x,y,r,glow){
    /* eye white circle */
    ctx.save();
    f(PK2, 8*glow, 1);
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    /* X marks */
    ctx.strokeStyle=D; ctx.lineWidth=r*0.55; ctx.lineCap='round';
    ctx.shadowBlur=0; ctx.globalAlpha=1;
    const o=r*0.55;
    ctx.beginPath(); ctx.moveTo(x-o,y-o); ctx.lineTo(x+o,y+o); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+o,y-o); ctx.lineTo(x-o,y+o); ctx.stroke();
    ctx.restore();
  }

  /* dot eye at (x,y) */
  function dotEye(x,y,r,glow){
    ctx.save();
    f(PK2,6*glow,1); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    f(D,0,1);        ctx.beginPath(); ctx.arc(x,y,r*0.45,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  /* pink drip from (x,y) going down length l */
  function drip(x,y,l,w,glow){
    ctx.save();
    f(PK, 5*glow, 0.7);
    ctx.beginPath();
    ctx.moveTo(x-w,y);
    ctx.quadraticCurveTo(x-w*1.5, y+l*0.5, x, y+l);
    ctx.quadraticCurveTo(x+w*1.5, y+l*0.5, x+w, y);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  /* ══════════════════════════════════════════
     CREATURE DRAW FUNCTIONS
     All coordinated to 160×160 canvas
  ═════════════════════════════════════════════ */

  /* ── A: BAT-CAT creature (left side, 8–10 o'clock) ── */
  function drawBatCat(g){
    ctx.save();
    ctx.shadowColor = PK; ctx.shadowBlur = 10*g;

    /* main dark body blob */
    f(D, 8*g, 1);
    ctx.beginPath();
    ctx.moveTo(22,52);
    ctx.bezierCurveTo(14,38, 20,22, 32,18);   /* left ear point */
    ctx.bezierCurveTo(38,14, 45,20, 46,28);   /* top of head */
    ctx.bezierCurveTo(54,20, 62,22, 60,32);   /* right part head */
    ctx.bezierCurveTo(66,38, 62,50, 55,56);   /* right cheek */
    ctx.bezierCurveTo(55,65, 48,72, 40,70);   /* chin */
    ctx.bezierCurveTo(30,74, 18,66, 22,52);   /* left side */
    ctx.fill();

    /* left wing/ear spike */
    f(D, 4, 1);
    ctx.beginPath();
    ctx.moveTo(22,52);
    ctx.bezierCurveTo(10,55, 4,46, 8,34);
    ctx.bezierCurveTo(10,26, 18,22, 22,30);
    ctx.bezierCurveTo(16,38, 18,48, 22,52);
    ctx.fill();

    /* inner ear pink */
    f(PK, 6*g, 0.8);
    ctx.beginPath();
    ctx.moveTo(24,48);
    ctx.bezierCurveTo(16,50, 10,44, 14,36);
    ctx.bezierCurveTo(16,30, 22,28, 24,34);
    ctx.bezierCurveTo(20,40, 20,46, 24,48);
    ctx.fill();

    /* right ear spike */
    f(D, 4, 1);
    ctx.beginPath();
    ctx.moveTo(46,28);
    ctx.bezierCurveTo(48,16, 52,8, 58,12);
    ctx.bezierCurveTo(62,14, 62,22, 60,28);
    ctx.bezierCurveTo(56,24, 50,24, 46,28);
    ctx.fill();

    /* pink ear inner */
    f(PK, 5*g, 0.75);
    ctx.beginPath();
    ctx.moveTo(48,26);
    ctx.bezierCurveTo(50,18, 54,12, 58,14);
    ctx.bezierCurveTo(60,16, 60,22, 58,26);
    ctx.bezierCurveTo(55,22, 50,22, 48,26);
    ctx.fill();

    /* skull/face on body — pink teeth + eyes */
    /* pink skull face */
    f(PK, 6*g, 0.6);
    ctx.beginPath(); ctx.arc(40,45, 10, 0, Math.PI*2); ctx.fill();
    f(D2, 0, 1);
    ctx.beginPath(); ctx.arc(40,45, 8, 0, Math.PI*2); ctx.fill();

    /* skull eye X */
    xEye(36, 43, 3, g);
    xEye(44, 43, 3, g);

    /* pink drips below body */
    drip(35, 68, 8, 2, g);
    drip(42, 70, 6, 1.5, g);

    /* small pink heart near left */
    f(PK, 6*g, 0.7);
    ctx.beginPath();
    ctx.moveTo(16,72);
    ctx.bezierCurveTo(16,69, 12,68, 12,71);
    ctx.bezierCurveTo(12,74, 16,77, 16,77);
    ctx.bezierCurveTo(16,77, 20,74, 20,71);
    ctx.bezierCurveTo(20,68, 16,69, 16,72);
    ctx.fill();

    ctx.restore();
  }

  /* ── B: SKULL HEAD (top, 11–12 o'clock) ── */
  function drawSkullHead(g){
    ctx.save();

    /* dripping mass connecting left to skull */
    f(D, 6*g, 1);
    ctx.beginPath();
    ctx.moveTo(55,28);
    ctx.bezierCurveTo(58,18, 64,14, 72,16);
    ctx.bezierCurveTo(80,14, 86,20, 84,28);
    ctx.bezierCurveTo(82,36, 76,38, 72,36);
    ctx.bezierCurveTo(66,38, 58,36, 55,28);
    ctx.fill();

    /* skull cranium */
    f(D, 8*g, 1);
    ctx.beginPath(); ctx.arc(71,22, 11, 0, Math.PI*2); ctx.fill();

    /* jaw / lower skull */
    f(D, 5*g, 1);
    ctx.beginPath();
    ctx.moveTo(62,25);
    ctx.bezierCurveTo(61,32, 64,38, 71,38);
    ctx.bezierCurveTo(78,38, 81,32, 80,25);
    ctx.bezierCurveTo(76,30, 66,30, 62,25);
    ctx.fill();

    /* teeth */
    f(PK2, 4*g, 0.9);
    for(let i=0;i<3;i++){
      ctx.beginPath();
      ctx.moveTo(64+i*5.5, 30);
      ctx.lineTo(65.5+i*5.5, 35);
      ctx.lineTo(67+i*5.5, 30);
      ctx.fill();
    }

    /* X eyes */
    xEye(66, 21, 4, g);
    xEye(76, 21, 4, g);

    /* pink crack */
    ctx.save();
    s(PK, 1, 4*g, 0.7);
    ctx.beginPath();
    ctx.moveTo(71,14); ctx.lineTo(70,10); ctx.lineTo(72,6);
    ctx.stroke();
    ctx.restore();

    /* connecting drip to right */
    f(D, 5*g, 1);
    ctx.beginPath();
    ctx.moveTo(82,24);
    ctx.bezierCurveTo(90,18, 96,20, 98,26);
    ctx.bezierCurveTo(96,30, 90,30, 82,28);
    ctx.fill();

    ctx.restore();
  }

  /* ── C: FLOATING EYEBALL (top-right, 1 o'clock) ── */
  function drawEyeball(g, g2){
    ctx.save();
    const ex=108, ey=22, er=11;
    const pulse = 0.92 + 0.08*Math.sin(t*0.04 + 1);

    /* eyeball outer */
    f(WH, 10*g2, 0.9);
    ctx.beginPath(); ctx.arc(ex,ey,er*pulse,0,Math.PI*2); ctx.fill();

    /* pink iris */
    f(PK, 8*g, 0.85);
    ctx.beginPath(); ctx.arc(ex,ey,er*0.65*pulse,0,Math.PI*2); ctx.fill();

    /* dark pupil */
    f(D, 0, 1);
    ctx.beginPath(); ctx.arc(ex,ey,er*0.3*pulse,0,Math.PI*2); ctx.fill();

    /* white highlight */
    f(WH, 0, 0.9);
    ctx.beginPath(); ctx.arc(ex-3*pulse,ey-3*pulse,er*0.18,0,Math.PI*2); ctx.fill();

    /* X vein lines in pink */
    ctx.save();
    s(PK2, 0.8, 3*g2, 0.5);
    ctx.beginPath();
    ctx.moveTo(ex-er*0.9, ey-2); ctx.lineTo(ex-er*0.45, ey+2);
    ctx.moveTo(ex+er*0.5, ey-4); ctx.lineTo(ex+er*0.85, ey+3);
    ctx.moveTo(ex-2, ey-er*0.85); ctx.lineTo(ex+3, ey-er*0.4);
    ctx.stroke();
    ctx.restore();

    /* small stem at bottom */
    f(PK, 4*g, 0.6);
    ctx.beginPath();
    ctx.moveTo(ex-2, ey+er*0.9);
    ctx.bezierCurveTo(ex-3, ey+er+4, ex+3, ey+er+6, ex+2, ey+er+2);
    ctx.closePath(); ctx.fill();

    ctx.restore();
  }

  /* ── D: MAIN GHOST (right side, 2–3 o'clock) ── */
  function drawGhost(g){
    ctx.save();

    /* ghost body */
    f(D, 8*g, 1);
    ctx.beginPath();
    ctx.moveTo(122,42);
    ctx.bezierCurveTo(130,36, 138,40, 138,50);
    ctx.bezierCurveTo(138,62, 132,70, 126,72);
    ctx.bezierCurveTo(120,68, 114,62, 112,54);
    ctx.bezierCurveTo(110,46, 114,40, 122,42);
    ctx.fill();

    /* ghost wavy bottom */
    f(D, 5*g, 1);
    ctx.beginPath();
    ctx.moveTo(112,66);
    ctx.bezierCurveTo(112,72, 116,76, 118,73);
    ctx.bezierCurveTo(120,76, 124,78, 126,74);
    ctx.bezierCurveTo(128,78, 132,76, 132,70);
    ctx.fill();

    /* X eyes */
    xEye(120, 52, 4.5, g);
    xEye(130, 50, 4.5, g);

    /* pink rosy cheeks */
    f(PK, 4*g, 0.35);
    ctx.beginPath(); ctx.arc(117,58,4,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(133,56,4,0,Math.PI*2); ctx.fill();

    /* connecting arc to top-right */
    f(D, 5*g, 1);
    ctx.beginPath();
    ctx.moveTo(122,42);
    ctx.bezierCurveTo(116,34, 112,26, 106,26);
    ctx.bezierCurveTo(100,24, 96,28, 98,36);
    ctx.bezierCurveTo(104,32, 114,36, 122,42);
    ctx.fill();

    ctx.restore();
  }

  /* ── E: SMALL GHOST (right-bottom, 4 o'clock) ── */
  function drawSmallGhost(g){
    ctx.save();

    /* small ghost body */
    f(D, 7*g, 1);
    ctx.beginPath();
    ctx.moveTo(120,88);
    ctx.bezierCurveTo(126,82, 132,86, 132,94);
    ctx.bezierCurveTo(132,102, 128,108, 122,106);
    ctx.bezierCurveTo(116,104, 112,98, 114,91);
    ctx.bezierCurveTo(115,87, 118,86, 120,88);
    ctx.fill();

    /* wavy bottom */
    f(D, 4*g, 1);
    ctx.beginPath();
    ctx.moveTo(113,102);
    ctx.bezierCurveTo(113,108, 117,110, 119,107);
    ctx.bezierCurveTo(121,110, 125,109, 125,105);
    ctx.fill();

    /* X eye */
    xEye(120, 94, 3.5, g);
    xEye(128, 92, 3.5, g);

    /* pink dot on forehead */
    f(PK2, 5*g, 0.6);
    ctx.beginPath(); ctx.arc(124,86,2.5,0,Math.PI*2); ctx.fill();

    /* connecting blob */
    f(D, 4*g, 1);
    ctx.beginPath();
    ctx.moveTo(120,88);
    ctx.bezierCurveTo(120,80, 124,76, 128,76);
    ctx.bezierCurveTo(134,76, 136,80, 134,86);
    ctx.bezierCurveTo(130,84, 124,84, 120,88);
    ctx.fill();

    ctx.restore();
  }

  /* ── F: CAT creature (bottom, 6–7 o'clock) ── */
  function drawCat(g){
    ctx.save();

    /* cat body */
    f(D, 8*g, 1);
    ctx.beginPath();
    ctx.moveTo(58,124);
    ctx.bezierCurveTo(52,118, 50,108, 56,102);
    ctx.bezierCurveTo(62,96, 72,96, 78,100);
    ctx.bezierCurveTo(86,96, 94,98, 96,106);
    ctx.bezierCurveTo(100,112, 96,122, 90,126);
    ctx.bezierCurveTo(84,130, 72,132, 64,128);
    ctx.bezierCurveTo(60,127, 58,126, 58,124);
    ctx.fill();

    /* left ear */
    f(D, 5*g, 1);
    ctx.beginPath();
    ctx.moveTo(56,104);
    ctx.bezierCurveTo(52,96, 48,90, 52,86);
    ctx.bezierCurveTo(56,84, 60,88, 60,96);
    ctx.bezierCurveTo(58,100, 56,102, 56,104);
    ctx.fill();
    f(PK, 4*g, 0.7);
    ctx.beginPath();
    ctx.moveTo(57,102);
    ctx.bezierCurveTo(54,96, 52,92, 54,89);
    ctx.bezierCurveTo(56,87, 59,90, 59,96);
    ctx.fill();

    /* right ear */
    f(D, 5*g, 1);
    ctx.beginPath();
    ctx.moveTo(92,100);
    ctx.bezierCurveTo(94,92, 98,86, 102,88);
    ctx.bezierCurveTo(106,90, 104,98, 100,102);
    ctx.bezierCurveTo(98,100, 94,100, 92,100);
    ctx.fill();
    f(PK, 4*g, 0.7);
    ctx.beginPath();
    ctx.moveTo(93,100);
    ctx.bezierCurveTo(95,93, 98,88, 101,90);
    ctx.bezierCurveTo(103,92, 102,98, 99,101);
    ctx.fill();

    /* dot eyes */
    dotEye(67, 110, 4.5, g);
    dotEye(80, 109, 4.5, g);

    /* pink nose */
    f(PK, 6*g, 0.85);
    ctx.beginPath();
    ctx.moveTo(73,116); ctx.lineTo(71,119); ctx.lineTo(75,119);
    ctx.closePath(); ctx.fill();

    /* pink drips */
    drip(62,126,8,2,g);
    drip(76,130,6,2,g);
    drip(88,124,7,2,g);

    /* tail curling left */
    f(D, 6*g, 1);
    ctx.beginPath();
    ctx.moveTo(58,124);
    ctx.bezierCurveTo(46,128, 38,136, 42,144);
    ctx.bezierCurveTo(46,152, 56,150, 58,142);
    ctx.bezierCurveTo(60,136, 56,130, 58,124);
    ctx.fill();

    /* pink tip of tail */
    f(PK, 7*g, 0.7);
    ctx.beginPath();
    ctx.moveTo(52,144);
    ctx.bezierCurveTo(48,148, 50,154, 56,152);
    ctx.bezierCurveTo(60,150, 60,144, 56,142);
    ctx.fill();

    ctx.restore();
  }

  /* ── G: DARK CONNECTING MASS (bottom-left + left-center) ── */
  function drawDarkMass(g){
    ctx.save();

    /* lower-left blob */
    f(D, 7*g, 1);
    ctx.beginPath();
    ctx.moveTo(28,96);
    ctx.bezierCurveTo(20,90, 16,80, 20,70);
    ctx.bezierCurveTo(22,62, 28,58, 34,60);
    ctx.bezierCurveTo(38,56, 44,56, 46,62);
    ctx.bezierCurveTo(50,68, 48,76, 44,82);
    ctx.bezierCurveTo(48,86, 46,96, 38,100);
    ctx.bezierCurveTo(32,102, 28,100, 28,96);
    ctx.fill();

    /* skull-face on mass */
    f(PK, 5*g, 0.5);
    ctx.beginPath(); ctx.arc(36,76,8,0,Math.PI*2); ctx.fill();
    f(D2,0,1);
    ctx.beginPath(); ctx.arc(36,76,6,0,Math.PI*2); ctx.fill();
    xEye(32,74,2.8,g);
    xEye(40,74,2.8,g);

    /* teeth row */
    f(PK2, 3*g, 0.8);
    for(let i=0;i<3;i++){
      ctx.beginPath();
      ctx.moveTo(30+i*4, 79);
      ctx.lineTo(31+i*4, 83);
      ctx.lineTo(32+i*4, 79);
      ctx.fill();
    }

    /* connecting drip up-left toward bat creature */
    f(D, 5*g, 1);
    ctx.beginPath();
    ctx.moveTo(32,62);
    ctx.bezierCurveTo(28,56, 28,48, 32,44);
    ctx.bezierCurveTo(34,40, 38,40, 40,44);
    ctx.bezierCurveTo(38,50, 34,56, 32,62);
    ctx.fill();

    /* small pink X blob */
    f(PK, 5*g, 0.55);
    ctx.beginPath(); ctx.arc(24,88,5,0,Math.PI*2); ctx.fill();
    f(D2,0,1);
    ctx.beginPath(); ctx.arc(24,88,3.5,0,Math.PI*2); ctx.fill();
    xEye(24,88,2,g);

    /* connecting bottom to cat */
    f(D, 5*g, 1);
    ctx.beginPath();
    ctx.moveTo(36,98);
    ctx.bezierCurveTo(38,108, 44,116, 52,118);
    ctx.bezierCurveTo(48,112, 40,104, 36,98);
    ctx.fill();

    ctx.restore();
  }

  /* ── LIGHT SPARKLES around ring ── */
  function drawSparkles(t, g){
    const sparkPos = [
      {a:-0.8, r:75}, {a:0.4, r:72}, {a:1.2, r:74},
      {a:2.1, r:73}, {a:3.0, r:76}, {a:4.2, r:72},
      {a:5.1, r:74}, {a:5.8, r:73},
    ];
    sparkPos.forEach((sp,i)=>{
      const pulse = 0.3 + 0.7*Math.abs(Math.sin(t*0.04 + i*0.8));
      if(pulse < 0.45) return;  /* only show sometimes */
      const x = CX + Math.cos(sp.a)*sp.r;
      const y = CY + Math.sin(sp.a)*sp.r;
      ctx.save();
      f(PK3, 8*g, pulse*0.7);
      ctx.beginPath(); ctx.arc(x,y,1.5,0,Math.PI*2); ctx.fill();
      f(WH, 4, pulse*0.9);
      ctx.beginPath(); ctx.arc(x,y,0.7,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
  }

  /* ── MAIN LOOP ── */
  function draw(){
    ctx.clearRect(0,0,W,H);
    t++;
    const g  = 0.75 + 0.25*Math.sin(t*0.035);
    const g2 = 0.6  + 0.4 *Math.sin(t*0.028 + 2.1);

    /* overall pink atmosphere */
    const rad = ctx.createRadialGradient(CX,CY,32,CX,CY,80);
    rad.addColorStop(0,   'rgba(0,0,0,0)');
    rad.addColorStop(0.75,`rgba(210,50,130,${0.06*g})`);
    rad.addColorStop(1,   `rgba(160,30,100,${0.14*g})`);
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,80,0,Math.PI*2);
    ctx.fillStyle=rad; ctx.globalAlpha=1; ctx.fill();
    ctx.restore();

    /* draw all elements */
    drawBatCat(g);
    drawSkullHead(g);
    drawEyeball(g, g2);
    drawGhost(g);
    drawSmallGhost(g2);
    drawCat(g);
    drawDarkMass(g);
    drawSparkles(t, g2);

    window._decoRaf = raf = requestAnimationFrame(draw);
  }

  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();

