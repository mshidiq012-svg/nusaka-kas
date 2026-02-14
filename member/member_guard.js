// ============================================================
// FILE: member_guard.js
// FUNGSI: Menjaga Halaman Member (Satpam)
// ============================================================

(function() {
    // 1. Sembunyikan halaman biar gak kedip (Blank putih dulu)
    document.documentElement.style.display = 'none';

    async function checkMemberAuth() {
        // Cek 1: Apakah Config Supabase sudah load?
        if (!window.supabaseClient) {
            // Kalau belum, tunggu 50ms lalu cek lagi (Looping)
            setTimeout(checkMemberAuth, 50);
            return;
        }

        const supabase = window.supabaseClient;

        // Cek 2: Ambil Session (Tiket Masuk)
        const { data: { session }, error } = await supabase.auth.getSession();

        // JIKA TIDAK ADA SESI (BELUM LOGIN)
        if (!session || error) {
            console.warn("Sesi tidak ditemukan, melempar ke portal...");
            // PERBAIKAN: Gunakan '../' untuk mundur ke folder utama
            window.location.replace('../portal.html'); 
            return;
        }

        // Cek 3: Ambil Data Profil (Pastikan dia benar Member)
        try {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileError || !profile) {
                console.error("Profil tidak ditemukan di database!");
                await supabase.auth.signOut();
                window.location.replace('../portal.html');
                return;
            }

            // === LOGIN SUKSES ===
            
            // A. Simpan data user ke Global Variable (Biar Dashboard bisa baca)
            window.currentMember = profile;

            // B. Tampilkan Halaman (Buka Tirai)
            document.documentElement.style.display = 'block';

            // C. Teriak ke Dashboard: "WOI DATA UDAH SIAP NIH!"
            window.dispatchEvent(new Event('memberLoaded'));

            // D. Jalankan Timer Auto-Logout (Opsional)
            startInactivityTimer();

        } catch (err) {
            console.error("Auth Error:", err);
            window.location.replace('../portal.html');
        }
    }

    // Jalankan pengecekan saat browser siap
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", checkMemberAuth);
    } else {
        checkMemberAuth();
    }
})();

// ==========================================
// HELPER: AUTO LOGOUT & MANUAL LOGOUT
// ==========================================
function startInactivityTimer() {
    let time;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.ontouchstart = resetTimer;

    function logout() {
        alert("Sesi habis (5 menit tidak aktif). Silakan login lagi.");
        logoutMember();
    }

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logout, 300000); // 5 Menit
    }
}

window.logoutMember = async function() {
    if (confirm("Yakin ingin keluar?")) {
        if(window.supabaseClient) await window.supabaseClient.auth.signOut();
        localStorage.clear();
        window.location.replace('../portal.html');
    }
};