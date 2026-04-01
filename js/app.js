const loader = document.getElementById("loading");
const progressBar = document.getElementById("progress-bar");

if (loader && progressBar) {
  let progress = 0;

  let interval = setInterval(() => {
    progress += 1;
    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);

      // fade out loader
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
