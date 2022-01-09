const express = require("express");
const cors = require("cors");
const container = require("./di/index");

process.on("uncaughtException", (err) => {
  console.log("Encountered uncaughtException", { err });
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log("Encountered unhandledRejection", { err });
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Health Check OK!!");
});

app.get("/getBooks", (req, res) => {
  return container.resolve("getBooks").handleSearchRequest(req, res);
});

app.get("/searchSuggestions", (req, res) => {
  return container.resolve("getBooks").handleSuggestionsRequest(req, res);
});

app.use((_req, res) => {
  res.status(404).send({ err: "No such handler" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
