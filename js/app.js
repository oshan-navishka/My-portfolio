const loader = document.getElementById("loading");
const progressBar = document.getElementById("progress-bar");

if (loader && progressBar) {
let progress = 0;

let interval = setInterval(() => {
progress += 1;
progressBar.style.width = progress + "%";

if (progress >= 100) {
clearInterval(interval);
  
loader.style.opacity = "0";

setTimeout(() => {
loader.style.display = "none";
}, 800);
}
}, 20);
}

// Skills cards scroll animation
const skillCards = document.querySelectorAll('.card');

const skillObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
}
});
}, { threshold: 0.15 });

skillCards.forEach(card => skillObserver.observe(card));

// Theme switch
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const themeToggleText = document.querySelector(".theme-toggle-text");

function applyTheme(theme) {
document.documentElement.setAttribute("data-theme", theme);
localStorage.setItem("theme", theme);

if (themeToggle) {
themeToggle.setAttribute(
"aria-label",
theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
);
}

if (themeToggleIcon) {
themeToggleIcon.className = theme === "dark"
? "fas fa-moon theme-toggle-icon"
: "fas fa-sun theme-toggle-icon";
}

if (themeToggleText) {
themeToggleText.textContent = theme === "dark" ? "Dark" : "Light";
}
}

const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme === "light" || savedTheme === "dark"
? savedTheme
: (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

applyTheme(initialTheme);

if (themeToggle) {
themeToggle.addEventListener("click", () => {
const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
applyTheme(nextTheme);
});
}

// Navbar scrollspy underline
(() => {
      const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link[href^="#"]'));
      if (!navLinks.length) return;

      const linkMap = new Map();
      const sections = [];

      navLinks.forEach((link) => {
            const targetId = link.getAttribute('href')?.slice(1);
            const section = targetId ? document.getElementById(targetId) : null;

            if (targetId && section) {
                  linkMap.set(targetId, link);
                  sections.push(section);
            }
      });

      if (!sections.length) return;

      const setActiveLink = (id) => {
            navLinks.forEach((link) => link.classList.remove('active'));
            const activeLink = linkMap.get(id);
            if (activeLink) {
                  activeLink.classList.add('active');
            }
      };

      const getCurrentSectionId = () => {
            const scrollY = window.scrollY || window.pageYOffset;
            const offset = Math.max(140, Math.round(window.innerHeight * 0.25));
            let currentId = sections[0].id;

            sections.forEach((section) => {
                  const sectionTop = section.offsetTop;
                  if (scrollY + offset >= sectionTop) {
                        currentId = section.id;
                  }
            });

            return currentId;
      };

      let ticking = false;
      const updateActiveLink = () => {
            const currentId = getCurrentSectionId();
            setActiveLink(currentId);
            ticking = false;
      };

      const requestUpdate = () => {
            if (!ticking) {
                  window.requestAnimationFrame(updateActiveLink);
                  ticking = true;
            }
      };

      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate);

      const initialSection = window.location.hash.replace('#', '') || getCurrentSectionId();
      setActiveLink(initialSection);
})();

// Mobile navbar toggle (works without Bootstrap JS)
(() => {
const navToggle = document.querySelector(".navbar-toggler");
const navCollapse = document.getElementById("navbarNav");
if (!navToggle || !navCollapse) return;

const closeMenu = () => {
navCollapse.classList.remove("open");
navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
const isOpen = navCollapse.classList.toggle("open");
navToggle.setAttribute("aria-expanded", String(isOpen));
});

navCollapse.querySelectorAll(".nav-link").forEach((link) => {
link.addEventListener("click", () => {
if (window.innerWidth <= 768) {
closeMenu();
}
});
});

document.addEventListener("click", (event) => {
if (window.innerWidth > 768) return;
const target = event.target;
if (!(target instanceof Element)) return;

const clickInsideMenu = navCollapse.contains(target) || navToggle.contains(target);
if (!clickInsideMenu) {
closeMenu();
}
});

window.addEventListener("resize", () => {
if (window.innerWidth > 768) {
closeMenu();
}
});
})();

// Hero typewriter animation
const typewriterElement = document.getElementById("typewriterText");

