const db = require("../models")
const User = db.user
const UserGroup = db.usergroup

// Retrieve all usergroups from usergroup table
exports.findAllUserGroups = (req, res) => {
  UserGroup.findAll()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving usergroups from usergroup table.",
      })
    })
}

//Create new usergroup
exports.newusergroup = (req, res) => {
  UserGroup.create({
    name: req.body.name,
    status: "active",
  }).then(() => {
    res.send({ message: "Usergroup: " + req.body.name + " created!!!" })
  })
}

//Update usergroup status
exports.usergroupstatus = async (req, res) => {
  const name = req.params.name
  console.log(name, "name")
  console.log(req.body, "ALL REQ.BODY")

  const group = await UserGroup.findOne({ where: { name: name } })
  if (group.status === req.body.status) {
    res.send({
      message: "Usergroup: " + name + " status is the same!",
    })
  } else {
    UserGroup.update(
      {
        status: req.body.status,
      },
      { where: { name: name } }
    )
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Usergroup: " + name + " status was updated successfully.",
          })
        } else {
          res.send({
            message: `Cannot update Usergroup status with name=${name}. Maybe Usergroup name was not found or req.body is empty!`,
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Usergroup with name=" + name,
        })
      })
  }
}
