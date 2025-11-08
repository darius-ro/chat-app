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
    const authHeader = req.headers.authorization;
    if(!authHeader){
        req.user = null;
        return next();
    }

    const [scheme, token] = authHeader.split(" ")

    if (scheme != 'Bearer' || !token) {
        req.user = null;
        return next();
    }

    try {   
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded._id
    } catch (err) {
        req.user = null;
    }

    return next();
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
exports.loggedIn = async (req, res, next) => {
    if (!req.user) return res.status(403).json({
        error: "You are not authenticated for this request.1"
    })

    try {
        const user = await users.findOne({ _id: req.user })

        if (!user) return res.status(403).json({
            error: "You are not authenticated for this request.2"
        })

        req.userData = user;
        req.logged = true;
        return next();
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "Failed to complete request to database. Try again later!"
        })
    }
    
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
exports.loggedOut = async (req, res, next) => { // Assuming the token was valid and the user wasnt poofed out the db
    if (req.user) return res.status(403).json({
        error: "You can't be authenticated to do this request."
    })
    else return next();
}