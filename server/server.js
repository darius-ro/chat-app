require("dotenv").config({ quiet: true });

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

var express = require("express"),
  app = express(),
  compression = require("compression"),
  cookies = require("cookie-parser"),
  cors = require("cors");

var mongoose = require("mongoose"), // Database
  joi = require("joi"); // Validation

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err, "Failed to connect to MongoDB"));

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "1kb" }));
app.use(compression());
app.use(require("./middleware/auth").auth); // Authentication handler
app.use("/auth", require("./routes/auth")); // Add auth routes to express
app.use("/posts", require("./routes/posts")); // Add posts routes to express
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  if (!res.headersSent)
    return res.status(404).json({
      error: "🤖 Hmm, this page wasn't found.",
    });
});

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    return res.status(500).json({
      error: "Oops, a error on the server has occured. Try again later!",
    });
  }
});
