// ══════════════════════════════════════════════════════
//  ZOON Pet Center — Pet Hotel Page JavaScript
//  Fitur: Booking Modal, Form Validation, Navbar,
//         Scroll Animations, FAQ Accordion, Back to Top
// ══════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {

    // ── 1. NAVBAR SCROLL EFFECT ──
    const nav = document.querySelector("nav");
    const topbar = document.querySelector(".topbar");

    function handleNavbarScroll() {
        if (!nav) return;
        if (window.scrollY > 60) {
            nav.classList.add("scrolled");
            if (topbar) topbar.classList.add("hidden");
        } else {
            nav.classList.remove("scrolled");
            if (topbar) topbar.classList.remove("hidden");
        }
    }

    window.addEventListener("scroll", handleNavbarScroll);
    handleNavbarScroll();


    // ── 2. MOBILE NAV TOGGLE ──
    const navToggle = document.getElementById("navtoggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navToggle.checked = false;
            });
        });
    }


    // ── 3. DROPDOWN LAYANAN ──
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown) => {
        const dropbtn = dropdown.querySelector(".dropbtn");
        if (dropbtn) {
            dropbtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle("active");
            });
        }
    });

    document.addEventListener("click", (e) => {
        dropdowns.forEach((dropdown) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove("active");
            }
        });
    });


    // ── 4. SMOOTH SCROLL ──
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPos,
                    behavior: "smooth",
                });
            }
        });
    });


    // ── 5. SCROLL REVEAL ANIMATIONS ──
    const revealConfig = [
        { selector: ".feature-card", anim: "fade-up" },
        { selector: ".timeline-item", anim: "fade-up" },
        { selector: ".gallery-item", anim: "zoom-in" },
        { selector: ".room-card", anim: "fade-up" },
        { selector: ".testimonial-card", anim: "fade-up" },
        { selector: ".mini-feature-card", anim: "fade-up" },
        { selector: ".faq-item", anim: "fade-up" },
        { selector: ".hotel-cta-card", anim: "zoom-in" },
    ];

    const revealEntries = [];
    revealConfig.forEach(({ selector, anim }) => {
        document.querySelectorAll(selector).forEach((el) => {
            revealEntries.push({ el, anim });
        });
    });

    revealEntries.forEach(({ el, anim }) => {
        el.dataset.revealAnim = anim;
        el.classList.add("reveal-hidden");
    });

    const revealStyle = document.createElement("style");
    revealStyle.textContent = `
        .reveal-hidden {
            opacity: 0;
            will-change: opacity, transform;
        }
        .reveal-hidden[data-reveal-anim="fade-up"] {
            transform: translateY(50px);
        }
        .reveal-hidden[data-reveal-anim="fade-left"] {
            transform: translateX(-60px);
        }
        .reveal-hidden[data-reveal-anim="fade-right"] {
            transform: translateX(60px);
        }
        .reveal-hidden[data-reveal-anim="zoom-in"] {
            transform: scale(0.88);
        }
        .reveal-visible {
            opacity: 1 !important;
            transform: translateY(0) translateX(0) scale(1) !important;
        }
    `;
    document.head.appendChild(revealStyle);

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const parent = el.parentElement;
                    const siblings = parent
                        ? Array.from(parent.children).filter(
                            (s) => s.classList.contains("reveal-hidden") || s.classList.contains("reveal-visible")
                        )
                        : [];
                    const siblingIndex = siblings.indexOf(el);
                    const delay = Math.max(0, siblingIndex) * 120;

                    setTimeout(() => {
                        el.style.transition =
                            "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), " +
                            "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
                        el.classList.add("reveal-visible");
                        el.classList.remove("reveal-hidden");

                        el.addEventListener("transitionend", () => {
                            el.style.willChange = "auto";
                        }, { once: true });
                    }, delay);

                    revealObserver.unobserve(el);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -60px 0px",
        }
    );

    revealEntries.forEach(({ el }) => revealObserver.observe(el));


    // ── 6. FAQ ACCORDION ──
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const summary = item.querySelector("summary");

        if (summary) {
            summary.addEventListener("click", (e) => {
                e.preventDefault();
                const isOpen = item.hasAttribute("open");

                if (isOpen) {
                    const content = item.querySelector("p");
                    if (content) {
                        content.style.maxHeight = content.scrollHeight + "px";
                        content.style.overflow = "hidden";
                        content.style.transition = "max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease";

                        requestAnimationFrame(() => {
                            content.style.maxHeight = "0";
                            content.style.opacity = "0";
                            content.style.marginTop = "0";
                        });

                        setTimeout(() => {
                            item.removeAttribute("open");
                            content.style.maxHeight = "";
                            content.style.opacity = "";
                            content.style.overflow = "";
                            content.style.transition = "";
                            content.style.marginTop = "";
                        }, 300);
                    }
                } else {
                    faqItems.forEach((other) => {
                        if (other !== item && other.hasAttribute("open")) {
                            const otherContent = other.querySelector("p");
                            if (otherContent) {
                                otherContent.style.maxHeight = otherContent.scrollHeight + "px";
                                otherContent.style.overflow = "hidden";
                                otherContent.style.transition = "max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease";

                                requestAnimationFrame(() => {
                                    otherContent.style.maxHeight = "0";
                                    otherContent.style.opacity = "0";
                                    otherContent.style.marginTop = "0";
                                });

                                setTimeout(() => {
                                    other.removeAttribute("open");
                                    otherContent.style.maxHeight = "";
                                    otherContent.style.opacity = "";
                                    otherContent.style.overflow = "";
                                    otherContent.style.transition = "";
                                    otherContent.style.marginTop = "";
                                }, 300);
                            }
                        }
                    });

                    item.setAttribute("open", "");
                    const content = item.querySelector("p");
                    if (content) {
                        content.style.maxHeight = "0";
                        content.style.opacity = "0";
                        content.style.overflow = "hidden";
                        content.style.transition = "max-height 0.35s ease, opacity 0.35s ease, margin 0.35s ease";
                        content.style.marginTop = "0";

                        requestAnimationFrame(() => {
                            content.style.maxHeight = content.scrollHeight + "px";
                            content.style.opacity = "1";
                            content.style.marginTop = "12px";
                        });

                        setTimeout(() => {
                            content.style.maxHeight = "";
                            content.style.opacity = "";
                            content.style.overflow = "";
                            content.style.transition = "";
                        }, 350);
                    }
                }
            });
        }
    });


    // ── 7. BACK TO TOP ──
    const backToTopBtn = document.createElement("button");
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = "back-to-top-btn";
    backToTopBtn.setAttribute("aria-label", "Kembali ke atas");

    const backToTopStyle = document.createElement("style");
    backToTopStyle.textContent = `
        .back-to-top-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--teal, #00838f);
            color: #ffffff;
            border: none;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 20px rgba(0, 131, 143, 0.35);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: opacity 0.35s ease, visibility 0.35s ease,
                        transform 0.35s ease, background 0.25s ease;
            z-index: 9999;
        }
        .back-to-top-btn.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .back-to-top-btn:hover {
            background: var(--teal-dark, #006064);
            transform: translateY(-3px);
        }
    `;
    document.head.appendChild(backToTopStyle);
    document.body.appendChild(backToTopBtn);

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    }, { passive: true });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });


    // ── 8. CEK KETERSEDIAAN KANDANG ──
    (function () {
        const btnCek       = document.getElementById('btnCekKetersediaan');
        const barCheckIn   = document.getElementById('barCheckIn');
        const barCheckOut  = document.getElementById('barCheckOut');
        const barTipeHewan = document.getElementById('barTipeHewan');
        const barTipeKamar = document.getElementById('barTipeKamar');

        const availOverlay  = document.getElementById('availabilityOverlay');
        const availClose    = document.getElementById('availabilityClose');
        const availBtnClose = document.getElementById('availBtnClose');
        const availBtnBook  = document.getElementById('availBtnBook');

        // Set nilai default tanggal hari ini & besok
        if (barCheckIn && barCheckOut) {
            const today    = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const fmt = d => d.toISOString().split('T')[0];
            barCheckIn.value  = fmt(today);
            barCheckOut.value = fmt(tomorrow);
            barCheckIn.min    = fmt(today);
            barCheckOut.min   = fmt(tomorrow);

            barCheckIn.addEventListener('change', () => {
                const ci = new Date(barCheckIn.value);
                const co = new Date(ci);
                co.setDate(ci.getDate() + 1);
                barCheckOut.min = co.toISOString().split('T')[0];
                if (barCheckOut.value && barCheckOut.value <= barCheckIn.value) {
                    barCheckOut.value = co.toISOString().split('T')[0];
                }
            });
        }

        // Kapasitas total tiap tipe kamar
        const KAPASITAS = {
            'Deluxe Room'    : 10,
            'Executive Room' : 8,
            'Family Suite'   : 5,
        };

        /**
         * Hitung sisa kandang berdasarkan data reservasi nyata di sessionStorage.
         * Cek apakah ada reservasi yang periode-nya overlap dengan [checkIn, checkOut]
         * untuk tipe kamar yang sama.
         *
         * Overlap terjadi jika: reservasi.checkIn < coDate && reservasi.checkOut > ciDate
         */
        function hitungSisaKandang(tipeKamar, checkIn, checkOut) {
            const total = KAPASITAS[tipeKamar] || 10;

            const allHistory = JSON.parse(sessionStorage.getItem('zoon_history')) || [];

            // Filter hanya reservasi pet hotel dengan tipe kamar yang sama
            const reservasiKamar = allHistory.filter(h =>
                h.type === 'pethotel' &&
                h.tipeKamar === tipeKamar &&
                h.checkIn && h.checkOut
            );

            // Hitung berapa reservasi yang periode-nya bentrok (overlap) dengan tanggal yang dicek
            const ciDate = new Date(checkIn);
            const coDate = new Date(checkOut);

            const bentrok = reservasiKamar.filter(r => {
                const rCI = new Date(r.checkIn);
                const rCO = new Date(r.checkOut);
                // Overlap jika: rCI < coDate DAN rCO > ciDate
                return rCI < coDate && rCO > ciDate;
            });

            const terisi = bentrok.length;
            const sisa   = Math.max(0, total - terisi);
            return { sisa, terisi, total, reservasiList: bentrok };
        }

        function formatTanggal(dateStr) {
            if (!dateStr) return '-';
            const d = new Date(dateStr + 'T00:00:00');
            return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
        }

        function openAvailModal(tipeKamar) {
            if (!availOverlay) return;
            availOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            const ci     = barCheckIn  ? barCheckIn.value  : '';
            const co     = barCheckOut ? barCheckOut.value : '';
            const hewan  = barTipeHewan ? barTipeHewan.value : '';
            const kamar  = tipeKamar || (barTipeKamar ? barTipeKamar.value : '');

            // Isi info pencarian
            const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            setEl('availCiDisplay',    formatTanggal(ci));
            setEl('availCoDisplay',    formatTanggal(co));
            setEl('availHewanDisplay', hewan  || '-');
            setEl('availKamarDisplay', kamar  || '-');

            // Hitung berdasarkan data nyata dari sessionStorage
            const { sisa, terisi, total } = hitungSisaKandang(kamar, ci, co);

            let status, statusClass, icon, deskripsi;
            if (sisa === 0) {
                status      = 'Penuh';
                statusClass = 'status-penuh';
                icon        = 'fa-times-circle';
                deskripsi   = `Maaf, semua kandang <strong>${kamar}</strong> sudah terisi penuh untuk periode tersebut. Silakan coba tanggal atau tipe kamar lain.`;
            } else if (sisa <= Math.ceil(total * 0.3)) {
                status      = 'Hampir Penuh';
                statusClass = 'status-hampir';
                icon        = 'fa-exclamation-circle';
                deskripsi   = `Hanya tersisa <strong>${sisa} kandang</strong> dari ${total} kandang <strong>${kamar}</strong>. Segera reservasi sebelum kehabisan!`;
            } else {
                status      = 'Tersedia';
                statusClass = 'status-tersedia';
                icon        = 'fa-check-circle';
                deskripsi   = `<strong>${sisa} kandang</strong> dari ${total} kandang <strong>${kamar}</strong> masih tersedia untuk periode ini.`;
            }

            // Hitung durasi menginap
            let durasiHtml = '';
            if (ci && co) {
                const msPerDay = 86400000;
                const durasi   = Math.round((new Date(co) - new Date(ci)) / msPerDay);
                if (durasi > 0) durasiHtml = `<div class="avail-durasi"><i class="fas fa-moon"></i> <strong>${durasi} malam</strong> menginap</div>`;
            }

            // Render kandang visual
            const kandangHtml = Array.from({ length: total }, (_, i) => {
                const cls = i < terisi ? 'kandang-item terisi' : 'kandang-item kosong';
                const lbl = i < terisi ? 'Terisi' : 'Kosong';
                return `<div class="${cls}" title="${lbl}"><i class="fas fa-${i < terisi ? 'lock' : 'door-open'}"></i><span>${lbl}</span></div>`;
            }).join('');

            const resultEl = document.getElementById('availResult');
            if (resultEl) {
                resultEl.innerHTML = `
                    <div class="avail-status-badge ${statusClass}">
                        <i class="fas ${icon}"></i>
                        <span>${status}</span>
                    </div>
                    <p class="avail-desc">${deskripsi}</p>
                    ${durasiHtml}
                    <div class="avail-kandang-grid">
                        <p class="avail-kandang-label"><i class="fas fa-th-large"></i> Visualisasi Kandang (${total} total)</p>
                        <div class="avail-kandang-list">${kandangHtml}</div>
                        <div class="avail-legend">
                            <span class="legend-item"><span class="dot dot-kosong"></span> Kosong (${sisa})</span>
                            <span class="legend-item"><span class="dot dot-terisi"></span> Terisi (${total - sisa})</span>
                        </div>
                    </div>
                `;
            }

            // Tampilkan/sembunyikan tombol Reservasi
            if (availBtnBook) {
                if (sisa > 0) {
                    availBtnBook.style.display = 'inline-flex';
                    availBtnBook.dataset.kamar = kamar;
                } else {
                    availBtnBook.style.display = 'none';
                }
            }
        }

        function closeAvailModal() {
            if (!availOverlay) return;
            availOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (btnCek) {
            btnCek.addEventListener('click', () => {
                const ci = barCheckIn ? barCheckIn.value : '';
                const co = barCheckOut ? barCheckOut.value : '';

                if (!ci || !co) {
                    alert('Silakan pilih tanggal Check In dan Check Out terlebih dahulu.');
                    return;
                }
                if (co <= ci) {
                    alert('Tanggal Check Out harus setelah Check In.');
                    return;
                }

                openAvailModal('');
            });
        }

        if (availClose)    availClose.addEventListener('click', closeAvailModal);
        if (availBtnClose) availBtnClose.addEventListener('click', closeAvailModal);
        if (availOverlay)  availOverlay.addEventListener('click', e => { if (e.target === availOverlay) closeAvailModal(); });

        // Tombol "Reservasi Sekarang" dari modal ketersediaan
        if (availBtnBook) {
            availBtnBook.addEventListener('click', () => {
                closeAvailModal();
                // Buka modal booking dengan kamar yang sudah dipilih
                const kamar = availBtnBook.dataset.kamar || '';
                openBookingModal(kamar);
            });
        }

        // Expose openAvailModal agar bisa dipanggil dari luar scope ini
        window._openAvailModal = openAvailModal;
    })();


    // ── 9. BOOKING MODAL PET HOTEL (DISEMPURNAKAN) ──
    const bookingOverlay = document.getElementById("bookingOverlay");
    const bookingClose = document.getElementById("bookingClose");
    const bookingForm = document.getElementById("bookingHotelForm");
    const successOverlay = document.getElementById("successOverlay");
    const successClose = document.getElementById("successClose");
    const tipeKamarSelect = document.getElementById("phTipeKamar");
    const checkInDateInput = document.getElementById("phCheckInDate");
    const checkOutDateInput = document.getElementById("phCheckOutDate");

    if (checkInDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const todayStr = `${yyyy}-${mm}-${dd}`;
        checkInDateInput.setAttribute("min", todayStr);
        if (checkOutDateInput) checkOutDateInput.setAttribute("min", todayStr);
    }

    if (checkInDateInput && checkOutDateInput) {
        checkInDateInput.addEventListener("change", () => {
            const checkInVal = checkInDateInput.value;
            if (checkInVal) {
                checkOutDateInput.setAttribute("min", checkInVal);
                if (checkOutDateInput.value && checkOutDateInput.value < checkInVal) {
                    checkOutDateInput.value = "";
                }
            }
        });
    }

    function openBookingModal(kamarValue) {
        if (!bookingOverlay) return;

        // 1. VERIFIKASI LOGIN
        const activeUserName = JSON.parse(sessionStorage.getItem('zoon_active_user'));
        if (!activeUserName) {
            alert("Silakan Login terlebih dahulu untuk melakukan reservasi kamar.");
            window.location.href = "Login.html";
            return;
        }

        // 2. AUTOFILL DATA PEMILIK
        const users = JSON.parse(sessionStorage.getItem('zoon_users')) || [];
        const activeUser = users.find(u => u.fullname === activeUserName);
        if (activeUser) {
            const ownerName = document.getElementById('ownerName');
            const ownerPhone = document.getElementById('ownerPhone');
            if (ownerName) ownerName.value = activeUser.fullname;
            if (ownerPhone) ownerPhone.value = activeUser.phone;
        }

        bookingOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        if (kamarValue && tipeKamarSelect) {
            const options = tipeKamarSelect.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === kamarValue) {
                    tipeKamarSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }

    function closeBookingModal() {
        if (!bookingOverlay) return;
        bookingOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    function closeSuccessModal() {
        if (!successOverlay) return;
        successOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    document.querySelectorAll(".btn-booking-hotel").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const kamar = btn.dataset.kamar || "";
            openBookingModal(kamar);
        });
    });

    if (bookingClose) bookingClose.addEventListener("click", closeBookingModal);
    if (bookingOverlay) bookingOverlay.addEventListener("click", (e) => { if (e.target === bookingOverlay) closeBookingModal(); });
    if (successClose) successClose.addEventListener("click", closeSuccessModal);

    // Form validation & submit
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;
            
            bookingForm.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
            bookingForm.querySelectorAll(".error-msg").forEach(el => el.remove());

            const requiredFields = bookingForm.querySelectorAll("[required]");

            requiredFields.forEach((field) => {
                const value = field.value.trim();
                if (!value) {
                    isValid = false;
                    field.classList.add("error");

                    const msg = document.createElement("span");
                    msg.className = "error-msg";
                    msg.style.color = '#e74c3c';
                    msg.style.fontSize = '12px';
                    msg.style.fontWeight = '700';
                    msg.style.marginTop = '4px';
                    msg.style.display = 'block';
                    msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Wajib diisi';
                    field.parentElement.appendChild(msg);

                    field.addEventListener("focus", function onFocus() {
                        field.classList.remove("error");
                        const errMsg = field.parentElement.querySelector(".error-msg");
                        if (errMsg) errMsg.remove();
                        field.removeEventListener("focus", onFocus);
                    });
                }
            });

            // Validasi Khusus: Check Out harus minimal 1 hari setelah Check In
            if (isValid && checkInDateInput && checkOutDateInput) {
                const ciDate = checkInDateInput.value;
                const coDate = checkOutDateInput.value;
                if (ciDate && coDate && coDate <= ciDate) {
                    isValid = false;
                    checkOutDateInput.classList.add("error");

                    const msg = document.createElement("span");
                    msg.className = "error-msg";
                    msg.style.color = '#e74c3c';
                    msg.style.fontSize = '12px';
                    msg.style.fontWeight = '700';
                    msg.style.marginTop = '4px';
                    msg.style.display = 'block';
                    msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Check-Out harus setelah Check-In';
                    checkOutDateInput.parentElement.appendChild(msg);

                    checkOutDateInput.addEventListener("focus", function onFocus() {
                        checkOutDateInput.classList.remove("error");
                        const errMsg = checkOutDateInput.parentElement.querySelector(".error-msg");
                        if (errMsg) errMsg.remove();
                        checkOutDateInput.removeEventListener("focus", onFocus);
                    });
                }
            }

            if (!isValid) {
                const firstError = bookingForm.querySelector(".error");
                if (firstError) {
                    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
                    firstError.focus();
                }
                return;
            }

            const btnSubmit = bookingForm.querySelector("button[type='submit']");
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memproses...`;
            btnSubmit.disabled = true;

            setTimeout(() => {
                // 👇 KODE PENYIMPANAN RIWAYAT PET HOTEL DITAMBAHKAN DI SINI 👇
                let zoonHistory = JSON.parse(sessionStorage.getItem('zoon_history')) || [];
                const activeUser = JSON.parse(sessionStorage.getItem('zoon_active_user'));
                
                const pet = document.getElementById('phJenisHewan').value;
                const room = document.getElementById('phTipeKamar').options[document.getElementById('phTipeKamar').selectedIndex].text;
                const ciDate = document.getElementById('phCheckInDate').value;
                const coDate = document.getElementById('phCheckOutDate').value;

                zoonHistory.push({
                    type: 'pethotel',
                    user: activeUser,
                    orderId: 'HTL-' + Math.floor(10000 + Math.random() * 90000),
                    kategori: 'Pet Hotel',
                    detail: `${room} <br><small>Hewan: ${pet}</small>`,
                    jadwal: `${ciDate} s/d<br>${coDate}`,
                    status: 'Menunggu',
                    // Field eksplisit untuk keperluan cek ketersediaan kandang
                    tipeKamar: document.getElementById('phTipeKamar').value,
                    checkIn:   ciDate,
                    checkOut:  coDate
                });
                sessionStorage.setItem('zoon_history', JSON.stringify(zoonHistory));
                // 👆 SELESAI 👆

                closeBookingModal();
                bookingForm.reset();
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;

                if (successOverlay) {
                    successOverlay.classList.add("active");
                    document.body.style.overflow = "hidden";
                }
            }, 1500);
        });
    }
});