/* ============================================
   INVITATION CARD MODULE (Refactored)
   ============================================ */
(function() {
  'use strict';

  // ----------------------
  // Config
  // ----------------------
  const Config = {
    redirectTarget: 'main.html',
    fadeOutMs: 500,
    sparkle: {
      initialCount: 24,
      intervalMs: 500,
      burstCount: 30,
      burstStepMs: 30,
      minDuration: 2,
      maxDuration: 4
    },
  };

  // Runtime state (no globals)
  const State = {
    opened: false,
    resizeTO: null,
    intervals: [],
    timeouts: [],
    listeners: [],
  };

  // Utilities to manage timers/listeners for cleanup
  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    State.timeouts.push(id);
    return id;
  };
  const addInterval = (fn, interval) => {
    const id = setInterval(fn, interval);
    State.intervals.push(id);
    return id;
  };
  const addListener = (target, type, handler, opts) => {
    target.addEventListener(type, handler, opts);
    State.listeners.push(() => target.removeEventListener(type, handler, opts));
  };
  const cleanup = () => {
    State.timeouts.forEach(clearTimeout);
    State.intervals.forEach(clearInterval);
    State.listeners.forEach(off => off());
    State.timeouts = [];
    State.intervals = [];
    State.listeners = [];
  };

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----------------------
  // Init
  // ----------------------
  addListener(document, 'DOMContentLoaded', initialize);

  function initialize() {
    hideLoaderSoon();
    sizeCardToCover();

    if (!prefersReducedMotion()) {
      startSparkles();
    }

    setupInteractions();
    setupMusic();
    prefetchMain();

    // Clean up on page hide/unload
    addListener(window, 'pagehide', cleanup, { passive: true });
    addListener(window, 'beforeunload', cleanup, { passive: true });
  }

  // ----------------------
  // Loader
  // ----------------------
  function hideLoaderSoon() {
    const el = document.getElementById('loadingIndicator');
    if (!el) return;
    addTimeout(() => {
      el.classList.add('hidden');
    }, 700);
  }

  // ----------------------
  // Size card to cover image
  // ----------------------
  function sizeCardToCover() {
    const wrapper = document.getElementById('cardWrapper');
    const cover = document.getElementById('cardCover');
    if (!wrapper || !cover) return;

    const src = cover.getAttribute('data-cover-src');
    const maxW = Math.min(window.innerWidth * 0.92, 1200);
    const maxH = Math.min(window.innerHeight * 0.88, 1600);

    const apply = (imgW, imgH) => {
      const s = Math.min(maxW / imgW, maxH / imgH, 1);
      wrapper.style.width = Math.round(imgW * s) + 'px';
      wrapper.style.height = Math.round(imgH * s) + 'px';
    };

    const cachedW = wrapper.getAttribute('data-img-w');
    const cachedH = wrapper.getAttribute('data-img-h');
    if (cachedW && cachedH) {
      apply(parseInt(cachedW, 10), parseInt(cachedH, 10));
    } else if (src) {
      const img = new Image();
      img.onload = () => {
        const imgW = img.naturalWidth || 1000;
        const imgH = img.naturalHeight || 1400;
        wrapper.setAttribute('data-img-w', String(imgW));
        wrapper.setAttribute('data-img-h', String(imgH));
        apply(imgW, imgH);
      };
      img.src = src;
    }
  }

  const onResize = () => {
    clearTimeout(State.resizeTO);
    State.resizeTO = addTimeout(sizeCardToCover, 150);
  };
  addListener(window, 'resize', onResize, { passive: true });

  // ----------------------
  // Sparkles
  // ----------------------
  function startSparkles() {
    const container = document.getElementById('sparklesContainer');
    if (!container) return;

    const initial = Math.max(0, Config.sparkle.initialCount);
    for (let i = 0; i < initial; i++) {
      addTimeout(() => createSparkle(container), i * 200);
    }
    // Continue creating sparkles
    addInterval(() => createSparkle(container), Config.sparkle.intervalMs);
  }

  function createSparkle(container) {
    const el = document.createElement('div');
    el.className = 'sparkle';

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    el.style.left = x + 'px';
    el.style.top = y + 'px';

    const tx = (Math.random() - 0.5) * 100;
    const ty = (Math.random() - 0.5) * 100;
    el.style.setProperty('--tx', tx + 'px');
    el.style.setProperty('--ty', ty + 'px');

    const dur = Config.sparkle.minDuration + Math.random() * (Config.sparkle.maxDuration - Config.sparkle.minDuration);
    el.style.animationDuration = dur + 's';

    container.appendChild(el);
    addTimeout(() => el.remove(), dur * 1000);
  }

  function burstSparkles() {
    if (prefersReducedMotion()) return;
    const container = document.getElementById('sparklesContainer');
    if (!container) return;

    for (let i = 0; i < Config.sparkle.burstCount; i++) {
      addTimeout(() => {
        const el = document.createElement('div');
        el.className = 'sparkle';

        const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
        const y = window.innerHeight / 2 + (Math.random() - 0.5) * 200;
        el.style.left = x + 'px';
        el.style.top = y + 'px';

        const tx = (Math.random() - 0.5) * 300;
        const ty = (Math.random() - 0.5) * 300;
        el.style.setProperty('--tx', tx + 'px');
        el.style.setProperty('--ty', ty + 'px');

        el.style.animationDuration = '1.5s';
        container.appendChild(el);
        addTimeout(() => el.remove(), 1500);
      }, i * Config.sparkle.burstStepMs);
    }
  }

  // ----------------------
  // Interactions
  // ----------------------
  function setupInteractions() {
    const openBtn = document.getElementById('openBtn');
    const cardWrapper = document.getElementById('cardWrapper');
    const cardCover = document.getElementById('cardCover');

    if (openBtn) addListener(openBtn, 'click', () => openCard(cardWrapper));

    if (cardCover) {
      cardCover.style.cursor = 'pointer';
      addListener(cardCover, 'click', (e) => {
        if (!State.opened && !(e.target && e.target.closest('.open-btn'))) {
          openCard(cardWrapper);
        }
      });
    }

    // Keyboard: Enter or Space
    addListener(document, 'keydown', (e) => {
      if (!State.opened && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openCard(cardWrapper);
      }
    });

    // Basic swipe up to open (mobile)
    addListener(document, 'touchstart', (e) => {
      if (State.opened) return;
      const t0 = e.touches && e.touches[0];
      if (!t0) return;
      const startY = t0.clientY;
      const onEnd = (ev) => {
        const t1 = ev.changedTouches && ev.changedTouches[0];
        if (!t1) return;
        const deltaY = t1.clientY - startY;
        if (Math.abs(deltaY) > 50 && deltaY < 0) {
          openCard(cardWrapper);
        }
      };
      addListener(document, 'touchend', onEnd, { once: true });
    }, { passive: true });

    // Accessibility: keep focus on open button before opening
    addListener(document, 'keydown', (e) => {
      if (e.key === 'Tab' && !State.opened) {
        const btn = document.getElementById('openBtn');
        if (btn) btn.focus();
      }
    });
  }

  function openCard(cardWrapper) {
    if (State.opened) return;
    State.opened = true;

    // CSS visual marker (in case we keep cover animation)
    if (cardWrapper) cardWrapper.classList.add('opened');

    // Sound + celebration (skip if reduced motion)
    playOpenSound();
    burstSparkles();

    // Redirect immediately as requested
    redirectToMain();
  }

  // ----------------------
  // Music control
  // ----------------------
  function setupMusic() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    if (!musicToggle || !bgMusic) return;

    const tryPlay = () => {
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          musicToggle.classList.add('playing');
        }).catch(() => {});
      }
    };

    addListener(document, 'click', tryPlay, { once: true });

    addListener(musicToggle, 'click', (e) => {
      e.stopPropagation();
      if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
      } else {
        bgMusic.pause();
      }
    });

    addListener(bgMusic, 'play', () => musicToggle.classList.add('playing'));
    addListener(bgMusic, 'pause', () => musicToggle.classList.remove('playing'));
  }

  function playOpenSound() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const audioContext = new Ctx();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      osc.start();
      addTimeout(() => {
        osc.stop();
        audioContext.close();
      }, 300);
    } catch (_) { /* ignore */ }
  }

  // ----------------------
  // Navigation
  // ----------------------
  function redirectToMain() {
    // Respect reduced motion
    const doFade = !prefersReducedMotion();
    if (doFade) {
      document.body.style.transition = `opacity ${Config.fadeOutMs}ms ease`;
      document.body.style.opacity = '0';
      addTimeout(() => navigate(), Config.fadeOutMs);
    } else {
      navigate();
    }
  }

  function navigate() {
    // Stop background activity to speed up navigation
    cleanup();
    try {
      window.location.assign(Config.redirectTarget);
    } catch (_) {
      window.location.href = Config.redirectTarget;
    }
  }

  // ----------------------
  // Perf: prefetch main page
  // ----------------------
  function prefetchMain() {
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = Config.redirectTarget;
      document.head.appendChild(link);
    } catch (_) { /* ignore */ }
  }
})();
