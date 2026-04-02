const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
const searchRoute = require("./routes/search");
const bookingRoute = require("./routes/booking");

app.use("/search", searchRoute);
app.use("/booking", bookingRoute);

app.get("/", (req, res) => {
  res.send("Flight Booking API Running ✈️");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});