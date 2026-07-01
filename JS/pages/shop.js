// ── STATE ──
const ITEMS_PER_PAGE = 9;
let currentPage = 1;
let filteredCards = [];

// ── AMBIL SEMUA CARD ──
function getAllCards() {
    return Array.from(document.querySelectorAll('.produk-grid .produk-card'));
}


// ── FILTER & SORT ──
function applyFilters() {
    const allCards = getAllCards();

    // Ambil nilai filter kategori
    const activeKategori = document.querySelector('.filter-kategori a.active');
    const kategoriValue = activeKategori ? activeKategori.dataset.kategori : 'semua';

    // Ambil nilai slider harga
    const sliderMax = document.querySelector('.price-slider');
    const maxHarga = sliderMax ? parseInt(sliderMax.value) : 999999999;

    // Ambil nilai input harga min
    const inputMin = document.querySelector('.price-inputs input:first-child');
    const minHarga = inputMin ? parseInt(inputMin.value.replace(/\D/g, '')) || 0 : 0;

    // Ambil rating yang dicentang
    const checkedRatings = Array.from(document.querySelectorAll('.rating-filter input[type="checkbox"]:checked'))
        .map(cb => parseInt(cb.dataset.rating));

    // Ambil nilai sort
    const sortSelect = document.querySelector('.sort-select');
    const sortValue = sortSelect ? sortSelect.value : 'terpopuler';

    // Filter cards
    filteredCards = allCards.filter(card => {
        const cardKategori = card.dataset.kategori || '';
        const cardHarga = parseInt(card.dataset.harga) || 0;
        const cardRating = parseInt(card.dataset.rating) || 0;

        const lolosKategori = kategoriValue === 'semua' || cardKategori === kategoriValue;
        const lolosHarga = cardHarga >= minHarga && cardHarga <= maxHarga;
        const lolosRating = checkedRatings.length === 0 || checkedRatings.some(r => cardRating >= r);

        return lolosKategori && lolosHarga && lolosRating;
    });

    // Sort
    filteredCards.sort((a, b) => {
        const hargaA = parseInt(a.dataset.harga) || 0;
        const hargaB = parseInt(b.dataset.harga) || 0;
        const ratingA = parseInt(a.dataset.rating) || 0;
        const ratingB = parseInt(b.dataset.rating) || 0;

        if (sortValue === 'harga-asc') return hargaA - hargaB;
        if (sortValue === 'harga-desc') return hargaB - hargaA;
        if (sortValue === 'rating') return ratingB - ratingA;
        return 0; // terpopuler = urutan asli HTML
    });

    // Reset ke halaman 1 setiap filter berubah
    currentPage = 1;
    renderCards();
}

// ── TAMPILKAN CARD SESUAI FILTER & PAGE ──
function renderCards() {
    const allCards = getAllCards();
    const grid = document.querySelector('.produk-grid');

    // Sembunyikan semua dulu
    allCards.forEach(card => card.style.display = 'none');

    // Susun ulang urutan di DOM sesuai hasil sort
    filteredCards.forEach(card => grid.appendChild(card));

    // Tampilkan sesuai halaman
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    filteredCards.forEach((card, index) => {
        card.style.display = (index >= start && index < end) ? 'flex' : 'none';
    });

    const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
    renderPaginationButtons(totalPages);
    updateToolbarInfo(filteredCards.length);
}


