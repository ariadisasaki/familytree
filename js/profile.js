import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const nameParam = params.get("nama"); // ganti id → nama agar lebih fleksibel

if (!nameParam) {
  document.getElementById("profile").innerHTML = "<p>Nama anggota tidak ditemukan di URL</p>";
}

// Fungsi ambil nama lengkap dari ID
async function getNameById(personId) {
  if (!personId) return "-";
  const docRef = collection(db, "anggota_keluarga");
  const q = query(docRef, where("__name__", "==", personId));
  const snap = await getDocs(q);
  if (snap.empty) return "-";
  return snap.docs[0].data().nama;
}

async function loadProfile() {
  try {
    // Cari document berdasarkan field nama
    const q = query(collection(db, "anggota_keluarga"), where("nama", "==", nameParam));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      document.getElementById("profile").innerHTML = "<p>Data anggota tidak ditemukan</p>";
      return;
    }

    const docSnap = querySnapshot.docs[0];
    const d = docSnap.data();

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
