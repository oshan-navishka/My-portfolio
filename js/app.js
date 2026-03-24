// Loading animation disabled - portfolio shows immediately
// Uncomment below if you want loading animation on page load
/*
let progress = 0;
let progressBar = document.getElementById("progress-bar");
let progressPercentage = document.getElementById("progress-percentage");

let interval = setInterval(() => {
  progress += 2;
  progressBar.style.width = progress + "%";
  progressPercentage.textContent = progress + "%";

  if (progress >= 100) {
    clearInterval(interval);

    // fade out loader
    let loader = document.getElementById("loading");
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 300);
  }
}, 10); // speed control - faster loading (1 second total)
*/

// Hide loading screen immediately on page load
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loading");
  if (loader) {
    loader.style.display = "none";
  }
});

// Function to show loading animation for 5 seconds
function showLoadingAnimation(callback) {
  const loader = document.getElementById("loading");
  const progressBar = document.getElementById("progress-bar");
  const progressPercentage = document.getElementById("progress-percentage");

  // Reset progress
  progressBar.style.width = "0%";
  progressPercentage.textContent = "0%";

  // Show loader
  loader.style.display = "flex";
  loader.style.opacity = "1";

  let currentProgress = 0;
  const loadingInterval = setInterval(() => {
    currentProgress += 2; // 2% every 100ms = 5 seconds total
    progressBar.style.width = currentProgress + "%";
    progressPercentage.textContent = currentProgress + "%";

    if (currentProgress >= 100) {
      clearInterval(loadingInterval);

      // Fade out loader
      loader.style.opacity = "0";

      setTimeout(() => {
        loader.style.display = "none";
        if (callback) callback();
      }, 800);
    }
  }, 100);
}

// Add click handlers to external links and download button
document.addEventListener('DOMContentLoaded', function() {
  // External links that should show loading animation (exclude social icons)
  const externalLinks = document.querySelectorAll('a[href^="https://"]:not(.social-icon), a[href^="mailto:"]:not(.social-icon), a[href^="tel:"]:not(.social-icon)');

  externalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');

      showLoadingAnimation(() => {
        window.open(href, '_blank');
      });
    });
  });

  // Social icons - let them work directly without prevention
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
      // Do NOT prevent default - let them navigate normally
      const href = this.getAttribute('href');
      if (href) {
        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
          // Email and phone links work normally
          return true;
        } else {
          // External links (GitHub, LinkedIn) open in new tab
          window.open(href, '_blank');
        }
      }
    });
  });

  // Download CV button
  const downloadBtn = document.querySelector('a[href*="oshan-cv.pdf"]');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');

      showLoadingAnimation(() => {
        // Create a temporary link and trigger download
        const tempLink = document.createElement('a');
        tempLink.href = href;
        tempLink.download = 'oshan-cv.pdf';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      });
    });
  }
});
