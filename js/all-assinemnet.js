AOS.init();

const themeToggle = document.getElementById('themeToggle');
const themeToggleIcon = document.querySelector('.theme-toggle-icon');
const themeToggleText = document.querySelector('.theme-toggle-text');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeToggle) {
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    if (themeToggleIcon) {
        themeToggleIcon.className = theme === 'dark'
            ? 'fas fa-moon theme-toggle-icon'
            : 'fas fa-sun theme-toggle-icon';
    }

    if (themeToggleText) {
        themeToggleText.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
}

const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

applyTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', function () {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

// Plexus background animation
(() => {
    const canvas = document.getElementById('plexus-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let width = 0;
    let height = 0;
    let rafId = 0;
    let particles = [];

    const state = {
        pointerX: 0,
        pointerY: 0,
        currentX: 0,
        currentY: 0,
        initializedPointer: false,
        colorBlend: 0,
        colorIndex: 0,
        nextColorIndex: 1,
        lastTs: 0
    };

    const CONFIG = {
        virtualW: 1920,
        virtualH: 1080,
        connectDistance: 200,
        dotMin: 1.4,
        dotMax: 3.6,
        speedMin: 0.14,
        speedMax: 0.36,
        colorShiftSpeed: 0.0012,
        pointerLerp: 0.05,
        pointerInfluence: 0.03
    };

    function hexToRgb(hex) {
        const clean = hex.replace('#', '').trim();
        const full = clean.length === 3
            ? clean.split('').map((c) => c + c).join('')
            : clean;

        const r = parseInt(full.slice(0, 2), 16);
        const g = parseInt(full.slice(2, 4), 16);
        const b = parseInt(full.slice(4, 6), 16);
        return { r, g, b };
    }

    function rgbString({ r, g, b }) {
        return `rgb(${r}, ${g}, ${b})`;
    }

    function rgbaString({ r, g, b }, a) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    function mixRgb(a, b, t) {
        return {
            r: Math.round(a.r + (b.r - a.r) * t),
            g: Math.round(a.g + (b.g - a.g) * t),
            b: Math.round(a.b + (b.b - a.b) * t)
        };
    }

    function getThemePalettes() {
        const styles = getComputedStyle(document.documentElement);
        const primary = styles.getPropertyValue('--primary').trim() || '#6e45e2';
        const secondary = styles.getPropertyValue('--secondary').trim() || '#88d3ce';

        const p = hexToRgb(primary);
        const s = hexToRgb(secondary);

        return [
            mixRgb(p, s, 0.15),
            mixRgb(p, s, 0.45),
            mixRgb(p, s, 0.75),
            mixRgb(p, { r: 214, g: 245, b: 255 }, 0.5),
            mixRgb(s, { r: 176, g: 255, b: 242 }, 0.55)
        ];
    }

    let palette = getThemePalettes();

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            const xMax = CONFIG.virtualW;
            const yMax = CONFIG.virtualH;

            this.x = initial ? Math.random() * xMax : (Math.random() < 0.5 ? -20 : xMax + 20);
            this.y = initial ? Math.random() * yMax : Math.random() * yMax;

            const speed = CONFIG.speedMin + Math.random() * (CONFIG.speedMax - CONFIG.speedMin);
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.r = CONFIG.dotMin + Math.random() * (CONFIG.dotMax - CONFIG.dotMin);
            this.bias = Math.random() * Math.PI * 2;
            this.driftAmp = 0.12 + Math.random() * 0.25;
            this.driftSpeed = 0.0004 + Math.random() * 0.0008;
        }

        update(pointerNx, pointerNy, ts) {
            const wave = Math.sin(ts * this.driftSpeed + this.bias);
            const swirl = Math.cos(ts * this.driftSpeed * 0.85 + this.bias);

            this.x += this.vx + pointerNx * CONFIG.pointerInfluence + wave * this.driftAmp;
            this.y += this.vy + pointerNy * CONFIG.pointerInfluence + swirl * this.driftAmp;

            if (this.x < -30) this.x = CONFIG.virtualW + 30;
            if (this.x > CONFIG.virtualW + 30) this.x = -30;
            if (this.y < -30) this.y = CONFIG.virtualH + 30;
            if (this.y > CONFIG.virtualH + 30) this.y = -30;
        }

        sx() {
            return (this.x / CONFIG.virtualW) * width;
        }

        sy() {
            return (this.y / CONFIG.virtualH) * height;
        }
    }

    function getParticleCount() {
        if (reduceMotionQuery.matches) return 36;
        if (window.innerWidth <= 480) return 46;
        if (window.innerWidth <= 768) return 58;
        return 84;
    }

    function resetParticles() {
        const count = getParticleCount();
        particles = Array.from({ length: count }, () => new Particle());
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        resetParticles();

        if (!state.initializedPointer) {
            state.pointerX = width * 0.5;
            state.pointerY = height * 0.5;
            state.currentX = state.pointerX;
            state.currentY = state.pointerY;
            state.initializedPointer = true;
        }
    }

    function updatePointer(clientX, clientY) {
        state.pointerX = clientX;
        state.pointerY = clientY;
    }

    function tick(ts) {
        if (!state.lastTs) state.lastTs = ts;
        const dt = ts - state.lastTs;
        state.lastTs = ts;

        const normalizedDt = Math.min(Math.max(dt, 8), 34);

        state.currentX += (state.pointerX - state.currentX) * CONFIG.pointerLerp;
        state.currentY += (state.pointerY - state.currentY) * CONFIG.pointerLerp;

        const nx = ((state.currentX / Math.max(width, 1)) * 2 - 1) * 0.9;
        const ny = ((state.currentY / Math.max(height, 1)) * 2 - 1) * 0.9;

        state.colorBlend += CONFIG.colorShiftSpeed * normalizedDt;
        if (state.colorBlend >= 1) {
            state.colorBlend = 0;
            state.colorIndex = state.nextColorIndex;
            state.nextColorIndex = (state.nextColorIndex + 1) % palette.length;
        }

        const currentColor = mixRgb(
            palette[state.colorIndex],
            palette[state.nextColorIndex],
            state.colorBlend
        );

        const accentColor = mixRgb(
            palette[state.nextColorIndex],
            palette[(state.nextColorIndex + 1) % palette.length],
            state.colorBlend * 0.45
        );

        ctx.clearRect(0, 0, width, height);

        const washA = ctx.createRadialGradient(
            width * 0.18,
            height * 0.2,
            0,
            width * 0.18,
            height * 0.2,
            width * 0.9
        );
        washA.addColorStop(0, rgbaString(currentColor, 0.11));
        washA.addColorStop(0.45, rgbaString(accentColor, 0.045));
        washA.addColorStop(1, 'rgba(4, 8, 20, 0.02)');
        ctx.fillStyle = washA;
        ctx.fillRect(0, 0, width, height);

        const washB = ctx.createRadialGradient(
            width * 0.82,
            height * 0.85,
            0,
            width * 0.82,
            height * 0.85,
            width * 0.85
        );
        washB.addColorStop(0, rgbaString(accentColor, 0.07));
        washB.addColorStop(1, 'rgba(4, 8, 20, 0)');
        ctx.fillStyle = washB;
        ctx.fillRect(0, 0, width, height);

        const maxDistance = (CONFIG.connectDistance / CONFIG.virtualW) * width;

        for (let i = 0; i < particles.length; i += 1) {
            particles[i].update(nx, ny, ts);
        }

        for (let i = 0; i < particles.length; i += 1) {
            const p1x = particles[i].sx();
            const p1y = particles[i].sy();

            for (let j = i + 1; j < particles.length; j += 1) {
                const p2x = particles[j].sx();
                const p2y = particles[j].sy();
                const dx = p1x - p2x;
                const dy = p1y - p2y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDistance) {
                    const alpha = (1 - dist / maxDistance) * 0.26;
                    ctx.strokeStyle = rgbaString(currentColor, alpha);
                    ctx.lineWidth = 0.75;
                    ctx.beginPath();
                    ctx.moveTo(p1x, p1y);
                    ctx.lineTo(p2x, p2y);
                    ctx.stroke();
                }
            }
        }

        for (let i = 0; i < particles.length; i += 1) {
            const p = particles[i];
            const x = p.sx();
            const y = p.sy();
            const pulse = 0.72 + Math.sin(ts * 0.0012 + p.bias) * 0.28;
            const radius = p.r * (0.88 + pulse * 0.24);

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = rgbaString(currentColor, 0.76 + pulse * 0.2);
            ctx.shadowBlur = 12;
            ctx.shadowColor = rgbString(currentColor);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, radius * 1.9, 0, Math.PI * 2);
            ctx.fillStyle = rgbaString(accentColor, 0.07);
            ctx.fill();
        }

        ctx.shadowBlur = 0;
        rafId = window.requestAnimationFrame(tick);
    }

    function refreshPaletteFromTheme() {
        palette = getThemePalettes();
    }

    function isLightMode() {
        return document.documentElement.getAttribute('data-theme') === 'light';
    }

    function stopLoop() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
        }

        if (width > 0 && height > 0) {
            ctx.clearRect(0, 0, width, height);
        }
    }

    function startLoop() {
        if (!rafId) {
            state.lastTs = 0;
            rafId = window.requestAnimationFrame(tick);
        }
    }

    function applyPlexusMode() {
        const hiddenInLight = isLightMode();
        canvas.style.display = hiddenInLight ? 'none' : 'block';

        if (hiddenInLight) {
            stopLoop();
            return;
        }

        refreshPaletteFromTheme();
        startLoop();
    }

    function initPlexus() {
        resize();
        refreshPaletteFromTheme();

        window.addEventListener('resize', resize, { passive: true });

        window.addEventListener('mousemove', (e) => {
            updatePointer(e.clientX, e.clientY);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!e.touches || e.touches.length === 0) return;
            updatePointer(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        const observer = new MutationObserver(() => {
            applyPlexusMode();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        applyPlexusMode();
    }

    initPlexus();
})();