if (typewriterElement) {
const roles = ["Software Engineer", "Web Designer"];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

const typeSpeed = 95;
const deleteSpeed = 55;
const holdDelay = 1200;

function tick() {
const currentRole = roles[roleIndex];

if (!deleting) {
typewriterElement.textContent = currentRole.slice(0, charIndex + 1);
charIndex += 1;

if (charIndex === currentRole.length) {
deleting = true;
setTimeout(tick, holdDelay);
return;
}

setTimeout(tick, typeSpeed);
return;
}

typewriterElement.textContent = currentRole.slice(0, charIndex - 1);
charIndex -= 1;

if (charIndex === 0) {
deleting = false;
roleIndex = (roleIndex + 1) % roles.length;
setTimeout(tick, 250);
return;
}

setTimeout(tick, deleteSpeed);
}

setTimeout(tick, 500);
}
// Plexus background animation
(() => {
const canvas = document.getElementById("plexus-bg");
if (!canvas) return;

const ctx = canvas.getContext("2d", { alpha: true });
if (!ctx) return;

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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
connectDistance: 180,
dotMin: 1.5,
dotMax: 3.2,
speedMin: 0.18,
speedMax: 0.44,
colorShiftSpeed: 0.0017,
pointerLerp: 0.05,
pointerInfluence: 0.045
};

function hexToRgb(hex) {
const clean = hex.replace("#", "").trim();
const full = clean.length === 3
? clean.split("").map((c) => c + c).join("")
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
const primary = styles.getPropertyValue("--primary").trim() || "#6e45e2";
const secondary = styles.getPropertyValue("--secondary").trim() || "#88d3ce";

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
}

update(pointerNx, pointerNy) {
// Subtle and elegant pointer influence
this.x += this.vx + pointerNx * CONFIG.pointerInfluence;
this.y += this.vy + pointerNy * CONFIG.pointerInfluence;

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

// Keep timing stable if tab was inactive
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

ctx.clearRect(0, 0, width, height);

const maxDistance = (CONFIG.connectDistance / CONFIG.virtualW) * width;

for (let i = 0; i < particles.length; i += 1) {
particles[i].update(nx, ny);
}

// Lines
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
const alpha = (1 - dist / maxDistance) * 0.34;
ctx.strokeStyle = rgbaString(currentColor, alpha);
ctx.lineWidth = 0.8;
ctx.beginPath();
ctx.moveTo(p1x, p1y);
ctx.lineTo(p2x, p2y);
ctx.stroke();
}
}
}

// Dots
for (let i = 0; i < particles.length; i += 1) {
const p = particles[i];
const x = p.sx();
const y = p.sy();

ctx.beginPath();
ctx.arc(x, y, p.r, 0, Math.PI * 2);
ctx.fillStyle = rgbString(currentColor);
ctx.shadowBlur = 10;
ctx.shadowColor = rgbString(currentColor);
ctx.fill();
}

// Reset shadow for other canvas operations
ctx.shadowBlur = 0;
rafId = window.requestAnimationFrame(tick);
}

function refreshPaletteFromTheme() {
palette = getThemePalettes();
}

function isLightMode() {
return document.documentElement.getAttribute("data-theme") === "light";
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
if (isLightMode()) {
canvas.style.display = "none";
stopLoop();
return;
}

canvas.style.display = "block";
refreshPaletteFromTheme();
startLoop();
}

function init() {
resize();
refreshPaletteFromTheme();

window.addEventListener("resize", resize, { passive: true });

window.addEventListener("mousemove", (e) => {
updatePointer(e.clientX, e.clientY);
}, { passive: true });

window.addEventListener("touchmove", (e) => {
if (!e.touches || e.touches.length === 0) return;
updatePointer(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

// Refresh palette and toggle animation when theme changes
const observer = new MutationObserver(() => {
applyPlexusMode();
});

observer.observe(document.documentElement, {
attributes: true,
attributeFilter: ["data-theme"]
});

applyPlexusMode();
}

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
init();
}
})();

// Contact form submit via FormSubmit AJAX API


// (() => {
//   const form = document.getElementById("contact-form");
//   if (!form) return;

