// ============================================================
// FILE: member_guard.js (With Session & Auto-Logout Idle)
// ============================================================

(function() {
    // 1. Sembunyikan halaman biar gak kedip
    document.documentElement.style.display = 'none';

    function checkMemberAuth() {
        // 2. Ambil data sesi dari Local Storage
        const sessionString = localStorage.getItem('memberSession');

        // Jika tidak ada data, langsung tendang ke halaman portal
        if (!sessionString) {
            window.location.replace('portal.html'); // Pastikan path ini benar sesuai struktur folder Anda
            return;
        }

        // 3. Validasi & Render Halaman
        try {
            const memberData = JSON.parse(sessionString);
            window.currentMember = memberData;
            
            // Tampilkan halaman karena sukses
            document.documentElement.style.display = 'block';
            window.dispatchEvent(new Event('memberLoaded'));
            
            // 4. JALANKAN FITUR AUTO-LOGOUT 5 MENIT
            startIdleTimer();
            
        } catch (err) {
            console.error("Gagal membaca sesi lokal:", err);
            localStorage.removeItem('memberSession');
            window.location.replace('portal.html');
        }
    }

    // --- LOGIKA AUTO LOGOUT (IDLE TIMEOUT) ---
    function startIdleTimer() {
        let idleTime = 0;
        
        // Fungsi untuk mereset timer jika ada pergerakan
        function resetTimer() {
            idleTime = 0;
        }

        // Pantau aktivitas user (Klik, Gerak Mouse, Ketik, Scroll)
        window.onload = resetTimer;
        document.onmousemove = resetTimer;
        document.onkeypress = resetTimer;
        document.onclick = resetTimer;
        document.onscroll = resetTimer;

        // Cek setiap 1 menit (60.000 ms)
        setInterval(() => {
            idleTime += 1;
            
            // Jika idle mencapai 5 menit
            if (idleTime >= 5) {
                // Hapus Sesi
                localStorage.removeItem('memberSession');
                
                // Beri tahu user dan tendang keluar
                alert("Sesi Anda telah berakhir karena tidak ada aktivitas selama 5 menit. Silakan masuk kembali.");
                window.location.replace('portal.html'); // Arahkan kembali ke portal
            }
        }, 60000); // Jalan setiap 1 Menit
    }

    // --- INISIALISASI ---
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", checkMemberAuth);
    } else {
        checkMemberAuth();
    }
})();