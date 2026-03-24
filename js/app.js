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