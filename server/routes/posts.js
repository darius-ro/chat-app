var auth = require("../middleware/auth"),
  posts = require("../models/posts");

var multer = require("multer"),
  path = require("path"),
  joi = require("joi"),
  fs = require("fs");

var express = require("express"),
  router = express.Router(),
  joi = require("joi");

router.get("/", async (req, res) => {
  // User doesnt need to be authenticated to do this
  try {
    const results = await posts.find().limit(20); // We will list about 20 by default, and hope they aren't really long

    if (results.length !== 0) {
      const ids = results.map((p) => p._id);
      await posts.updateMany({ _id: { $in: ids } }, { $inc: { views: 1 } });
    }

    return res.status(200).json({
      posts: results,
      error: false,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      posts: [],
      error: "Failed to fetch posts.",
    });
  }
});

var PostsRequestValidation = joi.object({
  content: joi.string().min(1).max(512).optional(),
  image: joi.any().optional(),
});

const uploadStorage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(
      null,
      /**
       * File name: 00000-{User_ID or Current Time}image{.png or .jpeg}
       * e.g
       * 12384-690f4f6a456dc4beeef96a0eimage.png
       */
      `${Math.floor(Math.random() * 10000)}-${_req.user ?? new Date()}${
        file.fieldname
      }${ext}`
    ); // User should be logged in, user their _id to identify uploader, if not use current date
  },
});

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 mb upload cap
  storage: uploadStorage,
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    console.log(file.mimetype);
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("You can only upload .png or .jpeg files!"));
    }
    return cb(null, true);
  },
});
router.post("/", auth.loggedIn, upload.single("image"), async (req, res) => {
  try {
    const body = req.body;
    const { error, value } = PostsRequestValidation.validate(body);

    if (error) {
      if (req.file) fs.rmSync(req.file.path); // If user uploaded file, remove it

      return res.status(400).json({
        error: error.message,
      });
    }

    new posts({
      author: req.user,
      content: value?.content || "",
      image: req.file?.filename || "",
    })
      .save()
      .then((post) => {
        return res.status(200).json(post);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          error: "A internal server error has occured.",
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "A unexpected error has occured.",
    });
  }
});

const DeletePostBodyValidation = joi.object({
  _id: joi.string().required(),
});

router.delete("/", auth.loggedIn, async (req, res) => {
  const body = req.body;
  const { error, value } = DeletePostBodyValidation.validate(body);
  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  posts
    .findOneAndDelete({ _id: value._id, author: req.user })
    .then((post) => {
      if (post) {
        if (post.image) {
          fs.rmSync("uploads/" + post.image);
        }

        return res.status(200).json({
          error: false,
        });
      } else
        return res.status(403).json({
          error: "Post doesn't exist or you don't have permission.",
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: "A internal server error has occured.",
      });
    });
});

module.exports = router;
