#!/usr/bin/env python3
import base64, glob, os

# ---------- frames -> data URIs ----------
frames = sorted(glob.glob("frames/f_*.jpg"))
uris = []
for f in frames:
    with open(f, "rb") as fh:
        uris.append("data:image/jpeg;base64," + base64.b64encode(fh.read()).decode("ascii"))
N = len(uris)
frames_js = "[\n" + ",\n".join('"%s"' % u for u in uris) + "\n]"

# ---------- 1) SCROLL-SCRUB FILE ----------
HTML = r"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AETHER — Above the Weather</title>
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&family=Martian+Mono:wght@400;500&display=swap');
:root{--ink:#0E0D0C;--cream:#EDE6D8;--muted:#9A9084;--accent:#E39A4A;--rule:rgba(237,230,216,.16);--ease:cubic-bezier(.16,1,.3,1);--disp:'Cormorant Garamond',Georgia,serif;--sans:'Jost',sans-serif;--mono:'Martian Mono',monospace}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--cream);font-family:var(--sans);font-weight:300;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.wrap{max-width:1500px;margin:0 auto;padding:0 clamp(20px,5vw,80px)}
.mono{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}
.mono b{color:var(--accent);font-weight:500}
a{color:inherit}::selection{background:var(--accent);color:var(--ink)}
a:focus-visible{outline:2px solid var(--accent);outline-offset:5px}
.prog{position:fixed;top:0;left:0;height:2px;width:0;background:var(--accent);z-index:200}
header{position:fixed;top:0;left:0;right:0;z-index:150;mix-blend-mode:difference}
.bar{display:flex;align-items:center;justify-content:space-between;height:76px}
.logo{font-family:var(--disp);font-size:24px;letter-spacing:.42em;padding-left:.42em;color:#fff}
nav{display:flex;gap:38px}
nav a{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;color:#fff;opacity:.85}
.coord{font-family:var(--mono);font-size:11px;letter-spacing:.18em;color:#fff;opacity:.7}
@media(max-width:820px){nav,.coord{display:none}}
.seq{height:640vh;position:relative}
.seq .pin{position:sticky;top:0;height:100vh;overflow:hidden;background:var(--ink)}
#seqCanvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.seq .veil{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,rgba(14,13,12,.5),rgba(14,13,12,.02) 30%,rgba(14,13,12,.15) 60%,rgba(14,13,12,.9))}
.seq .grain{position:absolute;inset:0;z-index:2;opacity:.05;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.seq .layer{position:absolute;inset:0;z-index:3;display:flex;align-items:flex-end;padding-bottom:clamp(64px,12vh,150px)}
.title{will-change:opacity,transform}
.title .kick{margin-bottom:24px}
.title h1{font-family:var(--disp);font-weight:300;font-size:clamp(3.2rem,11vw,10rem);line-height:.96;letter-spacing:-.01em}
.title h1 em{font-style:italic;color:var(--accent)}
.title .sub{max-width:38ch;margin-top:26px;opacity:.9;font-size:clamp(1rem,1.4vw,1.25rem)}
.caps{position:absolute;inset:0;z-index:3;display:flex;align-items:center;pointer-events:none}
.cap{position:absolute;left:0;right:0;opacity:0;transform:translateY(22px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.cap.on{opacity:1;transform:none}
.cap .n{margin-bottom:20px}
.cap p{font-family:var(--disp);font-weight:300;font-size:clamp(2rem,5.6vw,4.4rem);line-height:1.12;max-width:19ch;letter-spacing:-.01em}
.seqbar{position:absolute;left:clamp(20px,5vw,80px);bottom:52px;height:1px;width:min(38vw,340px);background:var(--rule);z-index:4}
.seqbar i{display:block;height:100%;width:0;background:var(--accent)}
.cue{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);z-index:4;display:flex;flex-direction:column;align-items:center;gap:10px;will-change:opacity}
.cue .t{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--cream);opacity:.85}
.cue .ln{width:1px;height:44px;background:linear-gradient(var(--accent),transparent);animation:drop 2.4s var(--ease) infinite}
@keyframes drop{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
.loading{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;background:var(--ink);transition:opacity .6s ease}
.loading .mono{color:var(--muted)}
.mani{padding:clamp(120px,20vh,220px) 0;border-top:1px solid var(--rule)}
.mani .big{font-family:var(--disp);font-weight:300;font-size:clamp(2.2rem,6.4vw,5.4rem);line-height:1.08;max-width:16ch;letter-spacing:-.015em}
.mani .big em{font-style:italic;color:var(--accent)}
.mani .stats{display:flex;gap:clamp(30px,6vw,90px);margin-top:80px;flex-wrap:wrap}
.mani .stat .v{font-family:var(--disp);font-weight:300;font-size:clamp(2.4rem,5vw,4rem);line-height:1}
.mani .stat .k{margin-top:12px}
.rise{opacity:0;transform:translateY(30px);transition:opacity 1s var(--ease),transform 1s var(--ease)}
.rise.in{opacity:1;transform:none}
.cta{padding:clamp(90px,16vh,180px) 0;border-top:1px solid var(--rule);text-align:center}
.cta .mono{margin-bottom:34px}
.cta a.big{font-family:var(--disp);font-weight:300;font-size:clamp(3rem,13vw,11rem);line-height:.9;letter-spacing:-.02em;text-decoration:none;color:var(--cream);display:inline-block;transition:color .5s var(--ease)}
.cta a.big em{font-style:italic}
.cta a.big:hover{color:var(--accent)}
.cta a.big .arw{display:inline-block;transition:transform .5s var(--ease)}
.cta a.big:hover .arw{transform:translate(16px,-16px)}
.cta .row{margin-top:44px;display:flex;gap:38px;justify-content:center;flex-wrap:wrap}
footer{border-top:1px solid var(--rule);padding:44px 0 56px}
.fg{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;align-items:flex-end}
.fg .logo{font-size:20px;color:var(--cream)}.fg .col{line-height:1.9}
body.reduced .cue .ln{animation:none}
body.reduced .rise{opacity:1;transform:none}
</style></head><body>
<div class="prog" id="prog" aria-hidden="true"></div>
<header><div class="wrap bar">
  <div class="logo">AETHER</div>
  <nav><a href="#design">The Houses</a><a href="#design">Design</a><a href="#enquire">Enquire</a></nav>
  <div class="coord">46.5&deg;N / 7.9&deg;E</div>
</div></header>
<section class="seq" id="seq" aria-label="Cinematic dawn sequence scrubbed by scroll">
  <div class="pin">
    <canvas id="seqCanvas" role="img" aria-label="Modernist cliff house at dawn as fog drifts through the valley"></canvas>
    <div class="veil"></div><div class="grain"></div>
    <div class="layer title" id="title"><div class="wrap">
      <div class="kick mono"><b>01</b> &nbsp; Architectural retreats &nbsp;&mdash;&nbsp; Above the cloud line</div>
      <h1>Live above<br>the <em>weather.</em></h1>
      <p class="sub">A small collection of remote houses, built where the map runs out and the noise stops.</p>
    </div></div>
    <div class="caps"><div class="wrap" style="position:relative;width:100%">
      <div class="cap" data-a="0.24" data-b="0.44"><div class="n mono"><b>&mdash;</b> Sited</div><p>Concrete, glass, and a thousand metres of silence.</p></div>
      <div class="cap" data-a="0.50" data-b="0.70"><div class="n mono"><b>&mdash;</b> Light</div><p>Placed to the light, never to the plot line.</p></div>
      <div class="cap" data-a="0.76" data-b="0.98"><div class="n mono"><b>&mdash;</b> Arrival</div><p>You arrive as a guest of the landscape.</p></div>
    </div></div>
    <div class="seqbar"><i id="seqBar"></i></div>
    <div class="cue" id="cue"><span class="t">Scroll to play</span><span class="ln"></span></div>
    <div class="loading" id="loading"><span class="mono">Loading sequence &middot; <span id="pct">0</span>%</span></div>
  </div>
</section>
<section class="mani" id="design"><div class="wrap">
  <div class="big rise">We build <em>fewer than four</em> houses a year, and we are in no hurry to change that.</div>
  <div class="stats">
    <div class="stat rise"><div class="v">04</div><div class="k mono">Houses / year</div></div>
    <div class="stat rise"><div class="v">1,842 m</div><div class="k mono">Mean elevation</div></div>
    <div class="stat rise"><div class="v">11 yrs</div><div class="k mono">Average build</div></div>
    <div class="stat rise"><div class="v">&infin;</div><div class="k mono">Horizon</div></div>
  </div>
</div></section>
<section class="cta" id="enquire"><div class="wrap">
  <div class="mono rise"><b>02</b> &mdash; Reservations open, Winter 2026</div>
  <a class="big" href="mailto:stay@aether.haus">Enquire <em>within</em> <span class="arw">&#8599;</span></a>
  <div class="row mono rise"><span>stay@aether.haus</span><span>Valais &middot; Switzerland</span></div>
</div></section>
<footer><div class="wrap fg">
  <div class="logo">AETHER</div>
  <div class="col mono">Architectural retreats<br>46.5&deg;N / 7.9&deg;E</div>
  <div class="col mono">&copy; 2026<br>Built above the weather</div>
</div></footer>
<script>
const F = __FRAMES__; const N = F.length;
(function(){
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(reduce) document.body.classList.add('reduced'); // soften ambient bits only; scroll-scrub stays (user-driven)
  const canvas=document.getElementById('seqCanvas'), ctx=canvas.getContext('2d');
  const seq=document.getElementById('seq'), pin=seq.querySelector('.pin');
  const title=document.getElementById('title'), cue=document.getElementById('cue');
  const seqBar=document.getElementById('seqBar'), prog=document.getElementById('prog');
  const loading=document.getElementById('loading'), pct=document.getElementById('pct');
  const caps=[].slice.call(document.querySelectorAll('.seq .cap'));
  const imgs=new Array(N); let loaded=0, hidden=false;
  function hide(){ if(hidden)return; hidden=true; loading.style.opacity='0'; setTimeout(()=>loading.style.display='none',600); }
  for(let i=0;i<N;i++){ const im=new Image(); im.decoding='async';
    im.onload=()=>{ loaded++; if(pct)pct.textContent=Math.round(loaded/N*100);
      if(loaded===1){ resize(); draw(0); }
      if(loaded>=Math.min(N,10)) hide(); };
    im.onerror=()=>{ loaded++; if(loaded>=Math.min(N,10)) hide(); };
    im.src=F[i]; imgs[i]=im; }
  setTimeout(hide,3500); // safety: never trap behind the loader
  let dpr=1, curIdx=-1;
  function resize(){ dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.round(pin.clientWidth*dpr); canvas.height=Math.round(pin.clientHeight*dpr);
    const im=imgs[curIdx<0?0:curIdx]; if(im&&im.complete&&im.naturalWidth) blit(im); }
  function blit(im){ const cw=canvas.width,ch=canvas.height,iw=im.naturalWidth,ih=im.naturalHeight;
    const s=Math.max(cw/iw,ch/ih),w=iw*s,h=ih*s; ctx.drawImage(im,(cw-w)/2,(ch-h)/2,w,h); }
  function draw(idx){ const im=imgs[idx]; if(im&&im.complete&&im.naturalWidth){ blit(im); curIdx=idx; } }
  const clamp=v=>v<0?0:v>1?1:v, lerp=(a,b,t)=>a+(b-a)*t;
  addEventListener('resize',resize);
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.16,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rise').forEach(el=>io.observe(el));
  function frame(){
    const y=window.scrollY||window.pageYOffset;
    const docH=document.documentElement.scrollHeight-innerHeight;
    prog.style.width=clamp(y/docH)*100+'%';
    const p=clamp((y-seq.offsetTop)/(seq.offsetHeight-innerHeight));
    const idx=Math.min(N-1,Math.round(p*(N-1)));
    if(idx!==curIdx) draw(idx);
    const tp=clamp(p/0.16);
    title.style.opacity=String(1-tp); title.style.transform='translateY('+lerp(0,-50,tp)+'px)';
    cue.style.opacity=String(clamp(1-p*7)); seqBar.style.width=(p*100)+'%';
    for(let i=0;i<caps.length;i++){const c=caps[i];const a=+c.dataset.a,b=+c.dataset.b;c.classList.toggle('on',p>=a&&p<=b);}
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
</script></body></html>
"""
with open("aether-scroll-sequence.html","w") as f:
    f.write(HTML.replace("__FRAMES__", frames_js))
print("scroll-sequence bytes:", os.path.getsize("aether-scroll-sequence.html"))

# ---------- 2) AUTOPLAY VIDEO-BACKGROUND FILE (self-contained) ----------
with open("aether-motion.mp4","rb") as fh:
    vid_uri = "data:video/mp4;base64," + base64.b64encode(fh.read()).decode("ascii")

AUTO = r"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AETHER — Above the Weather</title>
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&family=Martian+Mono:wght@400;500&display=swap');
:root{--ink:#0E0D0C;--cream:#EDE6D8;--muted:#9A9084;--accent:#E39A4A;--disp:'Cormorant Garamond',Georgia,serif;--sans:'Jost',sans-serif;--mono:'Martian Mono',monospace}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--ink);color:var(--cream);font-family:var(--sans);font-weight:300;height:100vh;overflow:hidden}
.stage{position:fixed;inset:0}
video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,13,12,.5),rgba(14,13,12,.03) 30%,rgba(14,13,12,.15) 60%,rgba(14,13,12,.9))}
.bar{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;height:76px;padding:0 clamp(20px,5vw,80px);mix-blend-mode:difference}
.logo{font-family:var(--disp);font-size:24px;letter-spacing:.42em;padding-left:.42em;color:#fff}
.coord{font-family:var(--mono);font-size:11px;letter-spacing:.18em;color:#fff;opacity:.75}
.copy{position:absolute;left:0;right:0;bottom:0;padding:0 clamp(20px,5vw,80px) clamp(56px,11vh,120px)}
.kick{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);margin-bottom:24px}
.kick b{color:var(--accent);font-weight:500}
h1{font-family:var(--disp);font-weight:300;font-size:clamp(3rem,11vw,10rem);line-height:.96;letter-spacing:-.01em}
h1 em{font-style:italic;color:var(--accent)}
.sub{max-width:40ch;margin-top:24px;opacity:.9}
</style></head><body>
<div class="stage">
  <video autoplay muted loop playsinline><source src="__VID__" type="video/mp4"></video>
  <div class="veil"></div>
  <div class="bar"><div class="logo">AETHER</div><div class="coord">46.5&deg;N / 7.9&deg;E</div></div>
  <div class="copy">
    <div class="kick"><b>01</b> &nbsp; Architectural retreats &nbsp;&mdash;&nbsp; Above the cloud line</div>
    <h1>Live above the <em>weather.</em></h1>
    <p class="sub">A small collection of remote houses, built where the map runs out and the noise stops.</p>
  </div>
</div>
</body></html>
"""
with open("aether-cinematic.html","w") as f:
    f.write(AUTO.replace("__VID__", vid_uri))
print("autoplay bytes:", os.path.getsize("aether-cinematic.html"))
