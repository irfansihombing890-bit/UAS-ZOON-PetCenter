// ==========================================
// 1. STATE & UTILITY KERANJANG
// ==========================================
let cart = JSON.parse(localStorage.getItem('zoonCart')) || [];

function saveCart() {
    localStorage.setItem('zoonCart', JSON.stringify(cart));
}

function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

// ==========================================
// 2. FUNGSI KERANJANG UTAMA
// ==========================================
function addToCart(btn, productName) {
    const card = btn.closest('.produk-card');
    const imgSrc = card.querySelector('.produk-img img').getAttribute('src');
    const hargaText = card.querySelector('.harga-utama').textContent;
    const harga = parseInt(card.dataset.harga);

    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name: productName, harga: harga, hargaText: hargaText, img: imgSrc, qty: 1 });
    }

    saveCart();
    renderCart();
    showCartNotif(productName);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart(); renderCart();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty < 1) { removeFromCart(index); return; }
    saveCart(); renderCart();
}

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
        cartItems.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Keranjang masih kosong</p></div>`;
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <button class="cart-item-remove" onclick="removeFromCart(${index})"><i class="fas fa-times"></i></button>
            <div class="cart-item-img"><img src="${item.img}" alt="${item.name}"></div>
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

function openCart() {
    document.getElementById('cartSidebar').classList.add('show');
    document.getElementById('cartOverlay').classList.add('show');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('show');
    document.getElementById('cartOverlay').classList.remove('show');
}

function showCartNotif(productName) {
    const notif = document.getElementById('cartNotif');
    const notifText = document.getElementById('cartNotifText');
    if (!notif || !notifText) return;
    notifText.textContent = `"${productName}" ditambahkan!`;
    notif.classList.add('show');
    clearTimeout(notif._timeout);
    notif._timeout = setTimeout(() => { notif.classList.remove('show'); }, 2500);
}


// ==========================================
// 3. SISTEM CHECKOUT (VALIDATION & VERIFICATION DOM)
// ==========================================

let currentCheckoutItems = [];
let isFromCart = false;

// A. Fungsi Buka Checkout Popup
function openCheckout(itemsArray, fromCart = false) {
    // VERIFIKASI: Cek apakah user sudah login di session
    const activeUserName = JSON.parse(sessionStorage.getItem('zoon_active_user'));
    if (!activeUserName) {
        alert("Silakan Login terlebih dahulu untuk melakukan checkout pesanan.");
        window.location.href = "Login.html";
        return;
    }

    if (itemsArray.length === 0) {
        alert("Tidak ada produk untuk dicheckout!");
        return;
    }

    // Ambil detail user yang sedang login
    const users = JSON.parse(sessionStorage.getItem('zoon_users')) || [];
    const activeUser = users.find(u => u.fullname === activeUserName);

    // AUTOFILL (Disuntik ke DOM dan dikunci/disabled)
    if (activeUser) {
        document.getElementById('coName').value = activeUser.fullname;
        document.getElementById('coEmail').value = activeUser.email;
        document.getElementById('coPhone').value = activeUser.phone;
    }

    // RESET STATE & INPUT MANUAL
    document.querySelectorAll('.co-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.co-form-group input, .co-form-group textarea, .co-form-group select').forEach(el => {
        el.style.borderColor = '#eee';
    });
    document.getElementById('coAltPhone').value = '';
    document.getElementById('coAddress').value = '';
    document.getElementById('coNotes').value = '';
    document.getElementById('coPaymentMethod').value = '';

    // Render Ringkasan Pesanan
    const orderContainer = document.getElementById('coOrderItems');
    let total = 0;
    orderContainer.innerHTML = itemsArray.map(item => {
        total += (item.harga * item.qty);
        return `
            <div class="co-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="co-item-info">
                    <h5>${item.name}</h5>
                    <span>${item.qty} x ${formatRupiah(item.harga)}</span>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('coTotalPrice').innerText = formatRupiah(total);

    currentCheckoutItems = itemsArray;
    isFromCart = fromCart;

    // Tampilkan Popup, Tutup Sidebar Keranjang
    closeCart();
    document.getElementById('checkoutOverlay').classList.add('show');
    document.getElementById('checkoutModal').classList.add('show');
}

// B. Fungsi Tombol "Beli Langsung"
function buyNow(btn) {
    const card = btn.closest('.produk-card');
    if (!card) return;
    
    const productName = card.querySelector('h4').textContent;
    const imgSrc = card.querySelector('.produk-img img').getAttribute('src');
    const harga = parseInt(card.dataset.harga);

    const item = [{ name: productName, harga: harga, img: imgSrc, qty: 1 }];
    openCheckout(item, false);
}

