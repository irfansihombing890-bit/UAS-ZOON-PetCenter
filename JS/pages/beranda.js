document.addEventListener("DOMContentLoaded", () => {
    // 1. Mengambil elemen dari HTML
    const btnPanggil = document.getElementById("toggleAnimalsBtn");
    const pemandangan = document.getElementById("sceneryArea");
    const hewanAtas = document.getElementById("topAnimalsArea");
    
    let isTampil = false;

    // 2. Jika tombol ditemukan, pasang logika klik
    if (btnPanggil) {
        btnPanggil.addEventListener("click", (e) => {
            e.preventDefault(); 
            
            // Cari elemen Teks dan elemen Ikon SVG di dalam tombol
            const teksTombol = btnPanggil.querySelector(".btn-text");
            const ikonSvg = btnPanggil.querySelector(".paw-icon");
            
            // Ubah status
            isTampil = !isTampil;
            
            if (isTampil) {
                // SAAT HEWAN MUNCUL: Ganti Teks & Sembunyikan Ikon SVG
                if (teksTombol) teksTombol.innerText = "Biarkan Mereka Istirahat 🌙";
                if (ikonSvg) ikonSvg.style.display = "none"; // HILANGKAN IKON
                
                btnPanggil.classList.add("active-state");
                if (pemandangan) pemandangan.classList.add("active");
                if (hewanAtas) hewanAtas.classList.add("active");
            } else {
                // SAAT HEWAN SEMBUNYI: Kembalikan Teks & Munculkan Ikon SVG
                if (teksTombol) teksTombol.innerText = "Panggil Pet"; 
                if (ikonSvg) ikonSvg.style.display = ""; // MUNCULKAN IKON KEMBALI
                
                btnPanggil.classList.remove("active-state");
                if (pemandangan) pemandangan.classList.remove("active");
                if (hewanAtas) hewanAtas.classList.remove("active");
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slide');
    const cards = document.querySelectorAll('.slider-card');
    const progressBar = document.getElementById('progress-bar');
    const sliderContainer = document.getElementById('card-slider');

    cards.forEach(card => {
        const bgUrl = card.getAttribute('data-bg-horizontal');
        if (bgUrl) {
            const preloadImg = new Image();
            preloadImg.src = bgUrl;
        }
    });
    
    let currentIndex = 0;
    const totalSlides = cards.length;
    let autoPlayTimer;

// Fungsi untuk memperbarui tampilan slide dan card
function updateSlider(index) {
    // Update Teks Kiri
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) slide.classList.add('active');
    });

    // Update 3D Cards Kanan & Background Layer
    cards.forEach((card, i) => {
        card.className = 'slider-card'; // Reset semua class
        
        // Mengambil elemen div hero-bg sesuai nomor index (0, 1, atau 2)
        const bgLayer = document.getElementById(`hero-bg-${i}`);
        
        if (i === index) {
            card.classList.add('active');
            
            // ===== KODE BARU: GANTI BACKGROUND VIA OPACITY LAYER =====
            if (bgLayer) {
                // Jika gambar belum pernah di-load di div ini, kita setel
                if (!bgLayer.style.backgroundImage) {
                    const bgHorizontal = card.getAttribute('data-bg-horizontal');
                    bgLayer.style.backgroundImage = `linear-gradient(rgba(11, 27, 61, 0.75), rgba(11, 27, 61, 0.75)), url('${bgHorizontal}')`;
                }
                // Munculkan secara halus (trigger CSS opacity)
                bgLayer.classList.add('active');
            }
            // =========================================================

        } else {
            if (i === (index + 1) % totalSlides) {
                card.classList.add('next');
            } else {
                card.classList.add('prev');
            }
            
            // Sembunyikan layer background yang tidak aktif
            if (bgLayer) bgLayer.classList.remove('active');
        }
    });

    // Reset dan mulai ulang animasi Progress Bar
    progressBar.style.animation = 'none';
    void progressBar.offsetWidth; // Memicu reflow DOM agar animasi mengulang
    progressBar.style.animation = 'fillProgress 5s linear forwards';
}

    // Fungsi untuk pindah ke slide berikutnya
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider(currentIndex);
    }

    // Fungsi untuk pindah ke slide sebelumnya
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider(currentIndex);
    }

    // Fungsi untuk memulai timer otomatis
    function startAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    // Event Listener untuk klik pada Card
    cards.forEach((card) => {
        card.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            currentIndex = index;
            updateSlider(currentIndex);
            startAutoPlay(); // Reset timer setelah diklik
        });
    });

    // Fitur Swipe (Geser) untuk perangkat Mobile/Touch
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        // Geser ke kiri (Next)
        if (touchStartX - touchEndX > 50) {
            nextSlide();
            startAutoPlay();
        }
        // Geser ke kanan (Prev)
        if (touchEndX - touchStartX > 50) {
            prevSlide();
            startAutoPlay();
        }
    }

    // Inisialisasi Pertama
    updateSlider(currentIndex);
    startAutoPlay();
});

// ── MOUSE WHEEL SCROLL UNTUK SHOP SLIDER ──
document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track.horizontal-scroll');
    
    if (sliderTrack) {
        sliderTrack.addEventListener('wheel', (evt) => {
            // Menggunakan Math.abs agar deteksi roda mouse akurat tanpa konflik
            if (Math.abs(evt.deltaY) > 0) {
                evt.preventDefault(); // Matikan scroll layar sesaat
                sliderTrack.scrollLeft += evt.deltaY; // Paksa elemen bergeser ke samping
            }
        }, { passive: false });
    }
});

/* ======================================================
   SHOP SECTION — ANIMASI SCROLL (IntersectionObserver)
   Tempel di bagian paling BAWAH file beranda.js
   ====================================================== */

   (function () {
    'use strict';

    /* Tandai bahwa JS aktif → CSS baru pakai kelas ini untuk
       menyembunyikan kartu sebelum animasi masuk */
    document.documentElement.classList.add('js-animations');

    var shopSection = document.querySelector('.shop-slider');
    var cards       = document.querySelectorAll('.shop-slider .slider-item.produk-card');

    if (!shopSection || !cards.length) return;

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                /* 1 — Animasikan section header dari atas */
                shopSection.classList.add('is-visible');

                /* 2 — Munculkan setiap kartu dengan jeda 80ms */
                cards.forEach(function (card, index) {
                    setTimeout(function () {
                        card.classList.add('card-visible');
                    }, index * 80);
                });

                /* Hentikan observing setelah satu kali trigger */
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.1 } /* trigger saat 10% section masuk layar */
    );

    observer.observe(shopSection);

})();