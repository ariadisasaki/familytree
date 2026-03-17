// =============================
// FIREBASE IMPORT
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
async function loadData() {
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
// BUILD TREE
// =============================
function buildTree(data){

  let map = {};

  // bantu cari nama berdasarkan id
  function getNameById(id){
    const found = data.find(p => p.id === id);
    return found ? found.nama : "?";
  }

  // buat node
  data.forEach(person=>{
    let pasanganNama = "";

    if(person.pasangan_id){
      pasanganNama = getNameById(person.pasangan_id);
    }

    map[person.id] = {
      id: person.id,
      name: pasanganNama 
        ? person.nama + " + " + pasanganNama
        : person.nama,
      children: []
    };
  });

  // hubungkan anak ke ayah
  data.forEach(person=>{
    if(person.ayah_id && map[person.ayah_id]){
      map[person.ayah_id].children.push(map[person.id]);
    }
  });

  // root
  let root = { name:"Keluarga", children: [] };

  data.forEach(person=>{
    if(!person.ayah_id){
      root.children.push(map[person.id]);
    }
  });

  drawTree(root);
}

// =============================
// DRAW TREE WITH D3 (VERTICAL)
// =============================
function drawTree(treeData){
  const width = 1000;
  const height = 600;

  const svg = d3.select("#tree")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(50,50)");

  const root = d3.hierarchy(treeData);
  const treeLayout = d3.tree().size([width-100, height-100]);
  treeLayout(root);

  // LINES
  svg.selectAll("line")
    .data(root.links())
    .enter()
    .append("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .attr("stroke", "#888")
    .attr("stroke-width", 2);

  // NODES
  const nodes = svg.selectAll("g")
  .data(root.descendants())
  .enter()
  .append("g")
  .attr("transform", d => `translate(${d.x},${d.y})`)
  .style("cursor", "pointer")
  .on("click", (event, d) => {
    console.log("CLICK:", d);

    if (d.data.id) {
      window.location.href = `profile.html?id=${d.data.id}`;
    } else {
      alert("ID tidak ada di node");
    }
  });

  nodes.append("circle")
    .attr("r",20)
    .attr("fill","#2c7a7b");

  // TEXT + klik untuk profile
  nodes.append("text")
  .attr("dy", 4)
  .attr("x", -10)
  .style("cursor", "pointer")
  .text(d => d.data.name)
  .on("click", (event, d) => {
    console.log("DATA NODE:", d); // debug

    if (d.data.id) {
      window.location.href = `profile.html?id=${d.data.id}`;
    } else {
      alert("ID tidak ditemukan di node");
    }
  });
}

// =============================
// START APP
// =============================
loadData();
