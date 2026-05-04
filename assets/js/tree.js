let svg, g, zoom;

function renderTree(data) {
    const width = document.getElementById('tree-canvas').clientWidth;
    const height = 700;

    // Bersihkan canvas sebelum menggambar ulang
    d3.select("#tree-canvas").select("svg").remove();

    svg = d3.select("#tree-canvas").append("svg")
        .attr("width", width)
        .attr("height", height);

    g = svg.append("g");

    // Fitur Zoom & Pan
    zoom = d3.zoom().on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom);

    const treeLayout = d3.tree().nodeSize([200, 150]);
    const root = d3.hierarchy(data);
    treeLayout(root);

    // Gambar Garis Penghubung
    g.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 2)
        .attr("d", d3.linkVertical().x(d => d.x).y(d => d.y));

    // Gambar Node (Kotak Anggota)
    const node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // EDIT DI SINI: Desain Kotak Nama
    node.append("rect")
        .attr("x", -70)
        .attr("y", -25)
        .attr("width", 140)
        .attr("height", 50)
        .attr("rx", 10)
        .attr("fill", d => d.data.gender === "L" ? "#e0e7ff" : "#fdf2f8")
        .attr("stroke", d => d.data.gender === "L" ? "#4f46e5" : "#db2777");

    node.append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .attr("class", "text-[12px] font-semibold fill-slate-800")
        .text(d => d.data.name.length > 15 ? d.data.name.substring(0, 15) + ".." : d.data.name);

    // Pusatkan pandangan pertama kali
    resetZoom();
}

function resetZoom() {
    const width = document.getElementById('tree-canvas').clientWidth;
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, 100).scale(0.8)
    );
}
