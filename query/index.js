const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");
const cors = require("cors");
const { default: Axios } = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res, next) => {
  res.send(posts);
});

app.post("/events", async (req, res, next) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({
    message: "Received Noted",
  });
});

app.listen(4002, async () => {
  console.log("Listening on port 4002");

  const res = await axios.get("http://events-srv:4005/events");

  for (let event of res.data) {
    const { type, data } = event;
    console.log("processing event: ", type);

    handleEvent(type, data);
  }
});
