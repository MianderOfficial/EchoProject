import { PresentationProject } from '../types/presentation';

export function generateStandaloneHtml(project: PresentationProject): string {
  const jsonProject = JSON.stringify(project);

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title} | Команда «Эхо»</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Unbounded:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Manrope', 'sans-serif'],
            display: ['Unbounded', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Manrope', sans-serif; background: #061220; color: #F8FAFC; margin: 0; overflow: hidden; }
    .font-display { font-family: 'Unbounded', sans-serif; }
    @media print {
      @page { size: 297mm 167mm; margin: 0; }
      body { background: #0B192C !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 flex flex-col h-screen select-none">
  <!-- Top Bar -->
  <header class="no-print h-14 bg-slate-950/95 border-b border-slate-800 px-6 flex items-center justify-between z-40">
    <div class="flex items-center gap-3">
      <svg width="34" height="34" viewBox="0 0 200 200">
        <circle cx="75" cy="100" r="65" fill="#0F4C81" />
        <circle cx="125" cy="100" r="65" fill="#38B6B6" />
        <clipPath id="lclip"><circle cx="75" cy="100" r="65" /></clipPath>
        <g clip-path="url(#lclip)"><circle cx="125" cy="100" r="65" fill="#1A7C9B" opacity="0.95" /></g>
        <text x="100" y="126" text-anchor="middle" fill="#FFFFFF" font-size="74" font-weight="900" font-family="'Manrope', sans-serif">E</text>
      </svg>
      <div>
        <span class="font-display font-black text-sm text-white">ЭХО</span>
        <span class="text-xs text-slate-400 ml-2 hidden sm:inline">${project.title}</span>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <div id="slideCounter" class="font-mono text-xs text-cyan-400">Слайд 1 / ${project.slides.length}</div>
      <button onclick="toggleFullscreen()" class="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-semibold hover:bg-cyan-900 transition-colors">Полноэкранный показ (F5)</button>
      <button onclick="window.print()" class="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs hover:bg-slate-800 transition-colors">Печать / PDF</button>
    </div>
  </header>

  <!-- Slide Canvas Viewport -->
  <main class="flex-1 flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#061220] via-[#091A2E] to-[#040C16]">
    <!-- Animated background soundwaves canvas -->
    <canvas id="bgCanvas" class="absolute inset-0 w-full h-full pointer-events-none opacity-80"></canvas>

    <div id="slideContainer" class="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl relative bg-slate-900/60 backdrop-blur-md z-10">
      <!-- Active slide dynamically injected here -->
    </div>

    <!-- Floating Navigation Arrows -->
    <button onclick="prevSlide()" class="no-print absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/80 text-white border border-slate-800 hover:border-cyan-500 shadow-xl transition-all z-20">◀</button>
    <button onclick="nextSlide()" class="no-print absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/80 text-white border border-slate-800 hover:border-cyan-500 shadow-xl transition-all z-20">▶</button>
  </main>

  <!-- Bottom Thumbnails -->
  <footer class="no-print h-20 bg-slate-950 border-t border-slate-800/80 px-4 flex items-center gap-2 overflow-x-auto z-30" id="thumbStrip"></footer>

  <script>
    const project = ${jsonProject};
    let currentIndex = 0;

    // Background Wave Canvas
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let t = 0;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function renderWaves() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.02;
      const h = canvas.height;
      const w = canvas.width;

      // Draw waves
      const waves = [
        { stroke: 'rgba(15, 76, 129, 0.5)', fill: 'rgba(15, 76, 129, 0.08)', amp: 45, speed: 0.015, freq: 0.006 },
        { stroke: 'rgba(56, 182, 182, 0.7)', fill: 'rgba(56, 182, 182, 0.06)', amp: 65, speed: 0.02, freq: 0.012 },
        { stroke: 'rgba(72, 202, 228, 0.85)', fill: 'transparent', amp: 55, speed: 0.025, freq: 0.016 },
      ];

      waves.forEach((wv, idx) => {
        ctx.beginPath();
        ctx.strokeStyle = wv.stroke;
        ctx.lineWidth = 2;
        ctx.fillStyle = wv.fill;
        ctx.moveTo(0, h);
        ctx.lineTo(0, h * 0.65);
        for (let x = 0; x <= w; x += 10) {
          const y = h * 0.65 + Math.sin(x * wv.freq + t * wv.speed * 20 + idx) * wv.amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        if (wv.fill !== 'transparent') ctx.fill();
        ctx.stroke();
      });

      requestAnimationFrame(renderWaves);
    }
    renderWaves();

    function renderThumbnails() {
      const strip = document.getElementById('thumbStrip');
      strip.innerHTML = project.slides.map((s, idx) => \`
        <div onclick="goToSlide(\${idx})" class="shrink-0 w-28 h-14 rounded-lg border-2 \${idx === currentIndex ? 'border-cyan-400 bg-slate-900 shadow-md shadow-cyan-950' : 'border-slate-800 bg-slate-950 opacity-60'} p-1.5 cursor-pointer flex flex-col justify-between transition-all">
          <div class="text-[9px] font-mono text-cyan-400">\${idx + 1} · \${s.type}</div>
          <div class="text-[10px] font-semibold text-white truncate">\${s.title}</div>
        </div>
      \`).join('');
    }

    function renderSlide() {
      const s = project.slides[currentIndex];
      document.getElementById('slideCounter').innerText = 'Слайд ' + (currentIndex + 1) + ' / ' + project.slides.length;
      const container = document.getElementById('slideContainer');
      const p = s.payload || {};

      let bodyHtml = '';

      if (s.type === 'title') {
        bodyHtml = \`
          <div class="grid grid-cols-12 gap-8 items-center my-auto">
            <div class="col-span-7">
              <div class="text-cyan-400 text-sm uppercase font-semibold mb-2">● \${s.subtitle || 'Социальный проект'}</div>
              <h1 class="font-display font-black text-4xl sm:text-5xl text-white mb-4 leading-tight">\${s.title}</h1>
              <p class="text-sm text-slate-300 leading-relaxed">\${p.leadQuote || 'Создаем гармоничный комфорт в учебном пространстве'}</p>
            </div>
            <div class="col-span-5 flex justify-center">
              <div class="w-48 h-48 rounded-full border border-cyan-400/30 flex items-center justify-center p-8 bg-cyan-950/40 relative">
                <div class="w-32 h-32 rounded-full border border-cyan-400/50 flex items-center justify-center">
                  <span class="font-display font-black text-4xl text-cyan-300">E</span>
                </div>
              </div>
            </div>
          </div>
        \`;
      } else if (s.type === 'agenda') {
        const steps = p.steps || [];
        bodyHtml = \`
          <div class="grid grid-cols-5 gap-3 my-auto py-8">
            \${steps.map((st, i) => \`
              <div onclick="goToSlide(\${i + 2})" class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400 text-center cursor-pointer transition-all">
                <div class="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-mono text-xs flex items-center justify-center mx-auto mb-2">\${st.number || '0' + (i+1)}</div>
                <div class="font-display font-bold text-xs text-white mb-1">\${st.title}</div>
                <div class="text-[10px] text-slate-400 leading-tight">\${st.desc || ''}</div>
              </div>
            \`).join('')}
          </div>
        \`;
      } else if (s.type === 'team') {
        const members = p.members || [];
        const lead = members[0];
        const rest = members.slice(1);
        bodyHtml = \`
          <div class="grid grid-cols-12 gap-4 my-auto">
            \${lead ? \`
              <div class="col-span-4 p-5 rounded-2xl bg-gradient-to-b from-[#0F4C81] to-[#08213B] border-2 border-cyan-400/80 flex flex-col justify-between shadow-xl">
                <div>
                  <span class="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-mono font-bold uppercase">Капитан команды</span>
                  <div class="font-display font-black text-lg text-white mt-3">\${lead.name}</div>
                  <div class="text-xs font-bold text-cyan-300">\${lead.role}</div>
                  <p class="text-xs text-slate-200 mt-2 leading-snug">\${lead.bio || ''}</p>
                </div>
                <div class="text-[10px] font-mono text-cyan-200 pt-2 border-t border-cyan-400/30">Команда «Эхо» · Лидер</div>
              </div>
            \` : ''}
            <div class="col-span-8 grid grid-cols-3 gap-3">
              \${rest.map(m => \`
                <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div class="font-display font-bold text-xs text-white truncate">\${m.name}</div>
                  <div class="text-[10px] font-semibold text-cyan-400 truncate">\${m.role}</div>
                  <p class="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">\${m.bio || ''}</p>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      } else if (s.type === 'smart-goal') {
        const pillars = p.pillars || [];
        bodyHtml = \`
          <div class="space-y-4 my-auto">
            <div class="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-sm text-slate-200">\${p.mainStatement || ''}</div>
            <div class="grid grid-cols-5 gap-3">
              \${pillars.map(pi => \`
                <div class="rounded-xl p-4 bg-slate-900/80 border border-slate-800 text-center">
                  <div class="font-display font-black text-3xl text-cyan-400 mb-1">\${pi.letter}</div>
                  <div class="text-xs font-bold text-white mb-1">\${pi.nameRu}</div>
                  <div class="text-[11px] text-slate-400 leading-tight">\${pi.description}</div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      } else if (s.type === 'audience') {
        const stats = p.stats || [];
        bodyHtml = \`
          <div class="grid grid-cols-3 gap-4 my-auto">
            \${stats.map(st => \`
              <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div class="font-display font-black text-4xl text-cyan-400 mb-1">\${st.value}</div>
                <div class="text-xs font-bold text-slate-300 mb-1">\${st.tag || 'Аудитория'}</div>
                <div class="text-xs text-slate-400 leading-snug">\${st.label}</div>
              </div>
            \`).join('')}
          </div>
        \`;
      } else if (s.type === 'social-impact') {
        const cards = p.impactCards || [];
        bodyHtml = \`
          <div class="grid grid-cols-4 gap-4 my-auto">
            \${cards.map(c => \`
              <div class="p-6 rounded-2xl bg-gradient-to-b from-[#1A7C9B] to-[#0A2E4E] text-white border border-cyan-400/30 flex flex-col justify-between shadow-xl">
                <div>
                  <div class="font-display font-black text-5xl text-cyan-300 mb-2">\${c.value}</div>
                  <div class="font-bold text-base mb-1">\${c.title}</div>
                </div>
                <div class="text-xs text-slate-200 leading-snug">\${c.desc}</div>
              </div>
            \`).join('')}
          </div>
        \`;
      } else {
        bodyHtml = \`
          <div class="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20 text-slate-200 my-auto">
            <div class="text-sm leading-relaxed">\${JSON.stringify(p, null, 2).replace(/["{}]/g, '')}</div>
          </div>
        \`;
      }

      container.innerHTML = \`
        <div class="w-full h-full p-8 md:p-12 flex flex-col justify-between relative text-white">
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs uppercase font-mono tracking-widest text-cyan-400 mb-1">КОМАНДА «ЭХО» · \${s.type.toUpperCase()}</div>
              <h1 class="font-display font-black text-2xl md:text-4xl text-white tracking-tight">\${s.title}</h1>
              <p class="text-xs md:text-sm text-slate-300 mt-0.5 max-w-xl">\${s.subtitle || ''}</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center font-display font-black text-cyan-300 text-base">E</div>
          </div>

          \${bodyHtml}

          <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>КОМАНДА «ЭХО» · УНИВЕРСИТЕТСКИЙ ПРОЕКТ</span>
            <span>СЛАЙД \${currentIndex + 1} / \${project.slides.length}</span>
          </div>
        </div>
      \`;

      renderThumbnails();
    }

    function goToSlide(idx) { currentIndex = idx; renderSlide(); }
    function nextSlide() { if (currentIndex < project.slides.length - 1) { currentIndex++; renderSlide(); } }
    function prevSlide() { if (currentIndex > 0) { currentIndex--; renderSlide(); } }
    function toggleFullscreen() {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
    });

    renderSlide();
  </script>
</body>
</html>`;
}
