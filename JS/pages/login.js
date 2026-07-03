document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DOM Selection
    const loginForm = document.getElementById('loginForm');
    const inputEmail = document.getElementById('email');
    const inputPassword = document.getElementById('password');
    const MAX_ATTEMPTS = 8;

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); 
            
            let isFormValid = true;

            // Reset State Error UI
            document.querySelectorAll('.error-msg').forEach(el => el.remove());
            document.querySelectorAll('.form-input').forEach(el => {
                el.style.borderColor = '#e8f7f9';
            });

            // Fungsi Helper Error
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
            // 4. VALIDASI 
            // ==========================================
            const enteredEmail = inputEmail.value.trim();
            const enteredPassword = inputPassword.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (enteredEmail === "") {
                showError(inputEmail, "Email tidak boleh kosong.");
            } else if (!emailRegex.test(enteredEmail)) {
                showError(inputEmail, "Format email tidak valid.");
            }

            if (enteredPassword === "") {
                showError(inputPassword, "Password tidak boleh kosong.");
            }

            // ==========================================
            // 5. VERIFIKASI DENGAN SESSION STORAGE
            // ==========================================
            if (isFormValid) {
                // Ambil data user dari sessionStorage (Data Sementara)
                let users = JSON.parse(sessionStorage.getItem('zoon_users')) || [];
                
                const matchedUser = users.find(u => u.email === enteredEmail && u.password === enteredPassword);
                const emailExists = users.some(u => u.email === enteredEmail);

                // Ambil jumlah gagal dari sessionStorage (agar tidak reset kalau di-refresh)
                let failedAttempts = parseInt(sessionStorage.getItem('zoon_failed_login')) || 0;

                if (matchedUser) {
                    // JIKA BERHASIL LOGIN
                    sessionStorage.removeItem('zoon_failed_login'); // Bersihkan sisa gagal
                    sessionStorage.setItem('zoon_active_user', JSON.stringify(matchedUser.fullname)); // Set user aktif
                    
                    const btnSubmit = loginForm.querySelector('.btn-login');
                    btnSubmit.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mengautentikasi...`;
                    btnSubmit.style.opacity = '0.8';
                    btnSubmit.style.cursor = 'not-allowed';
                    btnSubmit.disabled = true;

                    setTimeout(() => {
                        window.location.href = "Beranda.html"; 
                    }, 1200);

                } else {
                    // JIKA GAGAL LOGIN
                    failedAttempts++;
                    sessionStorage.setItem('zoon_failed_login', failedAttempts); // Simpan jumlah gagal ke sesi
                    
                    // Logika 8 kali paksa masuk
                    if (failedAttempts >= MAX_ATTEMPTS) {
                        alert(`Anda telah gagal login ${MAX_ATTEMPTS} kali. Anda akan diarahkan ke halaman Pendaftaran.`);
                        sessionStorage.removeItem('zoon_failed_login'); // Reset hitungan sebelum pindah
                        window.location.href = "Register.html";
                        return;
                    }

                    if (!emailExists) {
                        showError(inputEmail, "Akun tidak ditemukan di sesi ini. Silakan daftar terlebih dahulu!");
                    } else {
                        showError(inputPassword, `Password salah! (Percobaan gagal: ${failedAttempts}/${MAX_ATTEMPTS})`);
                    }
                }
            }
        });
    }
});

// Fungsi toggle password (Biarkan sama seperti sebelumnya)
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