document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DOM Selection
    const registerForm = document.getElementById('registerForm');
    const inputFullname = document.getElementById('fullname');
    const inputUsername = document.getElementById('username');
    const inputEmail = document.getElementById('email');
    const inputPhone = document.getElementById('phone');
    const inputPassword = document.getElementById('password');
    const inputConfirm = document.getElementById('confirm_password');

    if (registerForm) {
        // 2. Event Listener untuk Form Submit
        registerForm.addEventListener('submit', function (event) {
            
            // Mencegah halaman reload
            event.preventDefault(); 
            
            // 💡 JURUS UTAMA: Mencegah form dieksekusi 2x secara bersamaan
            event.stopImmediatePropagation(); 
            
            // Mencegah user klik tombol "Daftar" berkali-kali saat sedang loading
            const btnSubmit = registerForm.querySelector('.btn-login');
            if (btnSubmit.disabled) return; 
            
            let isFormValid = true;

            // Reset Error UI Sebelumnya
            document.querySelectorAll('.error-msg').forEach(el => el.remove());
            document.querySelectorAll('.form-input').forEach(el => {
                el.style.borderColor = '#e8f7f9';
            });

            // Fungsi Memunculkan Error
            const showError = (inputElement, errorMessage) => {
                isFormValid = false;
                inputElement.style.borderColor = '#e74c3c'; 
                const errorText = document.createElement('span');
                errorText.className = 'error-msg';
                errorText.style.color = '#e74c3c';
                errorText.style.fontSize = '11.5px';
                errorText.style.fontWeight = '700';
                errorText.style.marginTop = '4px';
                errorText.style.display = 'block';
                errorText.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errorMessage}`;
                inputElement.closest('.form-group').appendChild(errorText);
            };

            // ==========================================
            // 3. VALIDASI FORM
            // ==========================================
            const nameRegex = /^[a-zA-Z\s\.\']{3,}$/;
            if (!nameRegex.test(inputFullname.value.trim())) {
                showError(inputFullname, "Nama harus huruf, minimal 3 karakter.");
            }

            const userRegex = /^[a-zA-Z0-9_]{5,}$/;
            if (!userRegex.test(inputUsername.value.trim())) {
                showError(inputUsername, "Minimal 5 karakter (huruf, angka, atau underscore).");
            }

            const cleanEmail = inputEmail.value.trim().toLowerCase(); 
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cleanEmail)) {
                showError(inputEmail, "Format email tidak valid (contoh: nama@email.com).");
            }

            const cleanPhone = inputPhone.value.replace(/[\s-]/g, '');
            const phoneRegex = /^(\+62|08)[0-9]{8,11}$/;
            if (!phoneRegex.test(cleanPhone)) {
                showError(inputPhone, "Nomor HP tidak valid (awali 08 / +62).");
            }

            if (inputPassword.value.length < 8) {
                showError(inputPassword, "Password minimal 8 karakter.");
            }

            if (inputConfirm.value === "") {
                showError(inputConfirm, "Konfirmasi password wajib diisi.");
            } else if (inputConfirm.value !== inputPassword.value) {
                showError(inputConfirm, "Password tidak cocok.");
            }

            // ==========================================
            // 4. VERIFIKASI & PENYIMPANAN
            // ==========================================
            if (isFormValid) {
                // Ambil data dari sessionStorage
                let users = JSON.parse(sessionStorage.getItem('zoon_users')) || [];
                
                // Cek apakah email sudah terdaftar
                const emailExist = users.some(u => u.email === cleanEmail);
                
                if (emailExist) {
                    showError(inputEmail, "Email ini sudah terdaftar. Silakan login.");
                    return; // Stop eksekusi agar pendaftaran tidak dilanjutkan
                }

                // Buat Data User Baru
                const newUser = {
                    fullname: inputFullname.value.trim(),
                    username: inputUsername.value.trim(),
                    email: cleanEmail, 
                    phone: cleanPhone, 
                    password: inputPassword.value 
                };

                // Simpan Data
                users.push(newUser);
                sessionStorage.setItem('zoon_users', JSON.stringify(users));

                // Feedback UX (Ubah tombol jadi loading)
                btnSubmit.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mendaftarkan...`;
                btnSubmit.style.opacity = '0.8';
                btnSubmit.disabled = true; 

                // Redirect ke halaman Login
                setTimeout(() => {
                    alert("Pendaftaran Berhasil! Silakan masuk menggunakan akun Anda.");
                    window.location.href = "Login.html"; 
                }, 1500);
            }
        });
    }
});

// ==========================================
// 5. FUNGSI TOGGLE PASSWORD
// ==========================================
function togglePassword(inputId, iconId) {
    const passInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);
    if (!passInput || !eyeIcon) return; 

    if (passInput.type === "password") {
        passInput.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passInput.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}