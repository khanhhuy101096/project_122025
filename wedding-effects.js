/* ==========================================
   WEDDING SPECIAL EFFECTS - JAVASCRIPT
   ========================================== */

// ==========================================
// 1. FIREWORKS SHOW (Pháo hoa)
// ==========================================

function launchFirework() {
    const x = Math.random() * window.innerWidth;
    const apexY = Math.random() * (window.innerHeight * 0.4) + 100; // cao điểm nổ
    const duration = 800 + Math.random() * 600;

    // Tạo vệt sáng bay lên
    const trail = document.createElement('div');
    trail.className = 'firework-trail';
    trail.style.left = x + 'px';
    trail.style.top = window.innerHeight + 'px';

    document.body.appendChild(trail);

    const start = performance.now();
    function step(ts) {
        const p = Math.min((ts - start) / duration, 1);
        const y = window.innerHeight - p * (window.innerHeight - apexY);
        trail.style.top = y + 'px';
        trail.style.opacity = String(1 - p * 0.7);
        if (p < 1) {
            requestAnimationFrame(step);
        } else {
            trail.remove();
            // Nổ pháo hoa tại đỉnh (đỏ nở ra đẹp và ít hơn)
            createFireworkExplosion(x, apexY, 14 + Math.floor(Math.random() * 6));
        }
    }
    requestAnimationFrame(step);
}

let fireworksIntervalId = null;
function startFireworks() {
    if (fireworksIntervalId) return;
    ensureFireworksCanvas();
    // Bắn pháo hoa định kỳ (ít hơn, đẹp hơn)
    fireworksIntervalId = setInterval(launchFirework, 3000);
    // Bắn ngay một quả đầu tiên
    setTimeout(launchFirework, 600);
}

// ===== Fireworks Canvas Engine =====
let fwCanvas, fwCtx, fwParticles = [], fwAnimating = false;

function ensureFireworksCanvas() {
    if (!fwCanvas) {
        fwCanvas = document.createElement('canvas');
        fwCanvas.id = 'fireworksCanvas';
        fwCanvas.className = 'fireworks-canvas';
        document.body.appendChild(fwCanvas);
        fwCtx = fwCanvas.getContext('2d');
        window.addEventListener('resize', resizeFireworksCanvas);
        resizeFireworksCanvas();
    }
}

function resizeFireworksCanvas() {
    if (!fwCanvas) return;
    fwCanvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    fwCanvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    fwCtx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
}

function createFireworkExplosion(x, y, count) {
    ensureFireworksCanvas();
    const colors = [
        '#ff3b3b', '#ff6a00', '#ffd700', '#ff1493', '#ff7f50'
    ];
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2) * (i / count) + (Math.random() * 0.3);
        const speed = 2 + Math.random() * 3; // tốc độ tia
        fwParticles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 50 + Math.random() * 30,
            alpha: 1,
            size: 2 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
    if (!fwAnimating) {
        fwAnimating = true;
        requestAnimationFrame(animateFireworks);
    }
}

function animateFireworks() {
    if (!fwCtx) return;
    // làm mờ dần vệt cũ (không phủ đen toàn màn hình)
    fwCtx.globalCompositeOperation = 'destination-out';
    fwCtx.fillStyle = 'rgba(0,0,0,0.2)';
    fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

    // vẽ hạt sáng
    fwCtx.globalCompositeOperation = 'lighter';

    const gravity = 0.15;
    const friction = 0.985;

    for (let i = fwParticles.length - 1; i >= 0; i--) {
        const p = fwParticles[i];
        p.vx *= friction;
        p.vy = p.vy * friction + gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.alpha = Math.max(0, p.life / 80);

        // vẽ hạt
        fwCtx.beginPath();
        fwCtx.fillStyle = hexToRgba(p.color, p.alpha);
        fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fwCtx.fill();

        if (p.life <= 0) fwParticles.splice(i, 1);
    }

    fwCtx.globalCompositeOperation = 'source-over';

    if (fwParticles.length > 0) {
        requestAnimationFrame(animateFireworks);
    } else {
        fwAnimating = false;
    }
}

