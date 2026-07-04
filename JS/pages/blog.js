(function () {
    "use strict";

    const ARTICLES = {
        "vaksinasi-anjing-kucing": {
            photo: "/foto/vaksinhewan.png",
            emoji: "🐾",
            gradient: "linear-gradient(135deg, #00b4c6, #009aaa)",
            tag: "Kesehatan",
            title: "Panduan Lengkap Vaksinasi Anjing dan Kucing: Jadwal, Jenis, dan Manfaatnya",
            date: "15 April 2026",
            author: "drh. Budi Santoso",
            readTime: "5 menit baca",
            category: "Kesehatan",
            views: "5.4K views",
            content: [
                "Vaksinasi adalah langkah pencegahan utama untuk melindungi hewan peliharaan dari penyakit menular yang berbahaya, bahkan mematikan. Anak anjing dan anak kucing umumnya mulai divaksin sejak usia 6–8 minggu, kemudian diulang secara bertahap hingga vaksinasi dasar lengkap di usia 16 minggu.",
                "Jenis vaksin inti (core vaccine) yang wajib diberikan meliputi vaksin rabies, distemper, parvovirus untuk anjing, serta panleukopenia dan calicivirus untuk kucing. Selain vaksin inti, dokter hewan juga dapat merekomendakan vaksin tambahan sesuai risiko lingkungan tempat tinggal hewan.",
                "Setelah vaksinasi dasar selesai, booster tahunan tetap diperlukan untuk menjaga kekebalan tubuh hewan tetap optimal. Konsultasikan jadwal vaksinasi yang sesuai dengan dokter hewan terpercaya agar hewan peliharaan Anda selalu terlindungi."
            ]
        },
        "grooming-bulu-kucing": {
            photo: "/foto/rawaykucing.jpg",
            emoji: "🐱",
            gradient: "linear-gradient(135deg, #e8f7f9, #b2dfe4)",
            tag: "Grooming",
            title: "7 Cara Merawat Bulu Kucing Agar Selalu Bersih dan Mengkilap",
            date: "10 April 2026",
            author: "Tim ZOON Grooming",
            readTime: "4 menit baca",
            category: "Grooming",
            views: "3.9K views",
            content: [
                "Menyikat bulu kucing secara rutin 2–3 kali seminggu membantu mengurangi bulu rontok dan mencegah terbentuknya gumpalan bulu (matting), terutama pada kucing berbulu panjang.",
                "Mandikan kucing hanya saat benar-benar diperlukan, gunakan sampo khusus kucing dengan pH seimbang agar kulit tidak kering. Pastikan bulu benar-benar kering setelah mandi untuk mencegah jamur.",
                "Perhatikan juga asupan nutrisi seperti omega-3 dan omega-6 yang berperan besar menjaga kilau alami bulu kucing dari dalam."
            ]
        },
        "makanan-berbahaya-anjing": {
            photo: "/foto/anjingmakan1.jpg",
            emoji: "🥩",
            gradient: "linear-gradient(135deg, #fff3e0, #ffe0b8)",
            tag: "Nutrisi",
            title: "Makanan yang Berbahaya untuk Anjing: Daftar Lengkap yang Harus Dihindari",
            date: "8 April 2026",
            author: "drh. Siti Nurhaliza",
            readTime: "6 menit baca",
            category: "Nutrisi & Makanan",
            views: "6.1K views",
            content: [
                "Cokelat, bawang putih, bawang bombay, anggur, dan kismis termasuk makanan yang sangat beracun bagi anjing meski dalam jumlah kecil. Kandungan theobromine pada cokelat misalnya, dapat memicu gangguan jantung dan sistem saraf.",
                "Xylitol, pemanis buatan yang sering ada pada permen karet bebas gula, dapat menyebabkan penurunan gula darah drastis dan kerusakan hati pada anjing.",
                "Jika anjing Anda tidak sengaja memakan salah satu makanan berbahaya di atas, segera hubungi dokter hewan terdekat untuk penanganan cepat."
            ]
        },
        "tanda-kucing-sakit": {
            photo: "/foto/kucingsakit.jpg",
            emoji: "🏥",
            gradient: "linear-gradient(135deg, #e8f8f0, #b2e4c8)",
            tag: "Klinik",
            title: "Tanda-Tanda Kucing Sakit yang Sering Diabaikan Pemilik",
            date: "5 April 2026",
            author: "drh. Budi Santoso",
            readTime: "3 menit baca",
            category: "Klinik",
            views: "2.6K views",
            content: [
                "Perubahan nafsu makan, kucing yang tiba-tiba lebih pendiam, atau bersembunyi lebih sering dari biasanya bisa menjadi sinyal awal bahwa kucing sedang tidak sehat.",
                "Perhatikan juga pola buang air, frekuensi minum yang berubah drastis, serta perubahan pada tekstur dan kilau bulunya karena bisa mengindikasikan masalah kesehatan yang lebih serius.",
                "Jika gejala berlangsung lebih dari 24–48 jam, segera bawa kucing ke klinik hewan untuk pemeriksaan lebih lanjut."
            ]
        },
        "melatih-anjing-duduk": {
            photo: "/foto/latihanjing.jpg",
            emoji: "🎓",
            gradient: "linear-gradient(135deg, #f0eaff, #d4b8f0)",
            tag: "Pelatihan",
            title: "Cara Melatih Anjing Duduk dan Diam dalam 7 Hari untuk Pemula",
            date: "2 April 2026",
            author: "Tim Trainer ZOON",
            readTime: "5 menit baca",
            category: "Pelatihan",
            views: "4.4K views",
            content: [
                "Gunakan metode reward-based training dengan camilan kecil sebagai penguat positif setiap kali anjing berhasil melakukan perintah dengan benar.",
                "Latih dalam sesi singkat 5–10 menit, 2–3 kali sehari, agar anjing tetap fokus dan tidak mudah bosan. Konsistensi kata perintah sangat penting agar anjing tidak bingung.",
                "Setelah perintah duduk dikuasai, lanjutkan ke perintah diam dengan menambah durasi secara bertahap sambil tetap memberikan pujian."
            ]
        },
        "memilih-hewan-pertama": {
            photo: "/foto/kucingnakal.jpg",
            emoji: "❤️",
            gradient: "linear-gradient(135deg, #ffeaea, #ffb8b8)",
            tag: "Tips",
            title: "Cara Memilih Hewan Peliharaan Pertama yang Tepat untuk Keluarga",
            date: "28 Maret 2026",
            author: "Tim Editorial ZOON",
            readTime: "4 menit baca",
            category: "Tips & Trik",
            views: "3.2K views",
            content: [
                "Sesuaikan pilihan hewan dengan gaya hidup, ukuran tempat tinggal, dan waktu luang yang tersedia. Keluarga yang sibuk mungkin lebih cocok dengan kucing atau kelinci dibanding anjing ras aktif.",
                "Pertimbangkan juga anggaran rutin untuk makanan, vaksinasi, dan perawatan kesehatan agar hewan peliharaan mendapat perawatan yang layak sepanjang hidupnya.",
                "Libatkan seluruh anggota keluarga dalam keputusan ini, terutama jika ada anak kecil, agar tanggung jawab merawat hewan bisa dibagi bersama."
            ]
        },
        "pet-hotel-mudik": {
            photo: "/foto/anjingselfie.jpg",
            emoji: "🏨",
            gradient: "linear-gradient(135deg, #e8f7f9, #c8ecf0)",
            tag: "Penitipan",
            title: "Tips Memilih Pet Hotel yang Aman dan Terpercaya saat Mudik Lebaran",
            date: "25 Maret 2026",
            author: "Tim Editorial ZOON",
            readTime: "3 menit baca",
            category: "Penitipan",
            views: "2.9K views",
            content: [
                "Pastikan pet hotel memiliki fasilitas kandang yang bersih, ventilasi baik, serta staf yang berpengalaman menangani hewan peliharaan selama masa penitipan.",
                "Cek juga apakah tersedia layanan CCTV atau update foto/video harian sehingga Anda tetap bisa memantau kondisi hewan peliharaan dari jarak jauh.",
                "Booking jauh-jauh hari terutama menjelang musim mudik, karena slot pet hotel terpercaya biasanya cepat penuh."
            ]
        }
    };

    /* ────────────────────────────────────────────
       2. ELEMEN MODAL
       ──────────────────────────────────────────── */
    const overlay = document.getElementById("articleModalOverlay");
    const modalClose = document.getElementById("articleModalClose");
    const modalImgWrap = document.getElementById("articleModalImgWrap");
    const modalImgTag = document.getElementById("articleModalImgTag");
    const modalEmoji = document.getElementById("articleModalEmoji");
    const modalTagBadge = document.getElementById("articleModalTagBadge");
    const modalMeta = document.getElementById("articleModalMeta");
    const modalTitle = document.getElementById("articleModalTitle");
    const modalContent = document.getElementById("articleModalContent");
    const modalTableBody = document.getElementById("articleModalTableBody");

    /**
     * Membuka modal dan mengisi seluruh konten berdasarkan id artikel.
     * @param {string} id - key pada objek ARTICLES
     */
    function openArticleModal(id) {
        const data = ARTICLES[id];
        if (!data || !overlay) return;

        // Foto + fallback emoji
        modalImgWrap.style.background = data.gradient;
        modalImgTag.style.display = "block";
        modalImgTag.src = data.photo;
        modalImgTag.alt = data.title;
        modalEmoji.textContent = data.emoji;
        modalTagBadge.textContent = "🏷️ " + data.tag;

        // Meta info di atas judul
        modalMeta.innerHTML =
            '<span><i class="fas fa-calendar"></i> ' + data.date + "</span>" +
            (data.author ? '<span><i class="fas fa-user"></i> ' + data.author + "</span>" : "") +
            '<span><i class="fas fa-clock"></i> ' + data.readTime + "</span>";

        // Judul
        modalTitle.textContent = data.title;

        // Isi artikel (paragraf)
        modalContent.innerHTML = data.content
            .map(function (paragraph) {
                return "<p>" + paragraph + "</p>";
            })
            .join("");

        // Tabel ringkasan / penjelasan artikel
        const rows = [
            ["fa-folder-open", "Kategori", data.category],
            ["fa-user", "Penulis", data.author || "-"],
            ["fa-calendar", "Tanggal Terbit", data.date],
            ["fa-clock", "Waktu Baca", data.readTime],
            ["fa-eye", "Dilihat", data.views]
        ];
        modalTableBody.innerHTML = rows
            .map(function (row) {
                return (
                    "<tr><td><i class='fas " + row[0] + "'></i>" + row[1] + "</td><td>" + row[2] + "</td></tr>"
                );
            })
            .join("");

        // Tampilkan modal
        overlay.classList.add("active");
        document.body.classList.add("modal-open");
    }

    /** Menutup modal detail artikel */
    function closeArticleModal() {
        if (!overlay) return;
        overlay.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    /* ────────────────────────────────────────────
       3. EVENT: klik "Baca" / "Baca Selengkapnya"
       Juga bisa klik di mana saja pada kartu artikel.
       ──────────────────────────────────────────── */
    document.addEventListener("click", function (e) {
        const trigger = e.target.closest("[data-article]");
        if (trigger) {
            e.preventDefault();
            openArticleModal(trigger.getAttribute("data-article"));
        }
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeArticleModal);
    }

    if (overlay) {
        // Klik area gelap di luar kartu modal akan menutup modal
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) closeArticleModal();
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeArticleModal();
    });

    /* ────────────────────────────────────────────
       4. FITUR TAMBAHAN: Pencarian artikel di sidebar
       Memfilter kartu artikel berdasarkan judul secara real-time.
       ──────────────────────────────────────────── */
    const searchInput = document.querySelector(".sidebar-search input");
    const searchButton = document.querySelector(".sidebar-search button");
    const blogCards = document.querySelectorAll(".blog-grid .blog-card");

    function filterArticles() {
        if (!searchInput) return;
        const keyword = searchInput.value.trim().toLowerCase();

        blogCards.forEach(function (card) {
            const title = card.querySelector("h3");
            const matches = !keyword || (title && title.textContent.toLowerCase().includes(keyword));
            card.style.display = matches ? "" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterArticles);
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") e.preventDefault();
        });
    }
    if (searchButton) {
        searchButton.addEventListener("click", function (e) {
            e.preventDefault();
            filterArticles();
        });
    }

    /* ────────────────────────────────────────────
       5. FITUR TAMBAHAN: Newsletter (sementara tanpa backend)
       ──────────────────────────────────────────── */
    const newsletterBtn = document.querySelector(".newsletter-input button");
    if (newsletterBtn) {
        newsletterBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const emailInput = document.querySelector(".newsletter-input input");
            const email = emailInput ? emailInput.value.trim() : "";

            if (!email || !email.includes("@")) {
                emailInput.focus();
                emailInput.style.boxShadow = "0 0 0 2px #ff8a3d";
                setTimeout(function () {
                    emailInput.style.boxShadow = "";
                }, 1200);
                return;
            }

            newsletterBtn.textContent = "Berhasil Berlangganan ✓";
            newsletterBtn.disabled = true;
            emailInput.value = "";
        });
    }

    /* ────────────────────────────────────────────
       6. FITUR TAMBAHAN: Pagination scroll halus
       ──────────────────────────────────────────── */
    const pageButtons = document.querySelectorAll(".pagination .page-btn");
    pageButtons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            pageButtons.forEach(function (b) {
                b.classList.remove("active");
            });
            if (!btn.querySelector("i")) btn.classList.add("active");

            const blogMain = document.querySelector(".blog-main");
            if (blogMain) blogMain.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
})();

