var max = 18;
var imgstr = 511;
var gallery = document.getElementById('gallery');
var activeLightbox = null;

// Build gallery items
for (var n = 1; n <= max; n++) {
  var div = document.createElement('div');

  var img = document.createElement('img');
  img.src = 'https://picsum.photos/600/600?image=' + (imgstr + n);
  img.alt = 'Image ' + (imgstr + n);

  var a = document.createElement('a');
  a.href = '#';
  a.textContent = imgstr + n;

  (function(num) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      openLightbox(num);
    });
  })(n);

  div.appendChild(img);
  div.appendChild(a);
  gallery.appendChild(div);
}

// Open lightbox
function openLightbox(n) {
  // Remove existing lightbox if any
  if (activeLightbox) {
    activeLightbox.classList.remove('active');
    activeLightbox.remove();
    activeLightbox = null;
  }

  var lb = document.createElement('div');
  lb.className = 'lightbox';

  var content = document.createElement('div');
  content.className = 'content';

  var img = document.createElement('img');
  img.src = 'https://picsum.photos/1920/1080?image=' + (imgstr + n);
  img.alt = 'Image ' + (imgstr + n);

  var title = document.createElement('span');
  title.className = 'title';
  title.innerHTML = 'No. <b>' + (imgstr + n) + '</b> from Picsum';

  var close = document.createElement('button');
  close.className = 'close';
  close.setAttribute('aria-label', 'Close');

  // Close on button click
  close.addEventListener('click', function() {
    closeLightbox(lb);
  });

  // Close on background click
  lb.addEventListener('click', function(e) {
    if (e.target === lb) {
      closeLightbox(lb);
    }
  });

  content.appendChild(img);
  content.appendChild(title);
  content.appendChild(close);
  lb.appendChild(content);
  document.body.appendChild(lb);

  // Trigger transition
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      lb.classList.add('active');
    });
  });

  activeLightbox = lb;

  // Close on Escape key
  document.addEventListener('keydown', handleEsc);
}

// Close lightbox
function closeLightbox(lb) {
  lb.classList.remove('active');
  setTimeout(function() {
    if (lb.parentNode) lb.remove();
  }, 500);
  activeLightbox = null;
  document.removeEventListener('keydown', handleEsc);
}

// Escape key handler
function handleEsc(e) {
  if (e.key === 'Escape' && activeLightbox) {
    closeLightbox(activeLightbox);
  }
}