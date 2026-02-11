// Cek Sesi Login
const memberSession = localStorage.getItem('nusaka_member_session');

if (!memberSession) {
    // Jika tidak ada sesi, tendang ke Portal Login
    window.location.href = 'portal.html';
}

const currentMember = JSON.parse(memberSession);

// ==========================================
// FITUR AUTO-LOGOUT (5 MENIT)
// ==========================================
let inactivityTime = function () {
    let time;
    // Reset timer jika ada gerakan mouse atau ketikan
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;

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

// Jalankan fungsi timer
inactivityTime();

// Fungsi Logout Manual
function logoutMember() {
    localStorage.removeItem('nusaka_member_session');
    // Redirect sesuai permintaan Anda
    window.location.href = 'portal.html';
}