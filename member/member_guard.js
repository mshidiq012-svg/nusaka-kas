// ============================================================
// FILE: member_guard.js (DIPERBAIKI)
// ============================================================

(function() {
    // 1. Sembunyikan halaman biar gak kedip
    document.documentElement.style.display = 'none';

    async function checkMemberAuth() {
        // Cek 1: Config Supabase
        if (!window.supabaseClient) {
            setTimeout(checkMemberAuth, 50);
            return;
        }

        const supabase = window.supabaseClient;

        // Cek 2: Ambil Session
        const { data: { session }, error } = await supabase.auth.getSession();

        // JIKA GAGAL DAPAT SESI
        if (!session || error) {
            console.warn("Guard: Tidak ada sesi login.");
            // PERBAIKAN: Gunakan 'portal.html' karena satu folder dengan dashboard
            window.location.replace('portal.html'); 
            return;
        }

        // Cek 3: Ambil Data Profil
        try {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            // JIKA GAGAL DAPAT PROFIL (Biasanya karena RLS)
            if (profileError || !profile) {
                console.error("Guard Error:", profileError);
                alert("Gagal memuat profil! Cek Policies (RLS) di Supabase."); // Alert Debugging
                
                await supabase.auth.signOut();
                window.location.replace('portal.html');
                return;
            }

            // === LOGIN SUKSES ===
            window.currentMember = profile;
            document.documentElement.style.display = 'block';
            window.dispatchEvent(new Event('memberLoaded'));
            startInactivityTimer();

        } catch (err) {
            console.error("Critical Auth Error:", err);
            window.location.replace('portal.html');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", checkMemberAuth);
    } else {
        checkMemberAuth();
    }
})();

// HELPER: AUTO LOGOUT
function startInactivityTimer() {
    let time;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.ontouchstart = resetTimer;

    function logout() {
        // Hapus alert jika mengganggu, ini cuma penanda
        // alert("Sesi habis (5 menit)."); 
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
        window.location.replace('portal.html');
    }
};