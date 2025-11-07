require("dotenv").config({ quiet: true });

const PORT = process.env.PORT || 3000;
const MONGOOSE = process.env.MONGO_URI || "mongodb://localhost:27017"

var express = require("express"),
    app = express(),
    compression = require("compression"),
    cookies = require("cookie-parser");

var mongoose = require("mongoose"), // Database
    joi = require("joi"); // Validation


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err, "Failed to connect to MongoDB"));

app.use(express.json({ limit: "1kb" }));
app.use(compression());
app.use(cookies())

app.use((req, res, next) => {
    if (!res.headersSent)
        return res.status(404).json({
            error: "🤖 Hmm, this page wasn't found."
        })
})

app.use((err, req, res, next) => {
    if (err) {
        console.log(err);
        return res.status(500).json({
            error: "Oops, a error on the server has occured. Try again later!"
        })
    }
})