document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    // PERBAIKAN DI SINI: Memilih elemen UL di dalam .main-nav
    const mainNav = document.querySelector('.main-nav ul'); // <-- Perubahan ada di sini!

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Change icon
            const icon = navToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // 'X' icon
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // Hamburger icon
            }
        });
    }

    // --- Dropdown Toggle for Mobile Navigation ---
    const dropdownToggles = document.querySelectorAll('.main-nav .dropbtn');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.preventDefault();
            const parentLi = this.closest('li.dropdown');
            if (!parentLi) return;

            // Periksa visibilitas navToggle untuk memastikan ini hanya untuk mobile
            const navToggleVisible = window.getComputedStyle(navToggle).display === 'block';

            if (navToggleVisible) {
                // Tutup dropdown lain yang sedang terbuka saat dropdown baru dibuka
                document.querySelectorAll('.main-nav .dropdown-content').forEach(content => {
                    if (content.closest('li.dropdown') !== parentLi && content.style.display === 'block') {
                        content.style.display = 'none';
                        content.closest('li.dropdown').querySelector('.dropbtn .fas').style.transform = 'rotate(0deg)';
                    }
                });

                const dropdownContent = parentLi.querySelector('.dropdown-content');
                const dropdownIcon = parentLi.querySelector('.dropbtn .fas');

                if (dropdownContent) {
                    if (dropdownContent.style.display === 'block') {
                        dropdownContent.style.display = 'none';
                        if (dropdownIcon) dropdownIcon.style.transform = 'rotate(0deg)';
                    } else {
                        dropdownContent.style.display = 'block';
                        if (dropdownIcon) dropdownIcon.style.transform = 'rotate(180deg)';
                    }
                }
            }
        });
    });


    // --- Close mobile nav when a link is clicked (optional) ---
    const navLinks = document.querySelectorAll('.main-nav a:not(.dropbtn)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navToggleVisible = window.getComputedStyle(navToggle).display === 'block';
            if (navToggleVisible && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                navToggle.querySelector('i').classList.remove('fa-times');
                navToggle.querySelector('i').classList.add('fa-bars');
                // Pastikan semua dropdown tertutup saat menu utama ditutup
                document.querySelectorAll('.main-nav .dropdown-content').forEach(content => {
                    content.style.display = 'none';
                    const parentDropdown = content.closest('li.dropdown');
                    if (parentDropdown) {
                        const dropdownIcon = parentDropdown.querySelector('.dropbtn .fas');
                        if (dropdownIcon) dropdownIcon.style.transform = 'rotate(0deg)';
                    }
                });
            }
        });
    });

    // --- Close dropdowns if main nav is closed from hamburger (desktop view transition) ---
    window.addEventListener('resize', () => {
        const navToggleVisible = window.getComputedStyle(navToggle).display === 'block';
        if (!navToggleVisible && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            navToggle.querySelector('i').classList.remove('fa-times');
            navToggle.querySelector('i').classList.add('fa-bars');
            // Pastikan semua dropdown tertutup saat beralih ke desktop
            document.querySelectorAll('.main-nav .dropdown-content').forEach(content => {
                content.style.display = 'none';
                const parentDropdown = content.closest('li.dropdown');
                if (parentDropdown) {
                    const dropdownIcon = parentDropdown.querySelector('.dropbtn .fas');
                    if (dropdownIcon) dropdownIcon.style.transform = 'rotate(0deg)';
                }
            });
        }
    });


    // --- Form Validation for PPDB Form ---
    const ppdbForm = document.querySelector('.main-form'); // Pastikan ini mengacu ke form PPDB
    if (ppdbForm) {
        ppdbForm.addEventListener('submit', function(event) {
            // Hentikan pengiriman formulir default
            event.preventDefault();

            let isValid = true; // Flag untuk melacak validasi

            // Hapus pesan error sebelumnya
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

            // Validasi input teks dan select yang required
            const requiredFields = ppdbForm.querySelectorAll('input[required], select[required], textarea[required]');
            requiredFields.forEach(field => {
                if (field.value.trim() === '') {
                    isValid = false;
                    displayError(field, 'Bidang ini wajib diisi.');
                }
            });

            // Validasi Email
            const emailField = ppdbForm.querySelector('#email_ortu');
            if (emailField && emailField.value.trim() !== '') { // Jika tidak kosong (opsional)
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    isValid = false;
                    displayError(emailField, 'Format email tidak valid.');
                }
            }

            // Validasi Nomor Telepon (Hanya angka)
            const phoneField = ppdbForm.querySelector('#no_hp_ortu');
            if (phoneField && phoneField.value.trim() !== '') {
                const phonePattern = /^\d+$/; // Hanya angka
                if (!phonePattern.test(phoneField.value.trim())) {
                    isValid = false;
                    displayError(phoneField, 'Nomor telepon hanya boleh berisi angka.');
                }
            }

            // Validasi Checkbox Syarat & Ketentuan
            const checkboxSyarat = ppdbForm.querySelector('#setuju_syarat');
            if (checkboxSyarat && !checkboxSyarat.checked) {
                isValid = false;
                // Pesan error di samping checkbox atau di bawahnya
                displayError(checkboxSyarat, 'Anda harus menyetujui syarat dan ketentuan.');
            }


            if (isValid) {
                // Jika semua validasi berhasil, Anda bisa melanjutkan pengiriman formulir
                // Untuk contoh ini, kita hanya akan menampilkan alert
                alert('Formulir berhasil divalidasi dan siap dikirim!');
                // Di aplikasi nyata, Anda akan mengirim formulir ke server:
                // ppdbForm.submit();
            }
        });

        // Fungsi untuk menampilkan pesan error
        function displayError(field, message) {
            const errorElement = document.createElement('div');
            errorElement.classList.add('error-message');
            errorElement.style.color = '#dc3545'; // Warna merah
            errorElement.style.fontSize = '0.9em';
            errorElement.style.marginTop = '5px';
            errorElement.textContent = message;

            // Tambahkan kelas untuk menandai input yang salah
            field.classList.add('is-invalid');

            // Masukkan pesan error setelah input field atau di dalam form-group
            if (field.type === 'checkbox') {
                // Untuk checkbox, temukan parent .form-group dan tambahkan di dalamnya
                field.closest('.form-group').appendChild(errorElement);
            } else {
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
        }

        // Hapus pesan error saat input berubah (opsional, untuk UX lebih baik)
        ppdbForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('is-invalid');
                // Pastikan untuk mencari elemen error di parent yang tepat
                const existingError = this.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
            });
            // Penanganan khusus untuk checkbox 'change' event
            if (field.type === 'checkbox') {
                field.addEventListener('change', function() {
                    this.classList.remove('is-invalid');
                    const existingError = this.closest('.form-group').querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                });
            }
        });
    }
}); // Ini adalah penutup dari document.addEventListener('DOMContentLoaded', ...)