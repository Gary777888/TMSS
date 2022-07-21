//This file is to check whether the usergroup name is exist
const db = require("../models")
const Usergroup = db.usergroup

checkDuplicateUsergroup = (req, res, next) => {
  // Username
  Usergroup.findOne({
    where: {
      name: req.body.name,
      status: "active",
    },
  }).then((usergroup) => {
    if (usergroup) {
      res.status(400).send({
        message: "Failed! Usergroup: " + usergroup.name + " is already in use!",
      })
      return
    }
    next()
  })
}

const checkUsergroup = {
  checkDuplicateUsergroup: checkDuplicateUsergroup,
  // checkUsergroupExisted: checkUsergroupExisted,
  // CheckPassword: CheckPassword,
}
module.exports = checkUsergroup
