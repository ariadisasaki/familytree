/**
 * KONFIGURASI UTAMA
 * Ganti URL di bawah dengan URL Web App (hasil Deploy) dari Google Apps Script Anda.
 */
const CONFIG = {
    // EDIT BAGIAN INI: Masukkan URL Web App Anda
    API_URL: "https://script.google.com/macros/s/AKfycbwi1ky_Xi61PmZ04hIxoXHH4g8pqUbYkWjEb65BpqP8rA8y976Xt2-SbVUydiIcJhQykQ/exec",
    PASSWORD_DEFAULT: "keluarga123" 
};

/**
 * Mengambil data statistik dari Google Sheets
 */
async function fetchStats() {
    try {
        const response = await fetch(`${CONFIG.API_URL}?action=getStats`);
        const data = await response.json();
        
        const container = document.getElementById('statsContainer');
        const stats = [
            { label: 'Anggota', value: data.members, icon: 'users' },
            { label: 'Generasi', value: data.generation, icon: 'layers' },
            { label: 'Orang Tua', value: data.parents, icon: 'user-check' },
            { label: 'Anak', value: data.children, icon: 'baby' }
        ];

        container.innerHTML = stats.map(s => `
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <i data-lucide="${s.icon}" class="w-4 h-4"></i>
                    </div>
                    <span class="text-slate-500 text-xs font-semibold uppercase">${s.label}</span>
                </div>
                <h3 class="text-2xl font-bold">${s.value}</h3>
            </div>
        `).join('');
        lucide.createIcons();
    } catch (e) {
        console.error("Gagal ambil stats:", e);
    }
}

/**
 * Mengambil data silsilah untuk digambar
 */
async function loadTree() {
    try {
        const response = await fetch(`${CONFIG.API_URL}?action=getTree`);
        const data = await response.json();
        renderTree(data); // Fungsi ini ada di tree.js
    } catch (e) {
        console.error("Gagal ambil data silsilah:", e);
    }
}