//   const submitButton = form.querySelector(".contact-submit");
//   const statusText = document.getElementById("contact-status");
//   const endpoint = "https://formsubmit.co/ajax/oshannavishka1234@gmail.com";

//   function setStatus(message, type = "") {
//     if (!statusText) return;
//     statusText.textContent = message;
//     statusText.classList.remove("is-success", "is-error");
//     if (type) {
//       statusText.classList.add(type);
//     }
//   }

//   form.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     if (!form.checkValidity()) {
//       form.reportValidity();
//       return;
//     }

//     const name = form.querySelector("#name")?.value.trim() || "";
//     const email = form.querySelector("#email")?.value.trim() || "";
//     const subjectInput = form.querySelector("#subject")?.value.trim() || "New Message";
//     const message = form.querySelector("#message")?.value.trim() || "";

//     const data = new FormData();
//     data.append("_subject", subjectInput);
//     data.append("_captcha", "false");
//     data.append("_replyto", email);
//     data.append(
//       "message",
//       `Name: ${name}\nEmail: ${email}\nSubject: ${subjectInput}\n\nMessage:\n${message}`
//     );

//     if (submitButton) {
//       submitButton.disabled = true;
//       submitButton.textContent = "Sending...";
//     }
//     setStatus("Sending your message...");

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         body: data,
//         headers: {
//           Accept: "application/json"
//         }
//       });

//       const result = await response.json().catch(() => ({}));
//       const success = response.ok && (result.success === "true" || result.success === true || Object.keys(result).length === 0);

//       if (!success) {
//         throw new Error("Form submit failed");
//       }

//       setStatus("Message sent successfully. I will contact you soon.", "is-success");
//       form.reset();
//     } catch (error) {
//       setStatus("Message send failed. Please try again in a moment.", "is-error");
//     } finally {
//       if (submitButton) {
//         submitButton.disabled = false;
//         submitButton.textContent = "Send Message";
//       }
//     }
//   });
// })();

(() => {
const form = document.getElementById("contact-form");
if (!form) return;

const submitButton = form.querySelector(".contact-submit");
const statusText = document.getElementById("contact-status");
const endpoint = "https://formsubmit.co/ajax/oshannavishka1234@gmail.com";

function setStatus(message, type = "") {
if (!statusText) return;
statusText.textContent = message;
statusText.classList.remove("is-success", "is-error");
if (type) {
statusText.classList.add(type);
}
}

form.addEventListener("submit", async (event) => {
event.preventDefault();

if (!form.checkValidity()) {
form.reportValidity();
return;
}

const name = form.querySelector("#name")?.value.trim() || "";
const email = form.querySelector("#email")?.value.trim() || "";
const subjectInput = form.querySelector("#subject")?.value.trim() || "New Message";
const message = form.querySelector("#message")?.value.trim() || "";

const data = new FormData();
data.append("name", name);
data.append("email", email);
data.append("_subject", subjectInput);
data.append("_captcha", "false");
data.append("_replyto", email);
data.append("_template", "table");
data.append("message",
`Name: ${name}\nEmail: ${email}\nSubject: ${subjectInput}\n\nMessage:\n${message}`
);

if (submitButton) {
submitButton.disabled = true;
submitButton.textContent = "Sending...";
}
setStatus("Sending your message...");

try {
const response = await fetch(endpoint, {
method: "POST",
body: data,
headers: {
Accept: "application/json"
}
});

const result = await response.json().catch(() => ({}));
const success = response.ok && (result.success === "true" || result.success === true || Object.keys(result).length === 0);

if (!success) {
const apiMessage = typeof result?.message === "string" ? result.message : "Form submit failed";
throw new Error(apiMessage);
}

setStatus("Message sent successfully. I will contact you soon.", "is-success");
form.reset();
} catch (error) {
const message = error instanceof Error ? error.message : "Message send failed. Please try again in a moment.";
setStatus(`${message}. If this is your first submit, verify the FormSubmit activation email.`, "is-error");
} finally {
if (submitButton) {
submitButton.disabled = false;
submitButton.textContent = "Send Message";
}
}
});
})();