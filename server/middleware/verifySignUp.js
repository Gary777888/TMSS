//This file is to verify the user (check whether any duplication of username or email, check whether role exist)
//Signup (POST): No.1
const db = require("../models")
const USERGROUP = db.USERGROUP
const User = db.user

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
    // //Password
    // User.findOne({
    //   where: {
    //     password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/,
    //   },
    // }).then((user) => {
    //   if (user) {
    //     res.status(400).send({
    //       message: "Failed! Password does not met the requirement!!",
    //     })
    //     return
    //   }
    // })
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

// function CheckPassword(inputtxt) {
//   var passw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/
//   if (inputtxt.value.match(passw)) {
//     alert("Correct, try another...")
//     return true
//   } else {
//     alert("Wrong...!")
//     return false
//   }
// }

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
  // CheckPassword: CheckPassword,
}
module.exports = verifySignUp
