// ============================================================
// FILE: member_guard.js
// FUNGSI: Proteksi Member + Load Data + Auto Logout
// ============================================================

(function() {
    // Sembunyikan halaman agar tidak berkedip
    document.documentElement.style.display = 'none';

    async function checkMemberAuth() {
        // Tunggu config.js
        if (!window.supabaseClient) {
            setTimeout(checkMemberAuth, 50);
            return;
        }

        const supabase = window.supabaseClient;

        // 1. Cek Sesi Login Supabase
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            // Jika tidak ada sesi, tendang ke Portal Login
            window.location.href = 'portal.html'; // Sesuai request Anda
            return;
        }

        // 2. Ambil Data Profil Member
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error || !profile) {
                console.error("Gagal load profil:", error);
                await supabase.auth.signOut();
                window.location.href = 'portal.html';
                return;
            }

            // 3. Simpan Data ke Global Variable (PENTING UNTUK DASHBOARD)
            window.currentMember = profile;

            // 4. Tampilkan Halaman
            document.documentElement.style.display = 'block';

            // 5. Beritahu Dashboard bahwa data siap (Fix masalah nama/tagihan loading terus)
            window.dispatchEvent(new Event('memberLoaded'));

            // 6. Jalankan Timer Auto-Logout
            inactivityTime();

        } catch (err) {
            console.error("Auth Error:", err);
            window.location.href = 'portal.html';
        }
    }

    // Jalankan saat load
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", checkMemberAuth);
    } else {
        checkMemberAuth();
    }
})();

// ==========================================
// FITUR AUTO-LOGOUT (5 MENIT)
// ==========================================
let inactivityTime = function () {
    let time;
    
    // Reset timer jika ada aktivitas
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;
    document.ontouchstart = resetTimer; // Tambahan untuk Mobile

    function logout() {
        alert("Sesi berakhir karena tidak ada aktivitas selama 5 menit.");
        logoutMember();
    }

    function resetTimer() {
        clearTimeout(time);
        // 5 Menit = 300000 milidetik
        time = setTimeout(logout, 300000);
    }
};

// ==========================================
// FUNGSI LOGOUT MANUAL (SUPABASE)
// ==========================================
window.logoutMember = async function() {
    if(window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
    }
    localStorage.clear(); // Bersihkan sisa-sisa cache
    window.location.href = 'portal.html';
};