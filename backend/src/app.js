const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Distributed Cinema Reservation System",
    database: "Apache Cassandra",
    status: "Backend is running"
  });
});

app.use("/api", reservationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

module.exports = app;