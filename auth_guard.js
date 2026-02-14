// ============================================================
// FILE: member_guard.js
// FUNGSI: Proteksi Halaman Member + Load Data User
// ============================================================

(function() {
    // 1. SEMBUNYIKAN HALAMAN (ANTI-FLICKER)
    // Halaman akan blank putih sampai pengecekan selesai, biar user gak lihat isinya kalau belum login.
    document.documentElement.style.display = 'none';

    async function checkMemberAuth() {
        // Tunggu sebentar jika config.js belum selesai loading
        if (!window.supabaseClient) {
            setTimeout(checkMemberAuth, 50);
            return;
        }

        const supabase = window.supabaseClient;

        // 2. CEK SESI LOGIN
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            // Belum login -> Tendang ke halaman login
            window.location.replace('login.html'); 
            return;
        }

        // 3. AMBIL DATA PROFILE (PENTING: Dashboard butuh data ini)
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error || !profile) {
                console.error("Gagal load profil:", error);
                await supabase.auth.signOut();
                window.location.replace('login.html');
                return;
            }

            // 4. CEK ROLE (Harus Member)
            // Jika admin iseng masuk ke halaman member, tetap bisa (opsional), 
            // tapi kalau mau strict, uncomment blok di bawah:
            /*
            if (profile.role !== 'member') {
                alert("Anda bukan Member!");
                await supabase.auth.signOut();
                window.location.replace('login.html');
                return;
            }
            */

            // 5. SIMPAN DATA KE GLOBAL VARIABLE (AGAR BISA DIPAKAI DASHBOARD)
            window.currentMember = profile;

            // 6. BUKA TIRAI (TAMPILKAN HALAMAN)
            document.documentElement.style.display = 'block';

            // 7. TRIGGER EVENT (Memberitahu dashboard.html bahwa data sudah siap)
            // Ini yang memperbaiki masalah "Nama tidak muncul" atau "Rp..."
            window.dispatchEvent(new Event('memberLoaded'));

        } catch (err) {
            console.error("Auth Error:", err);
            window.location.replace('login.html');
        }
    }

    // Jalankan saat browser siap
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", checkMemberAuth);
    } else {
        checkMemberAuth();
    }
})();

// FUNGSI LOGOUT MEMBER (Dipanggil dari tombol di Navbar)
window.logoutMember = async function() {
    const supabase = window.supabaseClient;
    if (confirm("Apakah Anda yakin ingin keluar?")) {
        try {
            await supabase.auth.signOut();
            localStorage.clear(); // Bersihkan cache lokal
            window.location.replace('login.html');
        } catch (error) {
            console.error("Logout error:", error);
            window.location.replace('login.html');
        }
    }
};