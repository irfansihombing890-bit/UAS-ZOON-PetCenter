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

        // Update 3D Cards Kanan
        cards.forEach((card, i) => {
            card.className = 'slider-card'; // Reset semua class
            
            if (i === index) {
                card.classList.add('active');
            } else if (i === (index + 1) % totalSlides) {
                card.classList.add('next');
            } else {
                card.classList.add('prev');
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