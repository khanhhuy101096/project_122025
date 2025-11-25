// ===== MUSIC CONTROL =====
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

musicToggle.addEventListener('click', function() {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        isPlaying = false;
    } else {
        bgMusic.play();
        musicToggle.classList.add('playing');
        isPlaying = true;
    }
});

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
    // Đặt ngày cưới: 16 tháng 01 năm 2025
    const weddingDate = new Date('2025-12-09T18:30:00').getTime();
    
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<p style="text-align: center; font-size: 24px;">Cảm ơn bạn đã chia sẻ niềm vui này! 💕</p>';
    }
}

// Cập nhật countdown mỗi giây
setInterval(updateCountdown, 1000);
updateCountdown(); // Gọi lần đầu

// ===== SMOOTH SCROLL =====
function smoothScroll(target) {
    const element = document.getElementById(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== GALLERY LIGHTBOX =====
// Will be filled from DOM to keep HTML as the source of truth
let galleryImages = [];

// Gallery thumbnails are now hardcoded in HTML for performance; keep galleryImages for lightbox only.

let currentImageIndex = 0;

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    currentImageIndex = index;
    lightboxImg.src = galleryImages[index];
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeLightbox(n) {
    currentImageIndex += n;
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    document.getElementById('lightboxImg').src = galleryImages[currentImageIndex];
}

// Đóng lightbox khi click ngoài ảnh
document.addEventListener('click', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Điều khiển lightbox bằng phím mũi tên
document.addEventListener('keydown', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'block') {
        if (event.key === 'ArrowLeft') {
            changeLightbox(-1);
        } else if (event.key === 'ArrowRight') {
            changeLightbox(1);
        } else if (event.key === 'Escape') {
            closeLightbox();
        }
    }
});

// ===== RSVP FORM SUBMISSION =====
const rsvpForm = document.getElementById('rsvpForm');

rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const guests = document.getElementById('guests').value;
    const menu = document.getElementById('menu').value;
    const wishes = document.getElementById('wishes').value;
    
    // Tạo tin nhắn để gửi
    const message = `Xác nhận tham dự cưới:\n\nHọ tên: ${name}\nSố điện thoại: ${phone}\nSố người: ${guests}\nThực đơn: ${menu}\nLời chúc: ${wishes}`;
    
    // Gửi qua Zalo (thay đổi số điện thoại)
    const zaloPhone = '0123456789'; // Thay bằng số Zalo của bạn
    const zaloUrl = `https://zalo.me/${zaloPhone}?text=${encodeURIComponent(message)}`;
    
    // Hoặc gửi qua email
    const emailUrl = `mailto:couple@example.com?subject=Xác nhận tham dự cưới&body=${encodeURIComponent(message)}`;
    
    // Hiển thị thông báo thành công
    if (window.M && M.toast) { M.toast({html: 'Cảm ơn bạn đã xác nhận! Chúng tôi sẽ liên hệ lại với bạn sớm.', classes: 'pink'}); } else { alert('Cảm ơn bạn đã xác nhận! Chúng tôi sẽ liên hệ lại với bạn sớm.'); }
    
    // Lưu dữ liệu vào localStorage
    const rsvpData = {
        name,
        phone,
        guests,
        menu,
        wishes,
        date: new Date().toLocaleString('vi-VN')
    };
    
    let allRsvp = JSON.parse(localStorage.getItem('rsvpList')) || [];
    allRsvp.push(rsvpData);
    localStorage.setItem('rsvpList', JSON.stringify(allRsvp));
    
    // Reset form
    rsvpForm.reset();
    
    // Tùy chọn: Mở Zalo hoặc Email
    // window.open(zaloUrl, '_blank');
    // window.open(emailUrl);
});

