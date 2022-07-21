//This file is to check whether the account user is authorize from specific role
const jwt = require("jsonwebtoken")
const config = require("../config/auth.config.js")
const db = require("../models")
const User = db.user
const Application = db.application

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
  // const username = req.params.username

  User.findByPk(req.username).then(async (user) => {
    console.log("user variables", user)
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

// // Edit User
// exports.findOne = (req, res) => {
//   const username = req.params.username
//   User.findByPk(username)
//     .then((data) => {
//       if (data) {
//         res.send(data)
//       } else {
//         res.status(404).send({
//           message: `Cannot find username=${username}.`,
//         })
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error retrieving username=" + username,
//       })
//     })
// }

isAdmin = (req, res, next) => {
  const username = req.params.username
  console.log(username)
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

isUser = (req, res, next) => {
  User.findByPk(req.username).then(async (user) => {
    const result = await checkgroup(user.username, "user")

    if (result === true) {
      next()
      return
    } else {
      res.status(403).send({
        message: "Required User Role!",
      })
      return
    }
  })
}

isProjectLeader = (req, res, next) => {
  // const username = req.params.username
  User.findByPk(req.username).then(async (user) => {
    const result = await checkgroup(user.username, "project leader")

    if (result === true) {
      next()
      return
    } else {
      res.status(403).send({
        message: "Required Project Leader Role!",
      })
      return
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

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isUser: isUser,
  isProjectLeader: isProjectLeader,
  isProjectManager: isProjectManager,
  isCreate: isCreate,
}
module.exports = authJwt
