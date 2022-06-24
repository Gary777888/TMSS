//This file is to check whether the account user is authorize from specific role
const jwt = require("jsonwebtoken")
const config = require("../config/auth.config.js")
const db = require("../models")
const User = db.user

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    })
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      })
    }
    req.username = decoded.username
    next()
  })
}

isAdmin = (req, res, next) => {
  User.findByPk(req.username).then((user) => {
    /* something */

    if (user.usergroup.includes("admin")) {
      next()
      return
    } else {
      res.status(403).send({
        message: "Require Admin Role!",
      })
      return
    }

    // user.getAdmingroup().then((usergroup) => {
    //   for (let i = 0; i < usergroup.length; i++) {
    //     if (usergroup[i].name === "admin") {
    //       next()
    //       return
    //     }
    //   }
    //   res.status(403).send({
    //     message: "Require Admin Role!",
    //   })
    return
    // })
  })
}
isUser = (req, res, next) => {
  User.findByPk(req.username).then((user) => {
    // something

    if (user.usergroup.includes("user")) {
      next()
      return
    } else {
      res.status(403).send({
        message: "Required User Role!",
      })
      return
    }
    // user.getUsergroup().then((usergroup) => {
    //   for (let i = 0; i < usergroup.length; i++) {
    //     if (usergroup[i].name === "user") {
    //       next()
    //       return
    //     }
    //   }
    //   res.status(403).send({
    //     message: "Require User Role!",
    //   })
    // })
  })
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isUser: isUser,
}
module.exports = authJwt
