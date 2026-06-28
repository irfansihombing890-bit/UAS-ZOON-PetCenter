// ── PAGINATION ──
const ITEMS_PER_PAGE = 9;
let currentPage = 1;
 
function initPagination() {
    const cards = document.querySelectorAll('.produk-grid .produk-card');
    const totalPages = Math.ceil(cards.length / ITEMS_PER_PAGE);
 
    showPage(currentPage, cards);
    renderPaginationButtons(totalPages);
    updateToolbarInfo(cards.length);
}
 
function showPage(page, cards) {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
 
    cards.forEach((card, index) => {
        card.style.display = (index >= start && index < end) ? 'flex' : 'none';
    });
}
 
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
    const cards = document.querySelectorAll('.produk-grid .produk-card');
    const totalPages = Math.ceil(cards.length / ITEMS_PER_PAGE);
 
    if (page < 1 || page > totalPages) return;
 
    currentPage = page;
    showPage(currentPage, cards);
    renderPaginationButtons(totalPages);
    updateToolbarInfo(cards.length);
 
    // Scroll ke atas grid produk
    const grid = document.querySelector('.shop-main');
    if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
 
function updateToolbarInfo(totalItems) {
    const toolbarLeft = document.querySelector('.shop-toolbar-left');
    if (!toolbarLeft) return;
 
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
 
    toolbarLeft.innerHTML = `Menampilkan <strong>${start}–${end}</strong> dari <strong>${totalItems} produk</strong>`;
}
 
 
// ── WISHLIST ──
function toggleWishlist(btn) {
    btn.classList.toggle('active');
}
 
 
// ── CART NOTIFICATION ──
function addToCart(btn, productName) {
    const notif = document.getElementById('cartNotif');
    const notifText = document.getElementById('cartNotifText');
 
    if (!notif || !notifText) return;
 
    notifText.textContent = `"${productName}" ditambahkan!`;
    notif.classList.add('show');
 
    clearTimeout(notif._timeout);
    notif._timeout = setTimeout(() => {
        notif.classList.remove('show');
    }, 2500);
}
 
 
// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    initPagination();
});