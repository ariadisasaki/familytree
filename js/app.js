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
// BUILD TREE (PASANGAN SYSTEM)
// =============================
function buildTree(data){

  let people = {};

  // =========================
  // 1. BUAT NODE ORANG (SATU SAJA!)
  // =========================
  data.forEach(p => {
    people[p.id] = {
      id: p.id,
      name: p.nama,
      children: []
    };
  });

  // =========================
  // 2. LOOP ANAK → PASTIKAN MASUK KE TREE
  // =========================
  data.forEach(p => {

    if(p.ayah_id){

      let ayahNode = people[p.ayah_id];
      if(!ayahNode) return;

      // =====================
      // CARI / BUAT PASANGAN
      // =====================
      let pasanganNode = null;

      if(p.ibu_id){
        pasanganNode = ayahNode.children.find(c => 
          c.type === "pasangan" && c.ibu_id === p.ibu_id
        );

        if(!pasanganNode){

          let ibuName = people[p.ibu_id]?.name || "?";

          pasanganNode = {
            type: "pasangan",
            ibu_id: p.ibu_id,
            name: ayahNode.name + " + " + ibuName,
            children: []
          };

          ayahNode.children.push(pasanganNode);
        }
      }

      // =====================
      // MASUKKAN ANAK
      // =====================
      let targetParent = pasanganNode || ayahNode;

      targetParent.children.push({
        id: p.id,
        name: p.nama
      });
    }
  });

  // =========================
  // 3. ROOT (ORANG TANPA ORANG TUA)
  // =========================
  let root = {
    name: "Keluarga",
    children: []
  };

  data.forEach(p => {
    if(!p.ayah_id && !p.ibu_id){
      root.children.push(people[p.id]);
    }
  });

  // fallback
  if(root.children.length === 0){
    root.children = Object.values(people);
  }

  console.log("TREE:", JSON.stringify(root, null, 2));

  drawTree(root);
}

// =============================
// DRAW TREE WITH D3 (VERTICAL)
// =============================
function drawTree(treeData){
  const width = 1000;
  const height = 600;
  d3.select("#tree").html(""); // reset biar tidak dobel
  const svg = d3.select("#tree")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(50,50)");
  const root = d3.hierarchy(treeData);
  const treeLayout = d3.tree().size([width-100, height-100]);
  treeLayout(root);
  // =============================
  // LINES
  // =============================
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
  // =============================
  // NODES
  // =============================
  const nodes = svg.selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .style("cursor", "pointer")
    .on("click", (event, d) => {
      if (d.data.id) {
        window.location.href = `profile.html?id=${d.data.id}`;
      }
    });
  nodes.append("circle")
    .attr("r",20)
    .attr("fill","#2c7a7b");
  nodes.append("text")
    .attr("dy", 4)
    .attr("x", -10)
    .text(d => d.data.name);
}
// =============================
// START APP
// =============================
loadData();
