// ============================================================
// FILE: auth_guard.js
// FUNGSI: Proteksi Halaman Admin (Menggunakan Supabase)
// ============================================================

(function() {
    // 1. SEMBUNYIKAN HALAMAN (BIAR GAK KELIHATAN SEBELUM CEK LOGIN)
    document.documentElement.style.display = 'none';

    async function checkAuth() {
        // Tunggu sebentar memastikan config.js sudah load
        if (!window.supabaseClient) {
            console.warn("AuthGuard: Menunggu Supabase...");
            setTimeout(checkAuth, 50); // Cek lagi dalam 50ms
            return;
        }

        const supabase = window.supabaseClient;

        // 2. CEK APAKAH ADA USER LOGIN?
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            // KALAU GAK ADA SESI -> LEMPAR KE LOGIN
            window.location.replace('../auth/login.html');
        } else {
            // KALAU ADA SESI -> CEK ROLE
            // Kita cek profilnya sebentar
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            // Jika role valid (admin/superadmin)
            if (profile && (profile.role === 'admin' || profile.role === 'superadmin')) {
                // === SUKSES: BUKA TIRAI (TAMPILKAN HALAMAN) ===
                document.documentElement.style.display = 'block';
            } else {
                // Jika login tapi bukan admin (misal member nyasar)
                alert("Anda bukan Admin!");
                await supabase.auth.signOut();
                window.location.replace('../auth/login.html');
            }
        }
    }

    // Jalankan pengecekan
    document.addEventListener("DOMContentLoaded", checkAuth);
})();

// FUNGSI LOGOUT GLOBAL (Bisa dipanggil dari tombol HTML)
window.logout = async function() {
    const supabase = window.supabaseClient;
    if (confirm("Yakin ingin keluar?")) {
        await supabase.auth.signOut();
        localStorage.clear();
        window.location.replace('../auth/login.html');
    }
};