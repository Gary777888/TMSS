//This file is to verify the user (check whether any duplication of username or email, check whether role exist)
//import models
// const { application } = require("../models")
const db = require("../models")
const User = db.user
const Application = db.application
const Plan = db.plan

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      })
      return
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!",
        })
        return
      }
      next()
    })
  })
}

CheckPassword = (req, res, next) => {
  var passw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/
  console.log(req.body.password, "checking")
  if (req.body.password !== "none" && req.body.password !== "") {
    if (passw.test(req.body.password) == false) {
      res.status(400).send({
        message: "Failed! Password not in correct format",
      })
      return
    }
  }
  next()
}

checkApp_acronym = (req, res, next) => {
  Application.findOne({
    where: {
      app_acronym: req.body.app_acronym,
    },
  }).then((application) => {
    if (application) {
      res.status(400).send({
        message: "Failed! App_acronym is already in use!",
      })
      return
    }
    next()
  })
}

checkplan_MVP_name = (req, res, next) => {
  Plan.findOne({
    where: {
      plan_MVP_name: req.body.plan_MVP_name,
    },
  }).then((plan) => {
    if (plan) {
      res.status(400).send({
        message: "Failed! Plan_MVP_name is already in use!",
      })
      return
    }
    next()
  })
}
// checkUsergroupExisted = (req, res, next) => {
//   if (req.body.Usergroup) {
//     for (let i = 0; i < req.body.Usergroup.length; i++) {
//       if (!Usergroup.includes(req.body.Usergroup[i])) {
//         res.status(400).send({
//           message: "Failed! Role does not exist = " + req.body.Usergroup[i],
//         })
//         return
//       }
//     }
//   }

//   next()
// }
const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  // checkUsergroupExisted: checkUsergroupExisted,
  CheckPassword: CheckPassword,
  checkApp_acronym: checkApp_acronym,
  checkplan_MVP_name: checkplan_MVP_name,
}
module.exports = verifySignUp
