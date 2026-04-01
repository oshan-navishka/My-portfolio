let progress = 0;
let progressBar = document.getElementById("progress-bar");

let interval = setInterval(() => {
  progress += 1;
  progressBar.style.width = progress + "%";

  if (progress >= 100) {
    clearInterval(interval);

    // fade out loader
    let loader = document.getElementById("loading");
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 800);
  }
}, 20); 

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
