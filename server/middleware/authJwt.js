//This file is to check whether the account user is authorize from specific role
const jwt = require("jsonwebtoken")

//import config
const config = require("../config/auth.config.js")

//import models
const db = require("../models")
const User = db.user
const Application = db.application

var bcrypt = require("bcrypt")

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

checkgroup = async (username, usergroup) => {
  return await User.findOne({
    where: {
      username: username,
    },
  }).then((user) => {
    let group = user.usergroup
    if (group.includes(usergroup) == true) {
      return true
    } else {
      return false
    }
  })
}

isCreate = (req, res, next) => {
  User.findByPk(req.username).then(async (user) => {
    Application.findOne({ where: { app_acronym: req.params.app_acronym } }).then(async (app) => {
      if ((await checkgroup(user.username, app.app_permit_Create)) == true) {
        next()
        return
      } else {
        res.status(403).send({
          message: "Required Authorized User!",
        })
      }
    })
    return
  })
}

isAdmin = (req, res, next) => {
  const username = req.params.username
  User.findByPk(username).then(async (user) => {
    const result = await checkgroup(user.username, "admin")

    if (result === true) {
      next()
      return
    } else {
      res.status(403).send({
        message: "Require Admin Role!",
      })
      return
    }
  })
}

isProjectLeader = (req, res, next) => {
  User.findByPk(req.username).then(async (user) => {
    const result = await checkgroup(user.username, "project leader")

    if (result === true) {
      next()
      return
    } else {
      return res.status(403).send({
        message: "Required Project Leader Role!",
      })
    }
  })
}

isProjectManager = (req, res, next) => {
  User.findByPk(req.username).then(async (user) => {
    const result = await checkgroup(user.username, "project manager")

    if (result === true) {
      next()
      return
    } else {
      res.status(403).send({
        message: "Required Project Manager Role!",
      })
      return
    }
  })
}

// checkuser = (req, res, next) => {
//   User.findOne({
//     where: {
//       username: req.body.username,
//     },
//   }).then((user) => {
//     if (!user) {
//       return res.status(404).send({ message: "User not found." })
//     }
//     if (user.status != "active") {
//       return res.status(403).send({ message: "User is unauthorised." })
//     }

//     var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
//     if (!passwordIsValid) {
//       return res.status(401).send({
//         accessToken: null,
//         message: "Invalid Password",
//       })
//     }
//     next()
//   })
// }

checkuser = (req, res, next) => {
  const username = req.params.username
  const password = req.params.password
  User.findOne({
    where: {
      username: username,
    },
  }).then((app) => {
    if (!app) {
      return res.status(401).send({ message: "Error code: 401" })
    }
    if (app.status != "active") {
      return res.status(403).send({ message: "Error code: 403" })
    }
    var passwordIsValid = bcrypt.compareSync(password, app.password)
    if (!passwordIsValid) {
      return res.status(400).send({ message: "Error code: 400" })
    }
    next()
  })
}

isProjectLeaderAssig3 = (req, res, next) => {
  const username = req.params.username
  User.findByPk(username).then(async () => {
    const result = await checkgroup(username, "project leader")
    if (result === false) {
      return res.status(402).send({ message: "Error code: 402" })
    } else {
      next()
    }
  })
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isProjectLeader: isProjectLeader,
  isProjectManager: isProjectManager,
  isCreate: isCreate,
  checkuser: checkuser,
  isProjectLeaderAssig3: isProjectLeaderAssig3,
}
module.exports = authJwt
