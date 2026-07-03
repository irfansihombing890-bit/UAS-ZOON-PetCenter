// ══════════════════════════════════════════════════════
//  ZOON Pet Center — Grooming Page JavaScript
//  Fitur: Scroll Animations, Stats Counter, FAQ Accordion,
//         Gallery Lightbox, Smooth Scroll, Navbar Effects
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
    handleNavbarScroll(); // cek saat pertama load


    // ── 2. MOBILE NAV TOGGLE ──
    const navToggle = document.getElementById("navtoggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
        // Tutup menu saat klik link
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navToggle.checked = false;
            });
        });
    }


    // ── 3. DROPDOWN LAYANAN (MOBILE-FRIENDLY) ──
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

    // Tutup dropdown saat klik di luar
    document.addEventListener("click", (e) => {
        dropdowns.forEach((dropdown) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove("active");
            }
        });
    });


    // ── 4. SMOOTH SCROLL UNTUK ANCHOR LINKS ──
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


    // ── 5. SCROLL REVEAL ANIMATIONS (Intersection Observer) ──
    // Mapping: tiap section punya arah animasi yang bervariasi
    const revealConfig = [
        { selector: ".page-hero-content", anim: "fade-up" },
        { selector: ".page-hero-icon", anim: "zoom-in" },
        { selector: ".stat-item", anim: "fade-up" },
        { selector: ".feature-card", anim: "fade-up" },
        { selector: ".team-row", anim: "fade-left" },
        { selector: ".process-step", anim: "fade-up" },
        { selector: ".package-card", anim: "fade-up" },
        { selector: ".gallery-item", anim: "zoom-in" },
        { selector: ".testimonial-card", anim: "fade-up" },
        { selector: ".faq-item", anim: "fade-up" },
        { selector: ".grooming-cta .cta-content", anim: "zoom-in" },
    ];

    // Kumpulkan semua elemen dengan info animasinya
    const revealEntries = [];
    revealConfig.forEach(({ selector, anim }) => {
        document.querySelectorAll(selector).forEach((el) => {
            revealEntries.push({ el, anim });
        });
    });

    // Tambahkan class dan data attribute awal
    revealEntries.forEach(({ el, anim }) => {
        el.dataset.revealAnim = anim;
        el.classList.add("reveal-hidden");
    });

    // Sisipkan CSS animasi secara dinamis
    const revealStyle = document.createElement("style");
    revealStyle.textContent = `
        /* ── Base reveal state ── */
        .reveal-hidden {
            opacity: 0;
            will-change: opacity, transform;
        }

        /* Variasi arah awal per tipe animasi */
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

        /* ── Visible state — sama untuk semua ── */
        .reveal-visible {
            opacity: 1 !important;
            transform: translateY(0) translateX(0) scale(1) !important;
        }

        /* Gallery Lightbox Styles */
        .lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.88);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.35s ease, visibility 0.35s ease;
            cursor: pointer;
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
        }
        .lightbox-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .lightbox-overlay img {
            max-width: 88%;
            max-height: 85vh;
            border-radius: 14px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            transform: scale(0.9);
            transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: default;
        }
        .lightbox-overlay.active img {
            transform: scale(1);
        }
        .lightbox-close {
            position: absolute;
            top: 24px;
            right: 30px;
            color: #ffffff;
            font-size: 32px;
            cursor: pointer;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.12);
            transition: background 0.25s ease, transform 0.25s ease;
            border: none;
            font-family: inherit;
        }
        .lightbox-close:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: rotate(90deg);
        }
        .lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: #ffffff;
            font-size: 24px;
            cursor: pointer;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            transition: background 0.25s ease, transform 0.25s ease;
            border: none;
            font-family: inherit;
        }
        .lightbox-nav:hover {
            background: rgba(255, 255, 255, 0.25);
        }
        .lightbox-prev { left: 24px; }
        .lightbox-next { right: 24px; }
        .lightbox-counter {
            position: absolute;
            bottom: 28px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 1px;
        }

        /* Stat counter animation */
        .stat-number.counting {
            transition: color 0.3s ease;
        }
    `;
    document.head.appendChild(revealStyle);

    // Observer untuk reveal animasi — smooth spring easing
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Hitung stagger delay berdasarkan posisi di antara saudara (sibling)
                    const parent = el.parentElement;
                    const siblings = parent
                        ? Array.from(parent.children).filter(
                            (s) => s.classList.contains("reveal-hidden") || s.classList.contains("reveal-visible")
                        )
                        : [];
                    const siblingIndex = siblings.indexOf(el);
                    const delay = Math.max(0, siblingIndex) * 120; // 120ms per item

                    setTimeout(() => {
                        // Terapkan transition inline agar timing lebih tepat
                        // Easing: cubic-bezier(0.16, 1, 0.3, 1) → "spring-like" decelerating
                        el.style.transition =
                            "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), " +
                            "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)";

                        el.classList.add("reveal-visible");
                        el.classList.remove("reveal-hidden");

                        // Bersihkan will-change setelah animasi selesai
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


    // ── 6. STATS COUNTER ANIMATION ──
    const statNumbers = document.querySelectorAll(".stat-number");

    function animateCounter(el) {
        const text = el.textContent.trim();
        // Simpan konten icon (star) jika ada
        const iconEl = el.querySelector("i");
        const iconHTML = iconEl ? " " + iconEl.outerHTML : "";

        // Parsing angka dari text
        let targetNum = 0;
        let prefix = "";
        let suffix = "";

        if (text.includes("5.000")) {
            targetNum = 5000;
            suffix = "+";
        } else if (text.includes("4.9")) {
            targetNum = 4.9;
        } else if (text.includes("8")) {
            targetNum = 8;
            suffix = "+";
        } else if (text.includes("3")) {
            targetNum = 3;
            prefix = "";
            suffix = " Tahun";
        } else {
            return; // Tidak bisa parse, skip
        }

        const duration = 1800; // ms
        const startTime = performance.now();
        const isDecimal = targetNum % 1 !== 0;

        el.classList.add("counting");

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing: easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * targetNum;

            let displayValue;
            if (isDecimal) {
                displayValue = current.toFixed(1);
            } else if (targetNum >= 1000) {
                displayValue = Math.floor(current).toLocaleString("id-ID");
            } else {
                displayValue = Math.floor(current);
            }

            el.innerHTML = prefix + displayValue + suffix + iconHTML;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Observer khusus untuk stats
    const statsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach((el) => statsObserver.observe(el));


    // ── 7. FAQ ACCORDION ──
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const summary = item.querySelector("summary");

        if (summary) {
            summary.addEventListener("click", (e) => {
                e.preventDefault();

                const isOpen = item.hasAttribute("open");

                // Animasi smooth close/open
                if (isOpen) {
                    // Tutup item ini
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
                    // Tutup semua FAQ lain terlebih dahulu
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

                    // Buka item ini
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


    // ── 8. GALLERY LIGHTBOX ──
    const galleryItems = document.querySelectorAll(".gallery-item img");

    if (galleryItems.length > 0) {
        // Buat lightbox overlay
        const overlay = document.createElement("div");
        overlay.className = "lightbox-overlay";
        overlay.innerHTML = `
            <button class="lightbox-close" aria-label="Tutup">&times;</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Sebelumnya">
                <i class="fas fa-chevron-left"></i>
            </button>
            <img src="" alt="Gallery preview">
            <button class="lightbox-nav lightbox-next" aria-label="Selanjutnya">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="lightbox-counter"></div>
        `;
        document.body.appendChild(overlay);

        const lightboxImg = overlay.querySelector("img");
        const lightboxClose = overlay.querySelector(".lightbox-close");
        const lightboxPrev = overlay.querySelector(".lightbox-prev");
        const lightboxNext = overlay.querySelector(".lightbox-next");
        const lightboxCounter = overlay.querySelector(".lightbox-counter");

        let currentGalleryIndex = 0;
        const gallerySources = Array.from(galleryItems).map((img) => img.src);

        function showLightbox(index) {
            currentGalleryIndex = index;
            lightboxImg.src = gallerySources[index];
            lightboxCounter.textContent = `${index + 1} / ${gallerySources.length}`;
            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        function closeLightbox() {
            overlay.classList.remove("active");
            document.body.style.overflow = "";
        }

        function nextGalleryImage() {
            currentGalleryIndex = (currentGalleryIndex + 1) % gallerySources.length;
            lightboxImg.src = gallerySources[currentGalleryIndex];
            lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${gallerySources.length}`;
        }

        function prevGalleryImage() {
            currentGalleryIndex = (currentGalleryIndex - 1 + gallerySources.length) % gallerySources.length;
            lightboxImg.src = gallerySources[currentGalleryIndex];
            lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${gallerySources.length}`;
        }

        // Event listener untuk membuka gallery
        galleryItems.forEach((img, index) => {
            img.style.cursor = "pointer";
            img.addEventListener("click", () => showLightbox(index));
        });

        // Tutup lightbox
        lightboxClose.addEventListener("click", (e) => {
            e.stopPropagation();
            closeLightbox();
        });

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeLightbox();
        });

        // Navigasi lightbox
        lightboxPrev.addEventListener("click", (e) => {
            e.stopPropagation();
            prevGalleryImage();
        });

        lightboxNext.addEventListener("click", (e) => {
            e.stopPropagation();
            nextGalleryImage();
        });

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (!overlay.classList.contains("active")) return;

            switch (e.key) {
                case "Escape":
                    closeLightbox();
                    break;
                case "ArrowLeft":
                    prevGalleryImage();
                    break;
                case "ArrowRight":
                    nextGalleryImage();
                    break;
            }
        });

        // Swipe support untuk mobile
        let lightboxTouchStartX = 0;
        let lightboxTouchEndX = 0;

        overlay.addEventListener("touchstart", (e) => {
            lightboxTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        overlay.addEventListener("touchend", (e) => {
            lightboxTouchEndX = e.changedTouches[0].screenX;
            const diff = lightboxTouchStartX - lightboxTouchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextGalleryImage();
                } else {
                    prevGalleryImage();
                }
            }
        }, { passive: true });
    }


    // ── 9. PACKAGE CARD HOVER INTERACTION ──
    const packageCards = document.querySelectorAll(".package-card");

    packageCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            packageCards.forEach((other) => {
                if (other !== card && !other.classList.contains("featured")) {
                    other.style.opacity = "0.7";
                    other.style.transform = "scale(0.97)";
                }
            });
        });

        card.addEventListener("mouseleave", () => {
            packageCards.forEach((other) => {
                other.style.opacity = "";
                other.style.transform = "";
            });
        });
    });


    // ── 10. PARALLAX HERO ICON ──
    const heroIcon = document.querySelector(".page-hero-icon");

    if (heroIcon) {
        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;
            if (scrollY < 600) {
                const rotation = scrollY * 0.08;
                const translateY = scrollY * 0.15;
                heroIcon.style.transform = `translateY(${translateY}px) rotate(${rotation}deg)`;
            }
        }, { passive: true });
    }


    // ── 11. ACTIVE NAV HIGHLIGHT ──
    // Highlight link aktif di navbar (Grooming)
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    const allNavLinks = document.querySelectorAll(".nav-links a, .dropdown-content a");

    allNavLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.toLowerCase() === currentPage) {
            link.classList.add("active");
        }
    });


    // ── 12. BACK TO TOP (AUTO-GENERATED) ──
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


    // ── 13. TEAM PHOTO LAZY PARALLAX ──
    const teamPhoto = document.querySelector(".team-photo img");

    if (teamPhoto) {
        const teamObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Efek subtle zoom-in saat terlihat
                        teamPhoto.style.transition = "transform 8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                        teamPhoto.style.transform = "scale(1.05)";
                    } else {
                        teamPhoto.style.transform = "scale(1)";
                    }
                });
            },
            { threshold: 0.3 }
        );

        teamObserver.observe(teamPhoto);
    }


    // ── 14. TILT EFFECT PADA FEATURE CARDS ──
    const featureCards = document.querySelectorAll(".feature-card");

    featureCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.transition = "transform 0.4s ease";
            setTimeout(() => {
                card.style.transition = "";
            }, 400);
        });
    });


    // ── 15. BOOKING MODAL ──
    const bookingOverlay = document.getElementById("bookingOverlay");
    const bookingClose = document.getElementById("bookingClose");
    const bookingForm = document.getElementById("bookingForm");
    const successOverlay = document.getElementById("successOverlay");
    const successClose = document.getElementById("successClose");
    const paketSelect = document.getElementById("paketGrooming");
    const tanggalInput = document.getElementById("tanggal");

    // Set minimum tanggal ke hari ini
    if (tanggalInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        tanggalInput.setAttribute("min", `${yyyy}-${mm}-${dd}`);
    }

    // Open modal
    function openBookingModal(paketValue) {
        if (!bookingOverlay) return;
        bookingOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        // Pre-select paket if provided
        if (paketValue && paketSelect) {
            const options = paketSelect.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === paketValue) {
                    paketSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }

    // Close modal
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

    // Attach open handlers to all .btn-booking elements
    document.querySelectorAll(".btn-booking").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const paket = btn.dataset.paket || "";
            openBookingModal(paket);
        });
    });

    // Close handlers
    if (bookingClose) {
        bookingClose.addEventListener("click", closeBookingModal);
    }

    if (bookingOverlay) {
        bookingOverlay.addEventListener("click", (e) => {
            if (e.target === bookingOverlay) closeBookingModal();
        });
    }

    if (successClose) {
        successClose.addEventListener("click", closeSuccessModal);
    }

    if (successOverlay) {
        successOverlay.addEventListener("click", (e) => {
            if (e.target === successOverlay) closeSuccessModal();
        });
    }

    // ESC to close
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (bookingOverlay && bookingOverlay.classList.contains("active")) {
                closeBookingModal();
            }
            if (successOverlay && successOverlay.classList.contains("active")) {
                closeSuccessModal();
            }
        }
    });

    // Form validation & submit
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Clear previous errors
            bookingForm.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));
            bookingForm.querySelectorAll(".error-msg").forEach((el) => el.remove());

            let hasError = false;
            const requiredFields = bookingForm.querySelectorAll("[required]");

            requiredFields.forEach((field) => {
                const value = field.value.trim();
                if (!value) {
                    hasError = true;
                    field.classList.add("error");

                    // Add error message
                    const msg = document.createElement("span");
                    msg.className = "error-msg";
                    msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Wajib diisi';
                    field.parentElement.appendChild(msg);

                    // Remove error on focus
                    field.addEventListener("focus", function onFocus() {
                        field.classList.remove("error");
                        const errMsg = field.parentElement.querySelector(".error-msg");
                        if (errMsg) errMsg.remove();
                        field.removeEventListener("focus", onFocus);
                    });
                }
            });

            if (hasError) {
                // Scroll to first error inside modal
                const firstError = bookingForm.querySelector(".error");
                if (firstError) {
                    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
                    firstError.focus();
                }
                return;
            }

            // Success — close booking modal and show success modal
            closeBookingModal();
            bookingForm.reset();

            setTimeout(() => {
                if (successOverlay) {
                    successOverlay.classList.add("active");
                    document.body.style.overflow = "hidden";
                }
            }, 300);
        });
    }

});