/// C. VALIDASI & PROSES AKHIR
function processCheckout() {
    let isValid = true;
    
    // Hapus error sebelumnya
    document.querySelectorAll('.co-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.co-form-group input, .co-form-group textarea, .co-form-group select').forEach(el => {
        el.style.borderColor = '#eee';
    });

    // Fungsi Helper Manipulasi DOM Error
    const showError = (elementId, message) => {
        isValid = false;
        const el = document.getElementById(elementId);
        el.style.borderColor = '#e74c3c';
        
        const err = document.createElement('span');
        err.className = 'co-error-msg';
        err.style.color = '#e74c3c';
        err.style.fontSize = '11px';
        err.style.fontWeight = '700';
        err.style.marginTop = '4px';
        err.style.display = 'block';
        err.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        el.parentElement.appendChild(err);
    };

    // Ambil Input
    const altPhoneInput = document.getElementById('coAltPhone');
    const addressInput = document.getElementById('coAddress');
    const paymentInput = document.getElementById('coPaymentMethod');

    // 1. Validasi Nomor HP Alternatif
    if (altPhoneInput.value.trim() !== "") {
        const cleanPhone = altPhoneInput.value.replace(/[\s-]/g, '');
        const phoneRegex = /^(\+62|08)[0-9]{8,11}$/;
        if (!phoneRegex.test(cleanPhone)) {
            showError('coAltPhone', 'Format No. HP tidak valid (Awali 08 atau +62).');
        }
    }

    // 2. Validasi Alamat
    if (addressInput.value.trim() === "") {
        showError('coAddress', 'Alamat pengiriman wajib diisi.');
    } else if (addressInput.value.trim().length < 10) {
        showError('coAddress', 'Alamat terlalu singkat, mohon tuliskan lebih lengkap.');
    }

    // 3. Validasi Metode Pembayaran
    if (paymentInput.value === "") {
        showError('coPaymentMethod', 'Silakan pilih metode pembayaran.');
    }

    // JIKA SEMUA VALIDASI LOLOS
    if (isValid) {
        const btnConfirm = document.getElementById('btnConfirmCheckout');
        btnConfirm.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memproses...`;
        btnConfirm.disabled = true;

        // Simulasi pengiriman ke server
        setTimeout(() => {
            // 👇 KODE PENYIMPANAN RIWAYAT SHOP DITAMBAHKAN DI SINI 👇
            let zoonHistory = JSON.parse(sessionStorage.getItem('zoon_history')) || [];
            const activeUser = JSON.parse(sessionStorage.getItem('zoon_active_user'));
            const itemDetails = currentCheckoutItems.map(i => `${i.name} (x${i.qty})`).join('<br>');
            const totalPrice = document.getElementById('coTotalPrice').innerText;

            zoonHistory.push({
                type: 'shop',
                user: activeUser,
                orderId: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                items: itemDetails,
                total: totalPrice,
                status: 'Diproses'
            });
            sessionStorage.setItem('zoon_history', JSON.stringify(zoonHistory));
            // 👆 SELESAI 👆

            // Ubah teks metode pembayaran di dalam popup
            const successDesc = document.getElementById('successCheckoutDesc');
            if(successDesc) {
                successDesc.innerHTML = `Terima kasih telah berbelanja.<br>Metode: <strong>${paymentInput.value}</strong>`;
            }
            
            // Munculkan popup animasi
            const successOverlay = document.getElementById('successCheckoutOverlay');
            if(successOverlay) {
                successOverlay.classList.add('show');
            } else {
                alert(`Pesanan Berhasil!\nMetode: ${paymentInput.value}.`);
            }

            // Bersihkan keranjang HANYA jika checkout dari keranjang
            if (isFromCart) {
                cart = [];
                saveCart();
                renderCart();
            }
            
            // Bersihkan keranjang HANYA jika checkout dari keranjang
            if (isFromCart) {
                cart = [];
                saveCart();
                renderCart();
            }

            // Tutup Modal
            document.getElementById('checkoutOverlay').classList.remove('show');
            document.getElementById('checkoutModal').classList.remove('show');
            btnConfirm.innerHTML = `<i class="fas fa-check-circle"></i> Selesaikan Pesanan`;
            btnConfirm.disabled = false;
            
        }, 1500);
    }
}


// ==========================================
// 4. EVENT LISTENER INIT (DOM READY)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const cartIconBtn = document.getElementById('cartIconBtn');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartIconBtn) cartIconBtn.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // EVENT DELEGATION: Menangkap klik "Beli" di seluruh layar
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-beli')) {
            const btn = e.target.closest('.btn-beli');
            buyNow(btn);
        }
    });

    // EVENT LISTENER: Tombol Checkout dari Sidebar Keranjang
    const btnCheckoutKeranjang = document.querySelector('.btn-checkout');
    if (btnCheckoutKeranjang) {
        btnCheckoutKeranjang.addEventListener('click', () => openCheckout(cart, true));
    }

    // EVENT LISTENER: Tutup & Batal Checkout Modal
    const btnCancelCO = document.getElementById('btnCancelCheckout');
    const closeCO = document.getElementById('checkoutClose');
    const overlayCO = document.getElementById('checkoutOverlay');
    const btnConfirmCO = document.getElementById('btnConfirmCheckout');

    const closeCheckoutModal = () => {
        document.getElementById('checkoutOverlay').classList.remove('show');
        document.getElementById('checkoutModal').classList.remove('show');
    };

    if(btnCancelCO) btnCancelCO.addEventListener('click', closeCheckoutModal);
    if(closeCO) closeCO.addEventListener('click', closeCheckoutModal);
    
    // Jangan izinkan tutup modal checkout dengan klik di luar agar user tidak hilang data
    // if(overlayCO) overlayCO.addEventListener('click', closeCheckoutModal); 
    
    // EVENT LISTENER: Proses Pesanan
    if(btnConfirmCO) btnConfirmCO.addEventListener('click', processCheckout);

    // AUTO-OPEN CART DARI HALAMAN LAIN
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openCart') === 'true') {
        setTimeout(() => { openCart(); }, 100);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Tombol tutup Popup Berhasil di Shop
    const btnSuccessOk = document.getElementById('btnSuccessCheckoutOk');
    if(btnSuccessOk) {
        btnSuccessOk.addEventListener('click', () => {
            document.getElementById('successCheckoutOverlay').classList.remove('show');
        });
    }
});