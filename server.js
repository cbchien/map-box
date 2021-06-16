const express = require("express");
const path = require("path");
const http = require("http");

require("dotenv").config();

const app = express();
const port = process.env.PORT || process.env.REACT_APP_PORT || 3000;

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));
