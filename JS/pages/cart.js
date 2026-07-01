// ── CART STATE ──
let cart = JSON.parse(localStorage.getItem('zoonCart')) || [];

// ── SIMPAN KE LOCALSTORAGE ──
function saveCart() {
    localStorage.setItem('zoonCart', JSON.stringify(cart));
}

// ── TAMBAH PRODUK KE KERANJANG ──
function addToCart(btn, productName) {
    const card = btn.closest('.produk-card');
    const imgSrc = card.querySelector('.produk-img img').getAttribute('src');
    const hargaText = card.querySelector('.harga-utama').textContent;
    const harga = parseInt(card.dataset.harga);

    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            name: productName,
            harga: harga,
            hargaText: hargaText,
            img: imgSrc,
            qty: 1
        });
    }

    saveCart();
    renderCart();
    showCartNotif(productName);
}

// ── HAPUS PRODUK DARI KERANJANG ──
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// ── UBAH JUMLAH (+/-) ──
function changeQty(index, delta) {
    cart[index].qty += delta;

    if (cart[index].qty < 1) {
        removeFromCart(index);
        return;
    }

    saveCart();
    renderCart();
}

// ── FORMAT RUPIAH ──
function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

// ── RENDER ISI KERANJANG ──
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const navBadge = document.getElementById('navCartBadge');

    if (!cartItems) return;

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalHarga = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);

    if (cartCount) cartCount.textContent = totalQty;
    if (navBadge) navBadge.textContent = totalQty;
    if (cartTotal) cartTotal.textContent = formatRupiah(totalHarga);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang masih kosong</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <button class="cart-item-remove" onclick="removeFromCart(${index})">
                <i class="fas fa-times"></i>
            </button>
            <div class="cart-item-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.hargaText}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ── BUKA/TUTUP SIDEBAR ──
function openCart() {
    document.getElementById('cartSidebar').classList.add('show');
    document.getElementById('cartOverlay').classList.add('show');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('show');
    document.getElementById('cartOverlay').classList.remove('show');
}

// ── NOTIFIKASI SAAT TAMBAH PRODUK ──
function showCartNotif(productName) {
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
    renderCart();

    const cartIconBtn = document.getElementById('cartIconBtn');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartIconBtn) cartIconBtn.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
});