// Simpan di: member/member_guard.js

// Cek apakah ada data member di LocalStorage
const memberSession = localStorage.getItem('nusaka_member_session');

if (!memberSession) {
    // Jika tidak ada sesi, tendang ke halaman login (portal)
    // Sesuaikan path '../portal.html' dengan struktur folder Anda
    window.location.href = '../portal.html'; 
}

const currentMember = JSON.parse(memberSession);

// Fungsi Logout untuk Member
function logoutMember() {
    localStorage.removeItem('nusaka_member_session');
    window.location.href = '../portal.html';
}