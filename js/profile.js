import { db }

from "./firebase.js"

import { doc, getDoc }

from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"

const params = new URLSearchParams(window.location.search)

const id = params.get("id")

async function load(){

const ref = doc(db,"anggota_keluarga",id)

const snap = await getDoc(ref)

const d = snap.data()

document.getElementById("profile").innerHTML=

`
<img src="${d.foto_url || ''}" width="150">

<h2>${d.nama}</h2>

<p>Ayah : ${d.ayah_id || '-'}</p>

<p>Ibu : ${d.ibu_id || '-'}</p>

<p>Pasangan : ${d.pasangan_id || '-'}</p>

`

}

load()
