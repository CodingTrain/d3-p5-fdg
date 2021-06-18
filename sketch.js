let data;
let nodes, links;
let simulation;
let radius = 4;

function preload() {
  data = loadJSON("yt-data.json");
}

function findSubject(mouseX, mouseY) {
  let subject = null;
  let distance = Infinity;
  for (const n of nodes) {
    let d = Math.hypot(mouseX - n.x - width / 2, mouseY - n.y - height / 2);
    if (d < distance && d < n.radius) {
      distance = d;
      subject = n;
    }
  }
  return subject;
}

// Finding a node to drag
let draggedNode = null;

function mousePressed() {
  draggedNode = findSubject(mouseX, mouseY);
  if (draggedNode) simulation.alphaTarget(0.3).restart();
}

function mouseReleased() {
  if (draggedNode) simulation.alphaTarget(0);
  draggedNode = null;
}

function startSimulation() {
  links = data.links.map((d) => {
    return Object.create(d);
  });
  nodes = data.nodes.map((d) => {
    d.radius = Number(d.views) / 100;
    return Object.create(d);
  });

  simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance((d) => d.value * 20)
        .strength((d) => d.value / 10)
    )
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX(0))
    .force("y", d3.forceY(0));

  simulation.on("tick", () => {
    render();
  });
}

let canvas;

function setup() {
  createCanvas(600, 600);

  background(0);
  startSimulation();
}

function render() {
  background(0);
  if (draggedNode) {
    draggedNode.x = mouseX - width / 2;
    draggedNode.y = mouseY - height / 2;
  }

  resetMatrix();
  translate(width / 2, height / 2);

  for (let link of links) {
    const { source, target } = link;
    stroke(240, 99, 164);
    strokeWeight(link.value);
    line(source.x, source.y, target.x, target.y);
  }

  let hover = findSubject(mouseX, mouseY);
  if (hover) {
    fill(255);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(32);
    text(hover.id, hover.x + hover.radius + 10, hover.y);
  }

  for (let node of nodes) {
    noStroke();
    fill(45, 197, 244);
    circle(node.x, node.y, node.radius * 2);
  }
}
