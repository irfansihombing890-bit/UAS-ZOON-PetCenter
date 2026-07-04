/* ======================================================
   SISTEM AUTENTIKASI NAVBAR & PROFIL POPUP (GLOBAL)
   ====================================================== */
   document.addEventListener("DOMContentLoaded", () => {
    // DOM Selection
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navProfileMenu = document.getElementById('navProfileMenu');
    const profileIconBtn = document.getElementById('profileIconBtn');
    const profilePopup = document.getElementById('profilePopup');
    
    const popupFullName = document.getElementById('popupFullName');
    const popupUsername = document.getElementById('popupUsername');
    const popupPhone = document.getElementById('popupPhone');
    const btnLogout = document.getElementById('btnLogout');

    // 1. Cek Sesi User Aktif
    const activeUserName = JSON.parse(sessionStorage.getItem('zoon_active_user'));
    const users = JSON.parse(sessionStorage.getItem('zoon_users')) || [];

    if (activeUserName) {
        const activeUser = users.find(u => u.username === activeUserName);

        if (activeUser) {
            // Sembunyikan tombol Login, Tampilkan Ikon Profil
            if (navLoginBtn) navLoginBtn.style.display = 'none';
            if (navProfileMenu) navProfileMenu.style.display = 'inline-flex';

            // Ekstrak Inisial Nama
            const words = activeUser.fullname.trim().split(' ');
            let initials = words[0][0];
            if (words.length > 1) {
                initials += words[1][0];
            }
            if (profileIconBtn) profileIconBtn.innerText = initials.toUpperCase();

            // Suntikkan Data User
            if (popupFullName) popupFullName.innerText = activeUser.fullname;
            if (popupUsername) popupUsername.innerText = `@${activeUser.username}`;
            if (popupPhone) popupPhone.innerText = activeUser.phone;
        }
    }

    // 2. Event Listener: Toggle Popup Profil
    if (profileIconBtn && profilePopup) {
        profileIconBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            profilePopup.classList.toggle('show');
        });
    }

    // 3. Menutup popup saat klik di luar
    window.addEventListener('click', (e) => {
        if (profilePopup && profilePopup.classList.contains('show') && !navProfileMenu.contains(e.target)) {
            profilePopup.classList.remove('show');
        }
    });

    // 4. Fitur Keluar (Logout) DISEMPURNAKAN
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Tutup popup profil kecil saat logout diklik
            if(profilePopup) profilePopup.classList.remove('show');
            
            const logoutOverlay = document.getElementById('logoutConfirmOverlay');
            if (logoutOverlay) {
                logoutOverlay.classList.add('show');
            } else {
                // Fallback (jika ada file HTML yang lupa dipasang popup-nya)
                if(confirm("Apakah Anda yakin ingin keluar dari akun?")) {
                    sessionStorage.removeItem('zoon_active_user'); 
                    window.location.href = "Beranda.html"; 
                }
            }
        });
    }

    // Aksi untuk tombol di dalam Popup Logout
    const btnCancelLogout = document.getElementById('btnCancelLogout');
    const btnConfirmLogout = document.getElementById('btnConfirmLogout');
    const logoutOverlay = document.getElementById('logoutConfirmOverlay');

    if (btnCancelLogout) {
        btnCancelLogout.addEventListener('click', () => {
            logoutOverlay.classList.remove('show');
        });
    }

    if (btnConfirmLogout) {
        btnConfirmLogout.addEventListener('click', () => {
            // Animasi loading di tombol logout
            btnConfirmLogout.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Keluar...';
            
            setTimeout(() => {
                sessionStorage.removeItem('zoon_active_user');
                window.location.href = "Beranda.html"; 
            }, 800);
        });
    }

    // 5. UPDATE ANGKA KERANJANG DI SEMUA HALAMAN (Global Cart Badge)
    const globalCartBadge = document.querySelector('.cart-badge');
    if (globalCartBadge) {
        // Ambil data keranjang dari penyimpanan lokal yang dibuat oleh cart.js
        const cartData = JSON.parse(localStorage.getItem('zoonCart')) || [];
        
        // Hitung total jumlah barang
        const totalQty = cartData.reduce((sum, item) => sum + item.qty, 0);
        
        // Tampilkan angka, jika 0 tetap tampilkan 0
        globalCartBadge.textContent = totalQty;
    }

    const navCartLinks = document.querySelectorAll('a.cart-icon');
    navCartLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Cegah fungsi klik bawaan
            // Pindah ke halaman shop sambil membawa parameter 'openCart=true'
            window.location.href = "Shop.html?openCart=true"; 
        });
    });

});

