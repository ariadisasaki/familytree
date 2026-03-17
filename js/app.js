// =============================
// FIREBASE IMPORT
// =============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getFirestore,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// =============================
// FIREBASE CONFIG
// =============================

const firebaseConfig = {

apiKey: "AIzaSyDm1FftYv_07WDZf-IfNm_OeTkE-_7ajuU",

authDomain: "familytree-ea709.firebaseapp.com",

projectId: "familytree-ea709",

storageBucket: "familytree-ea709.firebasestorage.app",

messagingSenderId: "33038229996",

appId: "1:33038229996:web:1a9dad0f9c73877b97a0c9"

};


// =============================
// INIT FIREBASE
// =============================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// =============================
// LOAD DATA
// =============================

async function loadData(){

const querySnapshot = await getDocs(collection(db,"anggota_keluarga"));

let members = [];

querySnapshot.forEach(doc=>{

members.push({

id: doc.id,

...doc.data()

});

});

buildTree(members);

}


// =============================
// BUILD TREE STRUCTURE
// =============================
function buildTree(data){
  let map = {};

  // buat node
  data.forEach(person=>{
    map[person.id] = {
      name: person.nama,
      spouse: person.pasangan || null, // simpan pasangan
      children: []
    };
  });

  // hubungkan anak ke ayah
  data.forEach(person=>{
    if(person.ayah_id && map[person.ayah_id]){
      map[person.ayah_id].children.push(map[person.id]);
    }
  });

  // buat virtual root
  let roots = data.filter(p => !p.ayah_id).map(p => map[p.id]);
  let root = (roots.length === 1) ? roots[0] : {name:"Keluarga", children: roots};

  drawTree(root);
}

// =============================
// DRAW TREE WITH D3
// =============================
function drawTree(treeData){

const width = 1000;

const height = 600;

const svg = d3.select("#tree")

.append("svg")

.attr("width",width)

.attr("height",height)

.append("g")

.attr("transform","translate(40,0)");


const root = d3.hierarchy(treeData);

const treeLayout = d3.tree().size([height-100,width-200]);

treeLayout(root);


// LINES

svg.selectAll("line")

.data(root.links())

.enter()

.append("line")

.attr("x1",d=>d.source.y)

.attr("y1",d=>d.source.x)

.attr("x2",d=>d.target.y)

.attr("y2",d=>d.target.x);


// NODES

const nodes = svg.selectAll("g")

.data(root.descendants())

.enter()

.append("g")

.attr("transform",d=>`translate(${d.y},${d.x})`);


// CIRCLE

nodes.append("circle")

.attr("r",20);


// TEXT

nodes.append("text")
  .attr("dy", 4)
  .attr("x", -10)
  .text(d => d.data.spouse ? d.data.name + " + " + d.data.spouse : d.data.name);


// =============================
// START APP
// =============================

loadData();