function hexToRgba(hex, alpha) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0,2), 16);
    const g = parseInt(c.substring(2,4), 16);
    const b = parseInt(c.substring(4,6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ==========================================
// PREMIUM THEME ENHANCEMENTS
// ==========================================

function enablePremiumTheme() {
    const body = document.body;
    if (!body.classList.contains('premium-theme')) {
        body.classList.add('premium-theme', 'premium-fade-in');
        setTimeout(() => body.classList.remove('premium-fade-in'), 800);
    }
}

let goldenParticlesTimer = null;
function startGoldenParticles() {
    // tránh tạo trùng
    if (goldenParticlesTimer) return;
    let current = 0;
    const maxParticles = 22; // giới hạn để giữ mượt
    goldenParticlesTimer = setInterval(() => {
        // thưa hạt
        if (document.hidden) return;
        const existing = document.querySelectorAll('.golden-particle').length;
        if (existing >= maxParticles) return;
        spawnGoldenParticle();
    }, 1300);
}

function spawnGoldenParticle() {
    const p = document.createElement('div');
    p.className = 'golden-particle';
    const size = 2 + Math.random() * 3; // 2-5px
    const dur = 8 + Math.random() * 8; // 8-16s
    const drift = (Math.random() - 0.5) * 120 + 'px';

    p.style.setProperty('--gp-size', size + 'px');
    p.style.setProperty('--gp-duration', dur + 's');
    p.style.setProperty('--gp-tx', drift);

    p.style.left = Math.round(8 + Math.random() * 84) + 'vw';
    // xuất phát khoảng 20% vùng dưới để nhìn tự nhiên
    const startTop = Math.round(65 + Math.random() * 25);
    p.style.top = startTop + 'vh';

    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
}


// ==========================================
// 2. FLOATING HEARTS
// ==========================================

class FloatingHeart {
    constructor(x, y) {
        this.element = document.createElement('div');
        this.element.className = 'floating-heart heart-float';
        this.element.innerHTML = '❤️';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.fontSize = (Math.random() * 20 + 20) + 'px';
        
        document.body.appendChild(this.element);
        
        setTimeout(() => this.element.remove(), 3000);
    }
}

function createFloatingHeart(event) {
    new FloatingHeart(event.clientX, event.clientY);
}

// Tạo floating hearts khi click
document.addEventListener('click', function(e) {
    // Chỉ tạo hearts nếu không phải click vào button hoặc input
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && 
        e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT' &&
        !e.target.closest('a')) {
        createFloatingHeart(e);
    }
});

// ==========================================
// 3. SPARKLE EFFECT ON HOVER
// ==========================================

class Sparkle {
    constructor(x, y) {
        this.element = document.createElement('div');
        this.element.className = 'sparkle';
        this.element.innerHTML = '✨';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.fontSize = (Math.random() * 15 + 10) + 'px';
        this.element.style.position = 'fixed';
        this.element.style.pointerEvents = 'none';
        this.element.style.zIndex = '1000';
        
        document.body.appendChild(this.element);
        
        setTimeout(() => this.element.remove(), 600);
    }
}

function addSparkleEffect(element) {
    element.addEventListener('mouseenter', function(e) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const x = e.clientX + (Math.random() - 0.5) * 50;
                const y = e.clientY + (Math.random() - 0.5) * 50;
                new Sparkle(x, y);
            }, i * 100);
        }
    });
}

// Thêm sparkle effect cho các button
document.querySelectorAll('.btn, .btn-theme-primary, .btn-theme-secondary').forEach(btn => {
    addSparkleEffect(btn);
});

// ==========================================
// 4. CONFETTI EFFECT
// ==========================================

