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

// ── MODAL PRODUK ──
function initModal() {
    const overlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');

    if (overlay) overlay.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Klik foto atau area card (selain tombol)
    document.querySelectorAll('.produk-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            openModal(card);
        });
    });
}

function openModal(card) {
    const img = card.querySelector('.produk-img img');
    const nama = card.querySelector('h4').textContent.trim();
    const kategori = card.querySelector('.produk-kategori').textContent.trim();
    const stars = card.querySelector('.produk-rating .stars').textContent.trim();
    const ulasan = card.querySelector('.produk-rating span:last-child').textContent.trim();
    const hargaUtama = card.querySelector('.harga-utama').textContent.trim();
    const hargaAsliNumber = parseInt(card.dataset.harga) || 0; // Ambil harga numerik dari dataset
    const hargaCoret = card.querySelector('.harga-coret');
    const hargaDiskon = card.querySelector('.harga-diskon');
    const badge = card.querySelector('.produk-badge');
    const deskripsi = card.dataset.deskripsi || '-';
    const baris = deskripsi.split('@@');

    // Isi konten modal
    document.getElementById('modalImg').innerHTML = `<img src="${img.src}" alt="${nama}">`;
    document.getElementById('modalNama').textContent = nama;
    document.getElementById('modalKategori').textContent = kategori;
    document.getElementById('modalRating').innerHTML = `<span class="stars">${stars}</span> ${ulasan}`;
    document.getElementById('modalDeskripsi').innerHTML = baris
    .map(b => {
        const poin = b.split('|');
        if (poin.length > 1) {
            return poin.map(p => `<span style="display:block; margin-bottom:4px;">• ${p.trim()}</span>`).join('');
        }
        return `<span style="display:block; margin-bottom:6px;">${b.trim()}</span>`;
    })
    .join('');

    // Badge
    const modalBadge = document.getElementById('modalBadge');
    if (badge) {
        modalBadge.textContent = badge.textContent.trim();
        modalBadge.className = 'modal-badge ' + [...badge.classList]
            .find(c => ['terlaris', 'baru', 'diskon'].includes(c));
    } else {
        modalBadge.className = 'modal-badge kosong';
    }

    // Harga
    let hargaHTML = `<span class="harga-utama">${hargaUtama}</span>`;
    if (hargaCoret) hargaHTML += `<span class="harga-coret">${hargaCoret.textContent}</span>`;
    if (hargaDiskon) hargaHTML += `<span class="harga-diskon">${hargaDiskon.textContent}</span>`;
    document.getElementById('modalHarga').innerHTML = hargaHTML;

    // 💡 PERBAIKAN: Fungsi Tombol Keranjang & Beli di Modal
    const btnKeranjang = document.getElementById('modalBtnKeranjang');
    const btnBeli = document.getElementById('modalBtnBeli');
    
    // 1. Logika Tambah ke Keranjang
    btnKeranjang.onclick = () => { 
        // Panggil fungsi cart.js secara manual dengan memberikan referensi elemen button ini
        // Kita simulasikan struktur DOM card agar fungsi addToCart di cart.js tetap berjalan normal
        card.querySelector('.btn-keranjang').click(); 
        closeModal(); 
    };

    // 2. Logika Beli Langsung (Checkout)
    btnBeli.onclick = () => { 
        closeModal(); 
        
        // Cek login sebelum checkout
        const activeUserName = JSON.parse(sessionStorage.getItem('zoon_active_user'));
        if (!activeUserName) {
            alert("Silakan Login terlebih dahulu untuk melakukan checkout pesanan.");
            window.location.href = "Login.html";
            return;
        }

        // Bentuk array item untuk dikirim ke popup checkout
        const item = [{ 
            name: nama, 
            harga: hargaAsliNumber, 
            img: img.src, 
            qty: 1 
        }];
        
        // Panggil fungsi openCheckout yang ada di cart.js
        if(typeof openCheckout === "function") {
            openCheckout(item, false);
        }
    };

    document.getElementById('modalOverlay').classList.add('show');
    document.getElementById('modalProduk').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.getElementById('modalProduk').classList.remove('show');
    document.body.style.overflow = '';
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
    initModal();
});

