// Menunggu seluruh elemen HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    
    // Menangkap elemen yang dibutuhkan
    const togglePassBtn = document.querySelector('.toggle-pass');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');

    // Pastikan elemennya ada di halaman sebelum menjalankan fungsi
    if (togglePassBtn && passwordInput && eyeIcon) {
        
        // Memberikan perintah klik pada tombol mata
        togglePassBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Mencegah form ke-refresh secara tidak sengaja
            
            if (passwordInput.type === "password") {
                passwordInput.type = "text"; // Ubah jadi teks
                eyeIcon.classList.remove("fa-eye");
                eyeIcon.classList.add("fa-eye-slash"); // Ikon mata dicoret
            } else {
                passwordInput.type = "password"; // Ubah kembali ke password
                eyeIcon.classList.remove("fa-eye-slash");
                eyeIcon.classList.add("fa-eye"); // Ikon mata normal
            }
        });
    }
});