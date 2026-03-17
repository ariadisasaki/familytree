import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =============================
// AMBIL ID DARI URL
// =============================
const container = document.getElementById("profile");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// validasi ID
if (!id) {
  container.innerHTML = "<p>ID tidak ditemukan di URL</p>";
  throw new Error("ID kosong");
}

// =============================
// LOAD PROFILE
// =============================
async function loadProfile() {
  try {
    console.log("ID:", id);

    const ref = doc(db, "anggota_keluarga", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      container.innerHTML = "<p>Data tidak ditemukan di database</p>";
      return;
    }

    const d = snap.data();
    console.log("DATA:", d);

    // ambil nama relasi
    async function getName(pid) {
      if (!pid) return "-";
      const s = await getDoc(doc(db, "anggota_keluarga", pid));
      return s.exists() ? s.data().nama : "-";
    }

    const ayah = await getName(d.ayah_id);
    const ibu = await getName(d.ibu_id);
    const pasangan = await getName(d.pasangan_id);

    // render profile
    container.innerHTML = `
      <img src="${d.foto_url || 'images/icon-512.png'}" width="150" style="border-radius:50%; margin-bottom:15px;">
      <h2>${d.nama}</h2>
      <p><strong>Ayah:</strong> ${ayah}</p>
      <p><strong>Ibu:</strong> ${ibu}</p>
      <p><strong>Pasangan:</strong> ${pasangan}</p>
    `;

  } catch (err) {
    console.error("ERROR DETAIL:", err);
    container.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
}

// =============================
// JALANKAN
// =============================
loadProfile();
