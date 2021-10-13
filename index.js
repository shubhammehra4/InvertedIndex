process.on("uncaughtException", (err) => {
  console.log("Encountered uncaughtException", { err });
});
process.on("unhandledRejection", (err) => {
  console.log("Encountered unhandledRejection", { err });
});

const express = require("express");
const cors = require("cors");
const container = require("./di/index");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Health Check OK!!");
});

app.post("/getData", (req, res) => {
  return container.resolve("getData").handleRequest(req, res);
});

app.use((_req, res) => {
  res.status(404).send({ err: "No such handler" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
