var express = require("express"),
    router = express.Router();

var bcrypt = require("bcrypt");
var joi = require("joi");
var jwt = require("jsonwebtoken");

var users = require("../models/users");

var auth = require("../middleware/auth");

const BCRYPT_SALT_ROUNDS = 10; // Amount of salt rounds to use for bcrypt, change to your liking
const JWT_SECRET = process.env.JWT_SECRET || "please dont leave it as default";

function createToken(user) { // If needed to add other attributes, less to change
    if (!user._id) return;
    return jwt.sign({
        id: user._id
    }, JWT_SECRET, {
        expiresIn: "1d"
    });
}

router.get("/", auth.loggedIn, (req, res) => { // Return valid response if logged in
    return res.status(200).json({
        username: res.userData.username // Given by the auth loggedIn middleware
    })
}) 

var loginBodySchema = joi.object({
    email: joi.string().email().max(70).required(),
    password: joi.string().min(8).max(128)
});

router.post("/login", auth.loggedOut, async (req, res) => { // Authenticate the user (email + password)
    try {
        const {error, value} = loginBodySchema.validate(req.body);

        if (error) 
            return res.status(400).json({
                error: error.message
            });
        
        const user = await users.findOne({ email: value.email })
        if (!user) return res.status(403).json({
            error: "Email or password was invalid."
        })
        
        const valid = await bcrypt.compare(value.password, user.password)
        if (!valid) return res.status(403).json({
            error: "Email or password was invalid."
        })

        const token = createToken(user)
        res.cookie("auth", token);
        return res.status(200).json({
            error: false,
            id: user._id
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "A unexpected error has occured."
        })
    }
})

var registerBodySchema = joi.object({
    username: joi.string().min(3).max(30).alphanum().required(),
    email: joi.string().email().max(70).required(),
    password: joi.string().min(8).max(128)
});

router.post("/register", auth.loggedOut, async (req, res) => { // Create the user
    try {
        const {error, value} = registerBodySchema.validate(req.body);

        if (error) 
            return res.status(400).json({
                error: error.message
            });

        const results = await users.find({ $or: [ { username: value.username }, { email: value.email } ] })
        
        if (results && results.length > 1) 
            return res.status(409).json({
                error: "Username or email already used."
            });
        

        const salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS);
        const hash = bcrypt.hashSync(value.password, salt);

        new users({
            username: value.username,
            email: value.email,
            password: hash
        })
            .save()
            .then((user) => {
                const token = createToken(user);
                res.cookie('auth', token);
                return res.status(200).json({
                    error: false,
                    id: user._id
                })
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    error: "Failed saving user to database"
                })
            })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "A unexpected error has occured."
        })
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("auth");
    res.status(200).json({
        error: false,
    });
})

module.exports = router;