// ── PAGINATION ──
function renderPaginationButtons(totalPages) {
    const pagination = document.querySelector('.shop-pagination');
    if (!pagination) return;

    pagination.innerHTML = '';

    // Tombol prev
    const prevBtn = document.createElement('a');
    prevBtn.href = '#';
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) goToPage(currentPage - 1);
    });
    pagination.appendChild(prevBtn);

    // Tombol nomor halaman
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('a');
        btn.href = '#';
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.dataset.page = i;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            goToPage(parseInt(btn.dataset.page));
        });
        pagination.appendChild(btn);
    }

    // Tombol next
    const nextBtn = document.createElement('a');
    nextBtn.href = '#';
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) goToPage(currentPage + 1);
    });
    pagination.appendChild(nextBtn);
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderCards();

    const shopMain = document.querySelector('.shop-main');
    if (shopMain) shopMain.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateToolbarInfo(totalItems) {
    const toolbarLeft = document.querySelector('.shop-toolbar-left');
    if (!toolbarLeft) return;

    if (totalItems === 0) {
        toolbarLeft.innerHTML = `<strong>0 produk</strong> ditemukan`;
        return;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
    toolbarLeft.innerHTML = `Menampilkan <strong>${start}–${end}</strong> dari <strong>${totalItems} produk</strong>`;
}


// ── INIT FILTER KATEGORI ──
function initKategoriFilter() {
    const links = document.querySelectorAll('.filter-kategori a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            applyFilters();
        });
    });
}

// otomatis menhitung jumlah barang sesuai kategori
function updateKategoriCount() {
    const allCards = getAllCards();
    const links = document.querySelectorAll('.filter-kategori a');

    links.forEach(link => {
        const kategori = link.dataset.kategori;
        const countSpan = link.querySelector('span');
        if (!countSpan) return;

        let jumlah;
        if (kategori === 'semua') {
            jumlah = allCards.length;
        } else {
            jumlah = allCards.filter(card => card.dataset.kategori === kategori).length;
        }

        countSpan.textContent = jumlah;
    });
}

// ── INIT FILTER HARGA ──
function initHargaFilter() {
    const slider = document.querySelector('.price-slider');
    const inputMax = document.querySelector('.price-inputs input:last-child');
    const inputMin = document.querySelector('.price-inputs input:first-child');

    if (slider) {
        slider.addEventListener('input', () => {
            const val = parseInt(slider.value).toLocaleString('id-ID');
            if (inputMax) inputMax.value = `Rp ${val}`;
            applyFilters();
        });
    }

    if (inputMin) {
        inputMin.addEventListener('change', () => applyFilters());
    }

    if (inputMax) {
        inputMax.addEventListener('change', () => applyFilters());
    }
}

// ── INIT FILTER RATING ──
function initRatingFilter() {
    // Tambahkan data-rating ke setiap checkbox rating
    const checkboxes = document.querySelectorAll('.rating-filter input[type="checkbox"]');
    const ratingValues = [5, 4, 3, 2]; // urutan dari atas ke bawah di HTML
    checkboxes.forEach((cb, index) => {
        cb.dataset.rating = ratingValues[index] || (5 - index);
        cb.addEventListener('change', () => applyFilters());
    });
}

// ── INIT SORT ──
function initSort() {
    const sortSelect = document.querySelector('.sort-select');
    if (!sortSelect) return;

    // Ganti opsi sort sesuai permintaan
    sortSelect.innerHTML = `
        <option value="terpopuler">Urutkan: Rekomendasi</option>
        <option value="harga-asc">Harga: Rendah ke Tinggi</option>
        <option value="harga-desc">Harga: Tinggi ke Rendah</option>
        <option value="rating">Rating Tertinggi</option>
    `;

    sortSelect.addEventListener('change', () => applyFilters());
}

// ── HAPUS TOMBOL GRID/LIST ──
function removeViewToggle() {
    const viewToggle = document.querySelector('.view-toggle');
    if (viewToggle) viewToggle.remove();
}


// ── WISHLIST ──
function toggleWishlist(btn) {
    btn.classList.toggle('active');
}



// ── INIT SEMUA ──
document.addEventListener('DOMContentLoaded', () => {
    removeViewToggle();
    initSort();
    initKategoriFilter();
    initHargaFilter();
    initRatingFilter();
    updateKategoriCount();  
    applyFilters(); // jalankan filter pertama kali untuk set filteredCards
});