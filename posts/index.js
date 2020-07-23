const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

app.post("/posts/create", async (req, res, next) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };

  await axios.post("http://events-srv:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", async (req, res, next) => {
  console.log("Received event", req.body.type);

  res.send({
    message: "Received Noted",
  });
});

app.listen(4000, () => {
  console.log("waiting for pods");
  console.log("Listening on port 4000");
});
