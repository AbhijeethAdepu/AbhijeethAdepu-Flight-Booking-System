function buildGraph(flights, mode) {
  const graph = {};

  flights.forEach(f => {
    const weight = mode === "fastest" ? f.duration : f.price;

    if (!graph[f.source]) graph[f.source] = [];
    if (!graph[f.destination]) graph[f.destination] = [];

    graph[f.source].push({ node: f.destination, weight });
    graph[f.destination].push({ node: f.source, weight });
  });

  return graph;
}

function dijkstra(graph, start) {
  const distances = {};
  const visited = {};
  const previous = {};

  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
  });

  distances[start] = 0;

  while (true) {
    let closest = null;

    for (let node in distances) {
      if (!visited[node] && (closest === null || distances[node] < distances[closest])) {
        closest = node;
      }
    }

    if (closest === null) break;

    visited[closest] = true;

    if (!graph[closest]) continue;

    graph[closest].forEach(neighbor => {
      let newDist = distances[closest] + neighbor.weight;

      if (newDist < distances[neighbor.node]) {
        distances[neighbor.node] = newDist;
        previous[neighbor.node] = closest;
      }
    });
  }

  return { distances, previous };
}

function getPath(previous, start, end) {
  const path = [];
  let current = end;

  while (current !== start) {
    path.unshift(current);
    current = previous[current];
    if (!current) return null;
  }

  path.unshift(start);
  return path;
}

module.exports = { buildGraph, dijkstra, getPath };
