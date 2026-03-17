import { db } from "./firebase.js"

import { collection, getDocs }

from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"

import { renderTree } from "./tree.js"

async function load(){

const querySnapshot = await getDocs(collection(db,"anggota_keluarga"))

let data=[]

querySnapshot.forEach(doc=>{

let d=doc.data()

d.id=doc.id

data.push(d)

})

renderTree(data)

}

load()
