var jwt = require("jsonwebtoken");
var users = require("../models/users");

const JWT_SECRET = process.env.JWT_SECRET || "please dont leave it as default";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
exports.auth = (req, res, next) => {
    if (req.cookies["auth"]) {
        const token = res.cookie["auth"];
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) res.clearCookie("auth") // Remove auth cookie if token is invalid/expired
            else res.user = decoded._id; // Add user to res if the token has no errors
            return next();
        });
    } else { // User has no auth cookie, not logged in.
        res.user = false;
        return next();
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
exports.loggedIn = async (req, res, next) => {
    if (res.user) {
        users.findOne({ _id: res.user })
            .then((user) => {
                if (!user) return res.status(403).json({
                    error: "You are not authenticated for this request."
                })
                res.userData = user;
                res.logged = true;
                return next();
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).json({
                    error: "Failed to complete request to database. Try again later!"
                })
            })
    } else return res.status(403).json({
        error: "You are not authenticated for this request."
    })
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
exports.loggedOut = async (req, res, next) => { // Assuming the token was valid and the user wasnt poofed out the db
    if (res.user) return res.status(403).json({
        error: "You can't be authenticated to do this request."
    })
    else return next();
}