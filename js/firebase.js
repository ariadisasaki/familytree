import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"

const firebaseConfig = {

apiKey:"AIzaSyDm1FftYv_07WDZf-IfNm_OeTkE-_7ajuU",
authDomain:"familytree-ea709.firebaseapp.com",
projectId:"familytree-ea709",
storageBucket:"familytree-ea709.firebasestorage.app",
messagingSenderId:"33038229996",
appId:"1:33038229996:web:1a9dad0f9c73877b97a0c9"

}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
