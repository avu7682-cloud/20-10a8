// 20/10 Surprise Website - Enhanced with mouse effects and page transitions

let typingEffectStarted = false;

// Custom Cursor and Mouse Effects
let cursor = null;
let cursorTrails = [];
let isMouseDown = false;
let lastSparkleTime = 0;
let musicAudio = null;

function initializeMouseEffects() {
  // Create custom cursor
  cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  // Mouse move handler
  document.addEventListener('mousemove', (e) => {
    if (cursor) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';

      // Emoji sparkle at cursor (throttled to reduce lag)
      const now = performance.now();
      if (now - lastSparkleTime > 160) {
        createEmojiSparkleAt(e.clientX, e.clientY);
        lastSparkleTime = now;
      }
    }
  });

  // Mouse enter/leave handlers for hover effects
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (target.matches('button, .btn, a, .card, .wish-card, .surprise-button, .continue-button')) {
      cursor?.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (target.matches('button, .btn, a, .card, .wish-card, .surprise-button, .continue-button')) {
      cursor?.classList.remove('hover');
    }
  });

  // Click handlers
  document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    cursor?.classList.add('click');
    createClickRipple(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', () => {
    isMouseDown = false;
    cursor?.classList.remove('click');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
  });
}

function createCursorTrail(x, y) {
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.style.left = x + 'px';
  trail.style.top = y + 'px';
  document.body.appendChild(trail);

  // Remove trail after animation
  setTimeout(() => {
    if (trail.parentNode) {
      trail.parentNode.removeChild(trail);
    }
  }, 500);
}

function createClickRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = (x - 50) + 'px';
  ripple.style.top = (y - 50) + 'px';
  document.body.appendChild(ripple);

  // Extra sparkle on click
  createEmojiSparkleAt(x, y);
  createEmojiSparkleAt(x + 10, y - 10);

  // Remove ripple after animation
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// Emoji sparkle at cursor position
function createEmojiSparkleAt(x, y) {
  const emojis = ['✨', '🌸', '💖', '🌹'];
  const count = 1 + Math.floor(Math.random() * 2); // 1-2 emojis
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'emoji-sparkle';
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = x + (Math.random() * 14 - 7) + 'px';
    span.style.top = y + (Math.random() * 14 - 7) + 'px';
    span.style.fontSize = (12 + Math.random() * 6) + 'px';
    span.style.opacity = (0.8 + Math.random() * 0.2).toFixed(2);
    span.style.animationDuration = (420 + Math.random() * 280) + 'ms';
    document.body.appendChild(span);

    setTimeout(() => {
      if (span.parentNode) span.parentNode.removeChild(span);
    }, 650);
  }
}

// Enhanced Page Transitions
function createPageTransition() {
  const transition = document.createElement('div');
  transition.className = 'page-transition';
  document.body.appendChild(transition);
  return transition;
}

function addTypingEffect() {
  if (typingEffectStarted) return;
  typingEffectStarted = true;
  const special = document.getElementById('specialMessage');
  if (!special) return;
  const paragraphs = Array.from(special.querySelectorAll('.message-text'));
  if (!paragraphs.length) return;
  const originals = paragraphs.map(p => p.innerHTML);
  paragraphs.forEach(p => p.innerHTML = '');
  const speed = 45; // slightly faster but still readable
  let pIndex = 0, cIndex = 0;
  function typeNext() {
    if (pIndex >= originals.length) return;
    const content = originals[pIndex];
    if (cIndex < content.length) {
      paragraphs[pIndex].innerHTML += content.charAt(cIndex);
      cIndex++;
      setTimeout(typeNext, speed);
    } else {
      pIndex++; cIndex = 0;
      setTimeout(typeNext, 400);
    }
  }
  setTimeout(typeNext, 600);
}