/* ══════════════════════════════════════════════════════════════
   TAMBAHAN BARU — MODAL FORM "BUAT JANJI KLINIK"
   Kode ini BERDIRI SENDIRI (IIFE terpisah), tidak mengubah atau
   bergantung pada kode Blog.js di atasnya. Aman ditempel di
   bagian paling bawah file tanpa merusak fitur yang sudah ada.
   ══════════════════════════════════════════════════════════════ */
(function () {
    "use strict";

    const overlay = document.getElementById("appointmentModalOverlay");
    const closeBtn = document.getElementById("appointmentModalClose");
    const closeSuccessBtn = document.getElementById("appointmentCloseSuccess");
    const trigger = document.querySelector(".cta-section .btn-light");

    const formState = document.getElementById("appointmentFormState");
    const successState = document.getElementById("appointmentSuccessState");
    const form = document.getElementById("appointmentForm");
    const dateInput = document.getElementById("apptDate");

    const successName = document.getElementById("appointmentSuccessName");
    const summaryTable = document.getElementById("appointmentSummaryTable");

    if (!overlay || !trigger || !form) return; // jaga-jaga kalau elemen belum ada

    // Tanggal minimal = hari ini (tidak bisa pilih tanggal lampau)
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.setAttribute("min", today);
    }

    function openAppointmentModal(e) {
        e.preventDefault();
        formState.style.display = "block";
        successState.style.display = "none";
        overlay.classList.add("active");
        document.body.classList.add("modal-open");
    }

    function closeAppointmentModal() {
        overlay.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    trigger.addEventListener("click", openAppointmentModal);
    if (closeBtn) closeBtn.addEventListener("click", closeAppointmentModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", closeAppointmentModal);

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeAppointmentModal();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && overlay.classList.contains("active")) {
            closeAppointmentModal();
        }
    });

    // Validasi sederhana + tampilkan ringkasan setelah submit
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let valid = true;
        const requiredFields = form.querySelectorAll("[required]");
        requiredFields.forEach(function (field) {
            if (!field.value.trim()) {
                field.classList.add("field-error");
                valid = false;
            } else {
                field.classList.remove("field-error");
            }
        });

        if (!valid) return;

        const data = {
            nama: document.getElementById("apptName").value.trim(),
            telepon: document.getElementById("apptPhone").value.trim(),
            hewan: document.getElementById("apptPet").value,
            layanan: document.getElementById("apptService").value,
            tanggal: document.getElementById("apptDate").value,
            jam: document.getElementById("apptTime").value,
            catatan: document.getElementById("apptNote").value.trim() || "-"
        };

        // Format tanggal agar mudah dibaca (contoh: 12 Juli 2026)
        const formattedDate = data.tanggal
            ? new Date(data.tanggal + "T00:00:00").toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
              })
            : "-";

        successName.textContent = ", " + data.nama;
        summaryTable.innerHTML =
            "<tr><td>Jenis Hewan</td><td>" + data.hewan + "</td></tr>" +
            "<tr><td>Layanan</td><td>" + data.layanan + "</td></tr>" +
            "<tr><td>Jadwal</td><td>" + formattedDate + ", pukul " + data.jam + "</td></tr>" +
            "<tr><td>No. WhatsApp</td><td>" + data.telepon + "</td></tr>";

        // TODO (opsional): kirim "data" ke server/WhatsApp API di sini
        // Contoh: fetch('/api/janji-klinik', { method: 'POST', body: JSON.stringify(data) })

        formState.style.display = "none";
        successState.style.display = "block";
        form.reset();
    });

    // Hilangkan tanda error saat user mulai mengisi ulang
    form.addEventListener("input", function (e) {
        if (e.target.classList.contains("field-error")) {
            e.target.classList.remove("field-error");
        }
    });
})();