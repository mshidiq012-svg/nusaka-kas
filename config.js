// 1. GANTI DENGAN URL & KEY DARI SUPABASE ANDA
// (Cari di Dashboard Supabase -> Settings -> API)
const SUPABASE_URL = 'https://iitvhiwizdopcrucunyf.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdHZoaXdpemRvcGNydWN1bnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjAyMDEsImV4cCI6MjA4NjIzNjIwMX0.m4uHQc6eOTFa6zgNoebNwpt2diQr1GKAxV4K6x5nH1s'; 

if (typeof window.supabase !== 'undefined') {
    // KITA PAKAI NAMA 'supabaseClient' AGAR COCOK DENGAN DASHBOARD
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Config: Database Terhubung.");
} else {
    console.error("Config: Library Supabase tidak ditemukan!");
}