function initializeSurpriseReveal() {
  const btn = document.getElementById('surpriseButton');
  const initial = document.getElementById('initialScreen');
  const content = document.getElementById('surpriseContent');
  if (!btn || !initial || !content) return;
  
  btn.addEventListener('click', () => {
    btn.disabled = true;

    // Play music on user gesture
    try {
      if (!musicAudio) {
        musicAudio = new Audio('nhac.mp4');
        musicAudio.volume = 0.65;
        musicAudio.loop = true;
      }
      musicAudio.play().catch(err => console.warn('Cannot play nhac.mp4:', err));
    } catch (err) {
      console.warn('Audio init error:', err);
    }
    
    // Create page transition effect
    const transition = createPageTransition();
    transition.classList.add('active');
    
    setTimeout(() => {
      initial.classList.add('fade-out');
      setTimeout(() => {
        initial.style.display = 'none';
        content.classList.add('revealed');
        
        // Remove transition
        setTimeout(() => {
          transition.classList.remove('active');
          setTimeout(() => {
            if (transition.parentNode) {
              transition.parentNode.removeChild(transition);
            }
          }, 500);
        }, 300);
      }, 600);
    }, 200);
  });
}

function setupContinueOverlay() {
  const continueBtn = document.getElementById('continueButton');
  const special = document.getElementById('specialMessage');
  if (!continueBtn || !special) return;

  function openOverlay() {
    // Create transition effect
    const transition = createPageTransition();
    transition.classList.add('active');
    
    setTimeout(() => {
      special.classList.add('inline-reveal');
      document.body.classList.add('modal-open');
      
      // Remove transition and start typing
      setTimeout(() => {
        transition.classList.remove('active');
        addTypingEffect();
        setTimeout(() => {
          if (transition.parentNode) {
            transition.parentNode.removeChild(transition);
          }
        }, 500);
      }, 300);
    }, 200);
  }

  function closeOverlay() {
    special.classList.remove('inline-reveal');
    document.body.classList.remove('modal-open');
  }

  continueBtn.addEventListener('click', openOverlay);

  special.addEventListener('click', (e) => {
    const card = special.querySelector('.special-message-card');
    if (!card) return;
    if (!card.contains(e.target)) closeOverlay();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && special.classList.contains('inline-reveal')) {
      closeOverlay();
    }
  });
}

function initializeFormalParticles() {
  const special = document.getElementById('specialMessage');
  if (!special) return;

  // create container if not exists
  let container = special.querySelector('.formal-particles');
  if (!container) {
    container = document.createElement('div');
    container.className = 'subtle-particles formal-particles';
    special.appendChild(container);
  }

  const targetCount = 120; // nhiều particles hơn
  const existing = container.querySelectorAll('.particle').length;
  const toAdd = Math.max(0, targetCount - existing);

  for (let i = 0; i < toAdd; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 3 + Math.random() * 4; // 3-7px
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    const opacity = 0.25 + Math.random() * 0.55; // 0.25 - 0.8
    p.style.background = 'rgba(255,255,255,' + opacity.toFixed(2) + ')';
    p.style.animationDuration = (4 + Math.random() * 6) + 's';
    p.style.animationDelay = (Math.random() * 4) + 's';
    container.appendChild(p);
  }

  // thêm emoji particles
  const emojiList = ['💖','🌸','🌹','✨'];
  const emojiCount = 15;
  const existingEmojis = container.querySelectorAll('.emoji-particle').length;
  const toAddEmoji = Math.max(0, emojiCount - existingEmojis);
  for (let i = 0; i < toAddEmoji; i++) {
    const e = document.createElement('div');
    e.className = 'emoji-particle';
    e.textContent = emojiList[Math.floor(Math.random()*emojiList.length)];
    e.style.left = Math.random() * 100 + '%';
    e.style.top = Math.random() * 100 + '%';
    e.style.fontSize = (1 + Math.random()*1.5) + 'rem';
    e.style.animationDuration = (8 + Math.random()*8) + 's';
    e.style.animationDelay = (Math.random()*5) + 's';
    container.appendChild(e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeMouseEffects();
  initializeSurpriseReveal();
  setupContinueOverlay();
  initializeFormalParticles();
  // No auto typing by scroll: only trigger after clicking the continue button
});