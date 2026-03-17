export function renderTree(data){

const root = d3.stratify()
.id(d=>d.id)
.parentId(d=>d.ayah_id || null)(data)

const treeLayout = d3.tree().size([600,400])

treeLayout(root)

const svg = d3.select("#tree")
.append("svg")
.attr("width",900)
.attr("height",600)

svg.selectAll("line")
.data(root.links())
.enter()
.append("line")
.attr("x1",d=>d.source.x)
.attr("y1",d=>d.source.y)
.attr("x2",d=>d.target.x)
.attr("y2",d=>d.target.y)

svg.selectAll("circle")
.data(root.descendants())
.enter()
.append("circle")
.attr("cx",d=>d.x)
.attr("cy",d=>d.y)
.attr("r",20)
.on("click",(event,d)=>{

window.location="profile.html?id="+d.id

})

svg.selectAll("text")
.data(root.descendants())
.enter()
.append("text")
.attr("x",d=>d.x)
.attr("y",d=>d.y-25)
.attr("text-anchor","middle")
.text(d=>d.data.nama)

}