// ===== OPEN MAP =====
function openMap(address) {
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Quan sát các phần tử có class 'fade-in'
document.querySelectorAll('.timeline-item, .event-card, .gallery-item, .guestbook-item, .gift-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== GUESTBOOK FORM (Optional) =====
// Bạn có thể thêm form để khách để lại lời chúc
// Dưới đây là ví dụ cơ bản

function addGuestbookEntry(name, message) {
    const guestbookWall = document.getElementById('guestbookWall');
    
    const newEntry = document.createElement('div');
    newEntry.className = 'guestbook-item';
    newEntry.innerHTML = `
        <div class="guestbook-header">
            <strong>${name}</strong>
            <span class="guestbook-date">${new Date().toLocaleDateString('vi-VN')}</span>
        </div>
        <p>${message}</p>
    `;
    
    guestbookWall.insertBefore(newEntry, guestbookWall.firstChild);
    
    // Lưu vào localStorage
    let guestbook = JSON.parse(localStorage.getItem('guestbook')) || [];
    guestbook.push({
        name,
        message,
        date: new Date().toLocaleDateString('vi-VN')
    });
    localStorage.setItem('guestbook', JSON.stringify(guestbook));
}

// ===== LOAD GUESTBOOK FROM LOCALSTORAGE =====
function loadGuestbook() {
    const guestbook = JSON.parse(localStorage.getItem('guestbook')) || [];
    const guestbookWall = document.getElementById('guestbookWall');
    
    // Xóa các entry mặc định nếu có dữ liệu lưu
    if (guestbook.length > 0) {
        guestbookWall.innerHTML = '';
        guestbook.forEach(entry => {
            const entryEl = document.createElement('div');
            entryEl.className = 'guestbook-item';
            entryEl.innerHTML = `
                <div class="guestbook-header">
                    <strong>${entry.name}</strong>
                    <span class="guestbook-date">${entry.date}</span>
                </div>
                <p>${entry.message}</p>
            `;
            guestbookWall.appendChild(entryEl);
        });
    }
}

// Gọi hàm load guestbook khi trang tải
loadGuestbook();

// ===== LOAD RSVP FROM LOCALSTORAGE (FOR ADMIN) =====
function getRsvpList() {
    return JSON.parse(localStorage.getItem('rsvpList')) || [];
}

// Bạn có thể gọi hàm này trong console để xem danh sách RSVP
console.log('Để xem danh sách RSVP, gõ: getRsvpList()');

// ===== PARALLAX EFFECT (fallback if Materialize not present) =====
(function(){
    if (!document.querySelector('.parallax')) {
        window.addEventListener('scroll', function() {
            const hero = document.querySelector('.hero-img');
            if (hero) {
                const scrollPosition = window.pageYOffset;
                hero.style.transform = `translateY(${scrollPosition * 0.5}px)`;
            }
        });
    }
})();

// ===== MOBILE MENU SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ===== AUTO-PLAY MUSIC ON FIRST INTERACTION =====
document.addEventListener('click', function() {
    if (!isPlaying) {
        bgMusic.play().catch(error => {
            console.log('Autoplay bị chặn:', error);
        });
        musicToggle.classList.add('playing');
        isPlaying = true;
    }
}, { once: true });

// ===== FORM VALIDATION =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone.replace(/\D/g, ''));
}

// Thêm validation cho RSVP form
rsvpForm.addEventListener('submit', function(e) {
    const phone = document.getElementById('phone').value;
    
    if (!validatePhone(phone)) {
        e.preventDefault();
        alert('Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)');
        return;
    }
});

// ===== PRINT FUNCTION =====
function printInvitation() {
    window.print();
}

// ===== SHARE FUNCTION =====
function shareInvitation() {
    const text = 'Mời bạn tham dự đám cưới của Lâm & Hương - 16/01/2025';
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Thiệp Cưới Điện Tử',
            text: text,
            url: url
        });
    } else {
        // Fallback: Copy link
        navigator.clipboard.writeText(url);
        alert('Link đã được sao chép!');
    }
}

// ===== THEME SWITCHER =====
function applyTheme(themeKey) {
    const body = document.body;
    body.classList.remove('theme-indigo-pink', 'theme-purple-teal', 'theme-deep-purple-amber');
    switch (themeKey) {
        case 'purple-teal':
            body.classList.add('theme-purple-teal');
            break;
        case 'deep-purple-amber':
            body.classList.add('theme-deep-purple-amber');
            break;
        case 'indigo-pink':
        default:
            body.classList.add('theme-indigo-pink');
            break;
    }
    localStorage.setItem('wedding_theme', themeKey);
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website thiệp cưới đã tải xong!');

    if (window.M && M.AutoInit) {
        M.AutoInit();
    }

    // Init theme from storage
    const storedTheme = localStorage.getItem('wedding_theme') || 'indigo-pink';
    applyTheme(storedTheme);
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = storedTheme;
        themeSelect.addEventListener('change', function() {
            applyTheme(this.value);
            if (window.M && M.toast) {
                M.toast({ html: 'Đã áp dụng bảng màu: ' + this.options[this.selectedIndex].text, classes: 'theme-toast' });
            }
        });
    }

    // Nếu dùng Materialize parallax, bỏ parallax thủ công
    const materialParallaxImg = document.querySelector('.parallax img');
    if (materialParallaxImg) {
        window.removeEventListener('scroll', null);
    }
    
    // Build lightbox image list from static HTML thumbnails
    galleryImages = Array.from(document.querySelectorAll('.gallery-grid .gallery-item img')).map(img => img.getAttribute('src'));

    // Apply fade-in animations to gallery items (static HTML)
    document.querySelectorAll('.gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Thêm các sự kiện khác nếu cần
});

