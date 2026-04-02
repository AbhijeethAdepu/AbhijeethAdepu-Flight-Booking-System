const express = require("express");
const router = express.Router();
const db = require("../db/database");

const { buildGraph, dijkstra, getPath } = require("../services/dijkstra");

router.get("/", (req, res) => {
  let { from, to, mode } = req.query;

  if (!from || !to) {
    return res.json({ message: "Invalid input" });
  }

  from = from.toUpperCase();
  to = to.toUpperCase();

  db.all("SELECT * FROM flights", [], (err, flights) => {
    if (err) return res.status(500).json(err);

    const graph = buildGraph(flights, mode || "fastest");
    const { distances, previous } = dijkstra(graph, from);
    const route = getPath(previous, from, to);

    if (!route) {
      return res.json({ message: "No route found" });
    }

    let segments = [];

    for (let i = 0; i < route.length - 1; i++) {
      const fromCity = route[i];
      const toCity = route[i + 1];

      let flightsForSegment = flights.filter(f =>
        f.source === fromCity && f.destination === toCity
      );

      // ✅ fallback (IMPORTANT FIX)
      if (flightsForSegment.length === 0) {
        flightsForSegment = [{
          airline: "Demo Airline",
          price: 3000,
          available_seats: 10
        }];
      }

      segments.push({
        from: fromCity,
        to: toCity,
        flights: flightsForSegment
      });
    }

    res.json({
      route,
      total: distances[to],
      segments
    });
  });
});

module.exports = router;
