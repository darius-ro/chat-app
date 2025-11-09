const multer = require("multer");
const auth = require("../middleware/auth");
const posts = require("../models/posts");

var express = require("express"),
    router = express.Router();

router.get("/", async (req, res) => { // User doesnt need to be authenticated to do this
    try {
        const result = await posts.find().limit(20) // We will list about 20 by default, and hope they aren't really long
        return res.status(200).json({
            posts: result,
            error: false
        })
    } catch (err) {
        return res.status(500).json({
            posts: [],
            error: "Failed to fetch posts."
        })
    }
})


/**
 * req.body = { // expectation
 *  content: "your message here",
 * 
 * }
*/
const upload = multer({
    dest: "uploads/",
    size: 10000, // 10,000 bytes is roughly around 10 mb
})
router.post("/", auth.loggedIn, upload("image"), async (req, res) => {

})

module.exports = router;