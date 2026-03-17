import { db }

from "./firebase.js"

import {

doc,
setDoc

}

from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"

document.getElementById("form").addEventListener("submit", async e=>{

e.preventDefault()

let nama=document.getElementById("nama").value
let ayah=document.getElementById("ayah").value
let ibu=document.getElementById("ibu").value
let pasangan=document.getElementById("pasangan").value
let lahir=document.getElementById("lahir").value

let file=document.getElementById("foto").files[0]

let foto_url=""

if(file){

const formData=new FormData()

formData.append("file",file)
formData.append("upload_preset","family_tree_upload")

const res=await fetch(
"https://api.cloudinary.com/v1_1/dul7ms9co/image/upload",
{
method:"POST",
body:formData
})

const data=await res.json()

foto_url=data.secure_url

}

await setDoc(doc(db,"anggota_keluarga",nama.toLowerCase()),{

nama:nama,
ayah_id:ayah,
ibu_id:ibu,
pasangan_id:pasangan,
tanggal_lahir:lahir,
foto_url:foto_url

})

alert("Data berhasil disimpan")

})
