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
  appId: "1:33038229996:web:1a9dad0f9c73877a0c9"
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
  const querySnapshot = await getDocs(collection(db, "anggota_keluarga"));
  let members = [];
  querySnapshot.forEach(doc => {
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
function buildTree(data) {
  let persons = {};
  let couples = {};

  // Simpan semua orang
  data.forEach(p => {
    persons[p.id] = {
      id: p.id,
      name: p.nama,
      ayah: p.ayah_id || null,
      ibu: p.ibu_id || null
    };
  });

  // Buat node pasangan + hubungkan anak
  data.forEach(p => {
    // Jika anak punya ayah dan ibu
    if (p.ayah_id && p.ibu_id) {
      let key = p.ayah_id + "_" + p.ibu_id;
      if (!couples[key]) {
        couples[key] = {
          name: persons[p.ayah_id].name + " + " + persons[p.ibu_id].name,
          children: []
        };
      }
      couples[key].children.push({ name: p.nama, children: [] });
    } 
    // Jika anak hanya punya ayah
    else if (p.ayah_id) {
      let key = p.ayah_id;
      if (!couples[key]) {
        couples[key] = {
          name: persons[p.ayah_id].name,
          children: []
        };
      }
      couples[key].children.push({ name: p.nama, children: [] });
    }
    // Jika anak hanya punya ibu
    else if (p.ibu_id) {
      let key = p.ibu_id;
      if (!couples[key]) {
        couples[key] = {
          name: persons[p.ibu_id].name,
          children: []
        };
      }
      couples[key].children.push({ name: p.nama, children: [] });
    }
  });

  // Root virtual "Keluarga"
  let root = { name: "Keluarga", children: [] };
  Object.values(couples).forEach(c => root.children.push(c));

  drawTree(root);
}

// =============================
// DRAW TREE VERTIKAL
// =============================
function drawTree(treeData) {
  const width = 800;
  const height = 600;

  const svg = d3.select("#tree")
    .html("") // clear tree sebelum menggambar
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(50,20)");

  const root = d3.hierarchy(treeData);

  const treeLayout = d3.tree().size([width - 100, height - 100]);
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
    .attr("transform", d => `translate(${d.x},${d.y})`);

  // CIRCLE
  nodes.append("circle")
    .attr("r", 20)
    .attr("fill", "#2c7a7b");

  // TEXT
  nodes.append("text")
    .attr("dy", 5)
    .attr("x", -15)
    .attr("font-size", "12px")
    .attr("fill", "#fff")
    .text(d => d.data.name);
}

// =============================
// START APP
// =============================
loadData();
