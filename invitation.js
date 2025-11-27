// ============================================
// INVITATION CARD FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeInvitation();
});

function initializeInvitation() {
    // Hide loading indicator after page loads
    const loadingIndicator = document.getElementById('loadingIndicator');
    setTimeout(() => {
        loadingIndicator.classList.add('hidden');
    }, 1000);

    // Size card wrapper to match background image dimensions (scaled to viewport)
    sizeCardToCover();

    // Initialize sparkles
    createSparkles();

    // Setup event listeners
    setupEventListeners();

    // Initialize music
    initializeMusic();

    // No manual button; auto-redirect handled after animation
}

// ============================================
// CARD SIZE FIT TO BACKGROUND IMAGE
// ============================================

function sizeCardToCover() {
    const wrapper = document.getElementById('cardWrapper');
    const cover = document.getElementById('cardCover');
    if (!wrapper || !cover) return;

    const src = cover.getAttribute('data-cover-src');
    const maxW = Math.min(window.innerWidth * 0.92, 1200);
    const maxH = Math.min(window.innerHeight * 0.88, 1600);

    const applySizeFromDims = (imgW, imgH) => {
        const s = Math.min(maxW / imgW, maxH / imgH, 1); // don't upscale beyond natural size
        const w = Math.round(imgW * s);
        const h = Math.round(imgH * s);
        wrapper.style.width = w + 'px';
        wrapper.style.height = h + 'px';
    };

    const cachedW = wrapper.getAttribute('data-img-w');
    const cachedH = wrapper.getAttribute('data-img-h');
    if (cachedW && cachedH) {
        applySizeFromDims(parseInt(cachedW, 10), parseInt(cachedH, 10));
        return;
    }

    if (!src) return;
    const img = new Image();
    img.onload = () => {
        const imgW = img.naturalWidth || 1000;
        const imgH = img.naturalHeight || 1400;
        wrapper.setAttribute('data-img-w', String(imgW));
        wrapper.setAttribute('data-img-h', String(imgH));
        applySizeFromDims(imgW, imgH);
    };
    img.src = src;
}

let __resizeTO;
window.addEventListener('resize', () => {
    clearTimeout(__resizeTO);
    __resizeTO = setTimeout(sizeCardToCover, 150);
});

// ============================================
// SPARKLES EFFECT
// ============================================

function createSparkles() {
    const container = document.getElementById('sparklesContainer');
    const sparkleCount = 24;

    for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
            createSparkle(container);
        }, i * 200);
    }

    // Continue creating sparkles
    setInterval(() => {
        createSparkle(container);
    }, 500);
}

function createSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';

    const tx = (Math.random() - 0.5) * 100;
    const ty = (Math.random() - 0.5) * 100;

    sparkle.style.setProperty('--tx', tx + 'px');
    sparkle.style.setProperty('--ty', ty + 'px');

    const duration = 2 + Math.random() * 2;
    sparkle.style.animationDuration = duration + 's';

    container.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, duration * 1000);
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    const openBtn = document.getElementById('openBtn');
    const cardWrapper = document.getElementById('cardWrapper');
    const cardCover = document.getElementById('cardCover');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            openCard(cardWrapper);
        });
    }

    // Allow clicking on the cover itself to open
    if (cardCover) {
        cardCover.addEventListener('click', (e) => {
            if (!e.target.closest('.open-btn') && !cardWrapper.classList.contains('opened')) {
                openCard(cardWrapper);
            }
        });
        cardCover.style.cursor = 'pointer';
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !cardWrapper.classList.contains('opened')) {
            openCard(cardWrapper);
        }
    });
}

// ============================================
// CARD OPENING ANIMATION
// ============================================

function openCard(cardWrapper) {
    if (cardWrapper.classList.contains('opened')) return;

    cardWrapper.classList.add('opened');

    // Play sound effect if available
    playOpenSound();

    // Create celebration effect
    createCelebration();

    // Redirect to index.html after animation completes
    setTimeout(() => {
        redirectToMain();
    }, 1500); // Wait for animation to complete (0.9s) + buffer
}

function playOpenSound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Silently fail if Web Audio API is not available
    }
}

function createCelebration() {
    const container = document.getElementById('sparklesContainer');

    // Create burst of sparkles
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';

            const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
            const y = window.innerHeight / 2 + (Math.random() - 0.5) * 200;

            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';

            const tx = (Math.random() - 0.5) * 300;
            const ty = (Math.random() - 0.5) * 300;

            sparkle.style.setProperty('--tx', tx + 'px');
            sparkle.style.setProperty('--ty', ty + 'px');

            sparkle.style.animationDuration = '1.5s';

            container.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 1500);
        }, i * 30);
    }
}

// ============================================
// COVER RENDERING (Single-face split across two panels)
// ============================================

function renderCoverFace() {
    const tmpl = document.getElementById('coverTemplate');
    const leftPanel = document.getElementById('leftPanel');
    const rightPanel = document.getElementById('rightPanel');
    if (!tmpl || !leftPanel || !rightPanel) return;

    // Left half
    const leftFrag = tmpl.content.cloneNode(true);
    leftPanel.appendChild(leftFrag);

    // Right half - shift face by 50%
    const rightFrag = tmpl.content.cloneNode(true);
    const face = rightFrag.querySelector('.cover-face');
    if (face) face.classList.add('face-right');
    rightPanel.appendChild(rightFrag);
}

// ============================================
// MUSIC CONTROL
// ============================================

function initializeMusic() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');

    if (!musicToggle || !bgMusic) return;

    // Auto-play with user interaction
    document.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => {
                console.log('Autoplay prevented:', e);
            });
            musicToggle.classList.add('playing');
        }
    }, { once: true });

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();

        if (bgMusic.paused) {
            bgMusic.play().catch(e => {
                console.log('Play failed:', e);
            });
            musicToggle.classList.add('playing');
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        }
    });

    // Update button state when music plays/pauses
    bgMusic.addEventListener('play', () => {
        musicToggle.classList.add('playing');
    });

    bgMusic.addEventListener('pause', () => {
        musicToggle.classList.remove('playing');
    });
}

// ============================================
// CARD REDIRECT
// ============================================

function redirectToMain() {
    // Fade out then navigate
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// ============================================
// TOUCH/SWIPE SUPPORT
// ============================================

document.addEventListener('touchstart', function(e) {
    const cardWrapper = document.getElementById('cardWrapper');
    if (cardWrapper && !cardWrapper.classList.contains('opened')) {
        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;

        document.addEventListener('touchend', function(e) {
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;

            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Swipe up or tap
            if (Math.abs(deltaY) > 50 && deltaY < 0) {
                openCard(cardWrapper);
            }
        }, { once: true });
    }
});

// ============================================
// ACCESSIBILITY
// ============================================

// Ensure proper focus management
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const cardWrapper = document.getElementById('cardWrapper');
        const openBtn = document.getElementById('openBtn');

        if (cardWrapper && !cardWrapper.classList.contains('opened') && openBtn) {
            openBtn.focus();
        }
    }
});

