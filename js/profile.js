import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.getElementById("profile").innerHTML = "<p>ID anggota tidak ditemukan di URL</p>";
}

async function loadProfile() {
  try {
    const ref = doc(db, "anggota_keluarga", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      document.getElementById("profile").innerHTML = "<p>Data anggota tidak ditemukan</p>";
      return;
    }

    const d = snap.data();

    // Ambil nama ayah, ibu, pasangan dari Firestore jika ID tersedia
    async function getNameById(personId) {
      if (!personId) return "-";
      const docRef = doc(db, "anggota_keluarga", personId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data().nama : "-";
    }

    const ayahName = await getNameById(d.ayah_id);
    const ibuName = await getNameById(d.ibu_id);
    const pasanganName = await getNameById(d.pasangan_id);

    document.getElementById("profile").innerHTML = `
      <img src="${d.foto_url || 'images/icon-512.png'}" width="150" style="border-radius:50%; margin-bottom:20px;">
      <h2>${d.nama}</h2>
      <p><strong>Ayah:</strong> ${ayahName}</p>
      <p><strong>Ibu:</strong> ${ibuName}</p>
      <p><strong>Pasangan:</strong> ${pasanganName}</p>
    `;

  } catch (err) {
    console.error("Gagal load profile:", err);
    document.getElementById("profile").innerHTML = "<p>Terjadi kesalahan saat memuat data</p>";
  }
}

loadProfile();
