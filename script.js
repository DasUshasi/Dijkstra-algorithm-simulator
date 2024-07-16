/*
 test inputs
 numNodes = 9
 edges = 0-1-4,1-2-8,1-7-11,0-7-8,7-8-7,7-6-1,8-6-6,2-8-2,6-5-2,2-5-4,2-3-7,3-5-14,3-4-9,5-4-10
 src = 0
*/

var graphEdges = []
var vertices = []
var n
var src

const width = 600
const height = 400

let graphElem = document.getElementById('graph')
let distDiv = document.getElementById('dists')
let createNodeButton = document.getElementById('createNode')
let createLinesButton = document.getElementById('createLines')
let runButton = document.getElementById('run')
let doneButton = document.getElementById('done')

createNodeButton.addEventListener('click', createNodes)
createLinesButton.addEventListener('click', drawLines)
runButton.addEventListener('click', run)
doneButton.addEventListener('click', graphInput)

function graphInput() {
    n = document.getElementById('numNodes').value
    graphEdges = document.getElementById('edges').value.split(',').map(edge => edge.trim());
    src = document.getElementById('src').value

    let inpDiv = document.getElementById('input')

    let texts = document.getElementsByClassName('text')
    while (texts.length > 0) 
        inpDiv.removeChild(texts[0])

    inpDiv.removeChild(document.getElementById('numNodes'))
    inpDiv.removeChild(document.getElementById('edges'))
    inpDiv.removeChild(document.getElementById('src'))

    let brs = document.getElementsByClassName('rem')
    while (brs.length > 0) 
        inpDiv.removeChild(brs[0])

    inpDiv.removeChild(doneButton)
}

function createNodes() {
    for (let i = 0; i < n; i++) {
        let value = i
        let x = Math.random() * width
        let y = Math.random() * height
        let dict = { value: value, x: x, y: y }
        vertices.push(dict)
    }

    alert("Move the nodes to your desired position before crating the edges!")

    for (let i = 0; i < vertices.length; i++) {
        node = vertices[i]

        value = node.value
        x = node.x
        y = node.y

        let nodeElem = document.createElement('div')
        nodeElem.id = value + "node"
        nodeElem.className = "node"
        nodeElem.style.left = x + "px"
        nodeElem.style.top = y + "px"
        nodeElem.textContent = value

        let offsetX, offsetY, isDragging = false;

        nodeElem.addEventListener('mousedown', (event) => {
            offsetX = event.clientX - nodeElem.getBoundingClientRect().left;
            offsetY = event.clientY - nodeElem.getBoundingClientRect().top;
            isDragging = true;
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const x = event.clientX - offsetX;
                const y = event.clientY - offsetY;
                nodeElem.style.left = x + "px"
                nodeElem.style.top = y + "px"
                vertices[i].x = x
                vertices[i].y = y
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        graphElem.appendChild(nodeElem)
    }
    createNodeButton.disabled = true
}

function updateLine(i, j, val) {
    const x1 = vertices[i].x + 25;
    const y1 = vertices[i].y + 25;
    const x2 = vertices[j].x + 25;
    const y2 = vertices[j].y + 25;

    const line = document.createElement('div');
    line.className = 'line';
    line.id = i + "" + j
    graphElem.appendChild(line);

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;

    const textX = (x1 + x2) / 2;
    const textY = (y1 + y2) / 2;

    let txt = document.createElement('div')
    txt.className = 'edgeWt'

    txt.innerText = val
    txt.style.left = `${textX}px`;
    txt.style.top = `${textY}px`;
    graphElem.appendChild(txt)
}

function drawLines() {
    for (let i = 0; i < graphEdges.length; i++) {
        var edge = graphEdges[i].split('-')
        updateLine(edge[0], edge[1], edge[2])
    }

    let nodes = document.getElementsByClassName('node')
    for (let index = 0; index < nodes.length; index++) {
        const element = nodes[index];
        element.style.backgroundColor = 'pink'
    }

    createLinesButton.disabled = true
}

const INF = 2147483647;

class Graph {

    constructor() {
        this.adj = new Array();
        for (let i = 0; i < n; i++)
            this.adj[i] = new Array();
    }

    addEdge(u, v, w) {
        this.adj[u].push([v, w]);
        this.adj[v].push([u, w]);
    }

    // final = green
    // visited = yellow
    // current = red

    async shortestPath(src) {
        let pq = [];
        let dist = new Array(vertices.length).fill(INF);
        pq.push([0, src]);  // distance, node
        dist[src] = 0;
        let visited = []

        for (let i = 0; i < vertices.length; i++) {
            const x = vertices[i].x + 40;
            const y = vertices[i].y + 40;
            let distNode = document.createElement('div')
            distNode.className = 'dist'
            distNode.id = i
            distNode.style.left = x + 'px'
            distNode.style.top = y + 'px'
            if (dist[i] === INF)
                distNode.textContent = 'dist = ∞'
            else
                distNode.textContent = 'dist = ' + dist[i]
            graphElem.appendChild(distNode)

            let div = document.createElement('div')
            div.className = 'distDivs'

            if (dist[i] === INF)
                div.textContent = src + " to " + i + " distance = ∞"
            else
                div.textContent = src + " to " + i + " distance = " + dist[i]
            div.id = i + 'dist'
            distDiv.appendChild(div)
        }

        await wait(5)

        document.getElementById(src + 'node').style.backgroundColor = 'yellow'
        await wait(3)

        while (pq.length > 0) {
            let u = pq[0][1];
            pq.shift();
            if (visited.indexOf(u) === -1) {
                document.getElementById(u + 'node').style.backgroundColor = 'red'
                await wait(2)

                for (let i = 0; i < this.adj[u].length; i++) {
                    let v = this.adj[u][i][0];
                    let weight = this.adj[u][i][1];
                    let edge = document.getElementById(u + "" + v) || document.getElementById(v + "" + u)
                    if (dist[v] > dist[u] + weight) {
                        document.getElementById(v + 'node').style.backgroundColor = 'yellow'
                        edge.style.backgroundColor = 'blue'
                        dist[v] = dist[u] + weight;
                        document.getElementById(v).textContent = 'dist = ' + dist[v]
                        document.getElementById(v + 'dist').textContent = src + " to " + v + " distance = " + dist[v]
                        pq.push([dist[v], v]);
                        pq.sort((a, b) => {
                            if (a[0] == b[0]) return a[1] - b[1];
                            return a[0] - b[0];
                        });
                        await wait(3)
                        edge.style.backgroundColor = 'red'
                        document.getElementById(v + 'node').style.backgroundColor = 'pink'
                    }
                }
                document.getElementById(u + 'node').style.backgroundColor = 'green'
                visited.push(u)
                await wait(3)
            }
        }
        return true
    }
}


async function run() {
    runButton.disabled = true
    await wait(2)
    let g = new Graph();

    for (let i = 0; i < graphEdges.length; i++) {
        var edge = graphEdges[i].split('-')
        g.addEdge(Number(edge[0]), Number(edge[1]), Number(edge[2]))
    }

    console.log(g.adj);

    let dists = document.getElementsByClassName('dist')
    while (dists.length > 0)
        graphElem.removeChild(dists[0])

    let distDivs = document.getElementsByClassName('distDivs')
    while (distDivs.length > 0)
        distDiv.removeChild(distDivs[0])

    let nodes = document.getElementsByClassName('node')
    for (let i = 0; i < nodes.length; i++)
        nodes[i].style.backgroundColor = 'pink'

    await g.shortestPath(src)

    runButton.disabled = false
}

function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