// ── SISTEM POPUP DARI BERANDA KE SHOP ──
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const produkId = urlParams.get('produk');

    if (produkId) {
        // Data 8 produk dari slider beranda
        const dataProdukSlider = {
            'RCKitten': {
                img: '../foto/R-C_Kitten.jpg', kategori: 'Makanan hewan', nama: 'Royal Canin Kitten - wet food 85gr isi 12pcs',
                rating: '<i class="fas fa-star" style="color:#f59e0b;"></i> 4.9 (128 ulasan)', badge: '🔥 Terlaris', classBadge: 'terlaris',
                harga: '<span class="harga-utama">Rp 285.000</span><span class="harga-coret" style="text-decoration:line-through; font-size:12px; color:#64748b;">Rp 320.000</span>',
                desc: 'Makanan basah premium untuk anak kucing (kitten) yang mendukung pertumbuhan optimal dan kekebalan tubuh.'
            },
            'RCHairSkin': {
                img: '../foto/Royal-canin-hair-skin-care.webp', kategori: 'Makanan hewan', nama: 'Royal Canin Hair & Skin Care Adult - dry food 4KG',
                rating: '<i class="fas fa-star" style="color:#f59e0b;"></i> 4.8 (87 ulasan)', badge: '✨ Baru', classBadge: 'baru',
                harga: '<span class="harga-utama">Rp 632.700</span>',
                desc: 'Makanan kering khusus untuk menjaga kesehatan kulit dan keindahan bulu kucing dewasa.'
            },
            'TasAstronot': {
                img: '../foto/Tas Kucing Astronot.webp', kategori: 'Aksesoris', nama: 'Tas kucing astronot transparan',
                rating: '<i class="fas fa-star" style="color:#f59e0b;"></i> 5.0 (203 ulasan)', badge: '🏷️ -30%', classBadge: 'diskon',
                harga: '<span class="harga-utama">Rp 162.400</span><span class="harga-coret" style="text-decoration:line-through; font-size:12px; color:#64748b;">Rp 232.500</span>',
                desc: 'Tas carrier ransel astronot transparan agar anabul bisa melihat pemandangan saat jalan-jalan.'
            },
            'TaliAnjing': {
                img: '../foto/Tali_anjing.jfif', kategori: 'Aksesoris', nama: 'Tali anjing adjustable - bisa custom nama',
                rating: '<i class="fas fa-star" style="color:#f59e0b;"></i> 4.7 (64 ulasan)', badge: '', classBadge: '',
                harga: '<span class="harga-utama">Rp 25.000</span>',
                desc: 'Tali tuntun (leash) anjing yang kuat dan nyaman. Bisa custom cetak nama peliharaan Anda.'
            },
            'WhiskasAdult': {
                img: '../foto/w_mackarel_80.webp', kategori: 'Makanan hewan', nama: 'Whiskas Adult 1+ Mackerel Flavour - wet 80gr',
                rating: '<i class="fas fa-star" style="color:#f59e0b;"></i> 4.9 (156 ulasan)', badge: '🔥 Terlaris', classBadge: 'terlaris',
                harga: '<span class="harga-utama">Rp 9.000</span><span class="harga-coret" style="text-decoration:line-through; font-size:12px; color:#64748b;">Rp 10.000</span>',
                desc: 'Makanan basah rasa makarel yang lezat dan bergizi lengkap untuk kucing dewasa.'
            },
            'KandangHamster': {
                img: '../foto/kandang_hamster.jpeg', kategori: 'Kandang', nama: 'Kandang hamster luas - bonus hamster wheel',
                rating: '<i class="fas fa-star" style="color:#f59e0b;"></i> 4.8 (42 ulasan)', badge: '✨ Baru', classBadge: 'baru',
                harga: '<span class="harga-utama">Rp 289.000</span>',
                desc: 'Kandang hamster tingkat yang luas, sudah termasuk bonus mainan roda putar (wheel).'
            },
            'PedigreeAdult': {
                img: '../foto/Pedigree PRO High Protein Adult Mini & Small Breed.jpeg', kategori: 'Makanan Anjing', nama: 'Pedigree PRO High Protein Adult Mini 1.3KG',
                rating: '<i class="fas fa-star" style="color:#f59e0b;"></i> 4.7 (38 ulasan)', badge: '', classBadge: '',
                harga: '<span class="harga-utama">Rp 165.000</span>',
                desc: 'Makanan anjing tinggi protein untuk menjaga massa otot dan energi anjing ras kecil.'
            },
            'MainanGigitan': {
                img: '../foto/mainan gigitan hewan.webp', kategori: 'Mainan', nama: 'Mainan gigitan hewan - TPR Rubber Premium',
                rating: '<i class="fas fa-star" style="color:#f59e0b;"></i> 5.0 (91 ulasan)', badge: '🏷️ -20%', classBadge: 'diskon',
                harga: '<span class="harga-utama">Rp 7.900</span><span class="harga-coret" style="text-decoration:line-through; font-size:12px; color:#64748b;">Rp 10.000</span>',
                desc: 'Mainan gigitan bahan karet TPR yang awet dan membantu membersihkan karang gigi hewan.'
            }
        };

        const item = dataProdukSlider[produkId];
        
        if (item) {
            // Inject data ke HTML Modal
            document.getElementById('modalImg').innerHTML = `<img src="${item.img}" alt="${item.nama}" style="width:100%; height:100%; object-fit:contain;">`;
            document.getElementById('modalKategori').innerHTML = item.kategori;
            document.getElementById('modalNama').innerHTML = item.nama;
            document.getElementById('modalRating').innerHTML = item.rating;
            document.getElementById('modalDeskripsi').innerHTML = item.desc;
            document.getElementById('modalHarga').innerHTML = item.harga;
            
            const badgeEl = document.getElementById('modalBadge');
            if (item.badge !== '') {
                badgeEl.className = `modal-badge ${item.classBadge}`;
                badgeEl.innerHTML = item.badge;
            } else {
                badgeEl.className = 'modal-badge kosong';
                badgeEl.innerHTML = '';
            }

            // Tampilkan Modal
            const modalOverlay = document.getElementById('modalOverlay');
            const modalProduk = document.getElementById('modalProduk');
            
            modalOverlay.classList.add('show');
            modalProduk.classList.add('show');
            document.body.style.overflow = 'hidden';

            setTimeout(() => { document.querySelector('.shop-section').scrollIntoView({ behavior: 'smooth' }); }, 100);

            // Bersihkan URL saat ditutup
            const cleanUrl = () => {
                window.history.replaceState({}, document.title, window.location.pathname);
                modalOverlay.classList.remove('show');
                modalProduk.classList.remove('show');
                document.body.style.overflow = '';
            };

            document.getElementById('modalClose').addEventListener('click', cleanUrl);
            modalOverlay.addEventListener('click', cleanUrl);
        }
    }
});