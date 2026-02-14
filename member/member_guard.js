// ============================================================
// FILE: member_guard.js (Fixed Path)
// ============================================================

(function() {
    // 1. Sembunyikan halaman biar gak kedip (Blank putih dulu)
    document.documentElement.style.display = 'none';

    async function checkMemberAuth() {
        // Cek Config
        if (!window.supabaseClient) {
            setTimeout(checkMemberAuth, 50);
            return;
        }

        const supabase = window.supabaseClient;

        // 2. Cek Sesi Login
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!session || error) {
            console.warn("Akses ditolak: Tidak ada sesi.");
            // Karena satu folder, cukup panggil nama file
            window.location.replace('portal.html');
            return;
        }

        // 3. Cek Profil (Pastikan Data Bisa Dibaca)
        try {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            // Jika Error membaca profil (Biasanya karena RLS di Supabase belum diset)
            if (profileError || !profile) {
                console.error("Gagal baca profil. Cek RLS Supabase!", profileError);
                alert("Gagal memuat data profil. Silakan login ulang.");
                await supabase.auth.signOut();
                window.location.replace('portal.html');
                return;
            }

            // === SUKSES: BUKA HALAMAN ===
            window.currentMember = profile;
            document.documentElement.style.display = 'block';
            window.dispatchEvent(new Event('memberLoaded'));

        } catch (err) {
            console.error("Guard Error:", err);
            window.location.replace('portal.html');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", checkMemberAuth);
    } else {
        checkMemberAuth();
    }
})();