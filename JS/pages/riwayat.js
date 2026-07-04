document.addEventListener('DOMContentLoaded', () => {

    // 1. VERIFIKASI KEAMANAN (Pastikan user sudah login)
    const activeUserName = JSON.parse(sessionStorage.getItem('zoon_active_user'));
    if (!activeUserName) {
        alert("Anda harus Login terlebih dahulu untuk melihat Riwayat Transaksi.");
        window.location.href = "Login.html";
        return; 
    }

    // 2. PERPINDAHAN TAB (Shop <-> Layanan)
    const tabs = document.querySelectorAll('.history-tab');
    const contents = document.querySelectorAll('.history-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 3. TARIK & TAMPILKAN DATA DARI SESSION
    const allHistory = JSON.parse(sessionStorage.getItem('zoon_history')) || [];
    const userHistory = allHistory.filter(h => h.user === activeUserName);

    const shopHistory = userHistory.filter(h => h.type === 'shop');
    const layananHistory = userHistory.filter(h => h.type === 'grooming' || h.type === 'pethotel' || h.type === 'klinik');

    const tbodyShop = document.getElementById('tbodyShop');
    const tbodyLayanan = document.getElementById('tbodyLayanan');

    // Render TAB SHOP
    if (tbodyShop) {
        if (shopHistory.length === 0) {
            tbodyShop.innerHTML = `<tr><td colspan="5" class="empty-history"><i class="fas fa-box-open"></i>Belum ada transaksi pembelian produk.</td></tr>`;
        } else {
            tbodyShop.innerHTML = shopHistory.reverse().map(h => `
                <tr>
                    <td><strong>${h.orderId}</strong></td>
                    <td>${h.date}</td>
                    <td style="line-height: 1.6;">${h.items}</td>
                    <td><strong style="color:var(--orange)">${h.total}</strong></td>
                    <td><span class="badge-status bg-proses">${h.status}</span></td>
                </tr>
            `).join('');
        }
    }

    // Render TAB LAYANAN
    if (tbodyLayanan) {
        if (layananHistory.length === 0) {
            tbodyLayanan.innerHTML = `<tr><td colspan="5" class="empty-history"><i class="fas fa-calendar-times"></i>Belum ada reservasi layanan.</td></tr>`;
        } else {
            tbodyLayanan.innerHTML = layananHistory.reverse().map(h => `
                <tr>
                    <td><strong>${h.orderId}</strong></td>
                    <td><span class="history-kategori">${h.kategori}</span></td>
                    <td style="line-height: 1.6;">${h.detail}</td>
                    <td>${h.jadwal}</td>
                    <td><span class="badge-status bg-tunggu">${h.status}</span></td>
                </tr>
            `).join('');
        }
    }
});