class Confetti {
    constructor(x, y) {
        this.element = document.createElement('div');
        this.element.className = 'confetti';
        
        const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#ff69b4'];
        const shapes = ['🎆', '🎇', '🎉', '🎊', '💥', '✨'];
        
        this.element.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.fontSize = (Math.random() * 20 + 15) + 'px';
        this.element.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        const tx = (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 720;
        const duration = Math.random() * 2 + 2;
        
        this.element.style.setProperty('--tx', tx + 'px');
        this.element.style.setProperty('--rotation', rotation + 'deg');
        this.element.style.animationDuration = duration + 's';
        
        document.body.appendChild(this.element);
        
        setTimeout(() => this.element.remove(), duration * 1000);
    }
}

function triggerConfetti(x, y, count = 30) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            new Confetti(
                x + (Math.random() - 0.5) * 100,
                y + (Math.random() - 0.5) * 100
            );
        }, i * 30);
    }
}

// Thêm confetti effect cho các button quan trọng
document.querySelectorAll('.btn-submit, .btn-open').forEach(btn => {
    btn.addEventListener('click', function(e) {
        triggerConfetti(e.clientX, e.clientY, 20);
    });
});

// ==========================================
// 5. ROMANTIC PARTICLES
// ==========================================

class Particle {
    constructor(x, y) {
        this.element = document.createElement('div');
        this.element.className = 'particle';
        
        const colors = ['#e91e63', '#ff69b4', '#ff1493', '#ff69b4', '#ffb6c1'];
        
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.width = (Math.random() * 8 + 4) + 'px';
        this.element.style.height = this.element.style.width;
        this.element.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const tx = (Math.random() - 0.5) * 100;
        this.element.style.setProperty('--tx', tx + 'px');
        
        const duration = Math.random() * 1 + 1;
        this.element.style.animationDuration = duration + 's';
        
        document.body.appendChild(this.element);
        
        setTimeout(() => this.element.remove(), duration * 1000);
    }
}

function createParticleEffect(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
        new Particle(x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 50);
    }
}

// ==========================================
// 6. HERO SECTION ENTRANCE ANIMATION
// ==========================================

function animateHeroSection() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'hero-scale-in 1s ease-out';
    }
}

// ==========================================
// 7. SECTION TITLE ANIMATION
// ==========================================

function animateSectionTitles() {
    const titles = document.querySelectorAll('.section-title');
    titles.forEach((title, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'title-underline 0.8s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(title);
    });
}

// ==========================================
// 8. CARD HOVER EFFECTS
// ==========================================

function addCardHoverEffects() {
    const cards = document.querySelectorAll('.event-card, .gift-card, .timeline-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(233, 30, 99, 0.3)';
            
            // Thêm sparkles
            const rect = this.getBoundingClientRect();
            for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                    const x = rect.left + Math.random() * rect.width;
                    const y = rect.top + Math.random() * rect.height;
                    new Sparkle(x, y);
                }, i * 100);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

// ==========================================
// 9. COUNTDOWN TIMER ANIMATION
// ==========================================

function animateCountdownNumbers() {
    const numbers = document.querySelectorAll('.countdown-number');
    numbers.forEach(num => {
        num.style.animation = 'countdown-pulse 1s ease-in-out infinite';
    });
}

// ==========================================
// 10. MUSIC BUTTON ANIMATION
// ==========================================

function setupMusicButtonAnimation() {
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    
    if (musicBtn && bgMusic) {
        bgMusic.addEventListener('play', function() {
            musicBtn.classList.add('playing');
        });
        
        bgMusic.addEventListener('pause', function() {
            musicBtn.classList.remove('playing');
        });
    }
}

// ==========================================
// 11. GALLERY ITEM HOVER EFFECT
// ==========================================

function addGalleryHoverEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(2deg)';
            
            // Thêm sparkles xung quanh ảnh
            const rect = this.getBoundingClientRect();
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const x = rect.left + rect.width / 2 + Math.cos(angle) * 80;
                const y = rect.top + rect.height / 2 + Math.sin(angle) * 80;
                new Sparkle(x, y);
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// ==========================================
// 12. COUPLE NAMES RING ANIMATION
// ==========================================

function addCoupleNamesAnimation() {
    const coupleRing = document.querySelector('.hero-amp');
    if (coupleRing) {
        coupleRing.classList.add('couple-ring');
    }
}

// ==========================================
// 13. ROMANTIC FADE IN ON SCROLL
// ==========================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('romantic-fade');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.story-intro, .family-card, .event-card, .gift-card').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// 14. BUTTON GLOW EFFECT
// ==========================================

function addButtonGlowEffect() {
    const buttons = document.querySelectorAll('.btn-theme-primary, .btn-theme-secondary');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.animation = 'button-glow 0.6s ease-in-out';
        });
    });
}

// ==========================================
// 15. WAVE EFFECT FOR ELEMENTS
// ==========================================

function addWaveEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.classList.add('wave-effect');
        el.style.animationDelay = (index * 0.2) + 's';
    });
}

// ==========================================
// 16. HEARTBEAT EFFECT
// ==========================================

function addHeartbeatEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.add('heartbeat');
    });
}

// ==========================================
// 17. SHIMMER EFFECT
// ==========================================

function addShimmerEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.add('shimmer-effect');
    });
}

// ==========================================
// 18. FIREWORKS INTRO ON HERO
// ==========================================

function addFireworksIntro() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height * 0.35;
        createFireworkExplosion(centerX, centerY, 18);
        setTimeout(() => createFireworkExplosion(centerX + 120, centerY - 40, 14), 400);
        setTimeout(() => createFireworkExplosion(centerX - 120, centerY - 60, 14), 800);
    }
}

// ==========================================
// 19. INTERACTIVE MOUSE TRAIL
// ==========================================

function setupMouseTrail() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Tạo particle hiệu ứng mỗi 50ms
        if (Math.random() > 0.95) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = mouseX + 'px';
            particle.style.top = mouseY + 'px';
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.backgroundColor = '#e91e63';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.opacity = '0.5';
            particle.style.zIndex = '1';
            
            document.body.appendChild(particle);
            
            // Animate particle
            let opacity = 0.5;
            const interval = setInterval(() => {
                opacity -= 0.05;
                particle.style.opacity = opacity;
                if (opacity <= 0) {
                    clearInterval(interval);
                    particle.remove();
                }
            }, 30);
        }
    });
}

// ==========================================
// 20. INITIALIZE ALL EFFECTS
// ==========================================

function initializeWeddingEffects() {
    console.log('🎉 Initializing Wedding Special Effects...');
    
    // Chạy các hiệu ứng
    startFireworks();
    addFireworksIntro();
    animateHeroSection();
    animateSectionTitles();
    addCardHoverEffects();
    animateCountdownNumbers();
    setupMusicButtonAnimation();
    addGalleryHoverEffects();
    addCoupleNamesAnimation();
    setupScrollAnimations();
    addButtonGlowEffect();
    addHeartbeatEffect('.hero-amp i');
    setupMouseTrail();
    
    // Thêm hiệu ứng cho các phần tử cụ thể
    addWaveEffect('.countdown-item');

    // Premium theme (luxury) enhancements
    enablePremiumTheme();
    startGoldenParticles();
    
    console.log('✨ Wedding Effects Ready!');
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeWeddingEffects();
});

// Khởi động hiệu ứng ngay cả khi DOM chưa sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWeddingEffects);
} else {
    initializeWeddingEffects();
}

// ==========================================
// EXPORT FUNCTIONS FOR MANUAL USE
// ==========================================

window.WeddingEffects = {
    triggerConfetti,
    createFloatingHeart,
    createParticleEffect,
    startFireworks,
    addSparkleEffect,
    addCardHoverEffects,
    addGalleryHoverEffects
};

