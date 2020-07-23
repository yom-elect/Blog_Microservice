const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res, next) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://events-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }

  //   axios.post("http://localhost:4000/events", event);
  //   axios.post("http://localhost:4001/events", event);

  res.send({ status: "Ok" });
});

app.listen(4003, () => {
  console.log("Listening on port 4003");
});
