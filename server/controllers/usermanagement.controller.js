//import models
const db = require("../models")
const User = db.user
const UserGroup = db.usergroup
const { Sequelize } = require("../models")

var bcrypt = require("bcrypt")

// Retrieve all Users from the user table.
exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving all users from user table.",
      })
    })
}

// Retrieve all Project Leader from the user table.
exports.findAllProjectleader = async (req, res) => {
  await User.findAll({
    where: {
      usergroup: {
        [Sequelize.Op.like]: "%project leader%",
      },
    },
  })
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        console.log(true)
        console.log(data[i].email)
      }
      User.findOne({
        where: { username: "admin" },
      }).then((nice) => {
        console.log(nice.email)
      })
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving all users from user table.",
      })
    })
}

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

// Edit User
exports.findOne = (req, res) => {
  const username = req.params.username
  User.findByPk(username)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find username=${username}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving username=" + username,
      })
    })
}

//Update user's password
exports.updatepassword = (req, res) => {
  const username = req.params.username

  User.update(
    {
      password: bcrypt.hashSync(req.body.password, 10),
    },
    { where: { username: username } }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User's password was updated successfully.",
        })
      } else {
        res.send({
          message: `Cannot update User's password. Maybe User was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with username=" + username,
      })
    })
}

// Update an User
exports.update = (req, res) => {
  const username = req.params.username
  if (req.body.password == "none") {
    User.findByPk(username)
      .then((user) => {
        User.update(
          {
            email: req.body.email,
            password: user.password,
            usergroup: req.body.usergroup,
            status: req.body.status,
          },
          { where: { username: username } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "User: " + username + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update User with username=${username}. Maybe User was not found or req.body is empty!`,
            })
          }
        })
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating User with username=" + username,
        })
      })
  } else {
    User.update(
      {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        usergroup: req.body.usergroup,
        status: req.body.status,
      },
      { where: { username: username } }
    )
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully.",
          })
        } else {
          res.send({
            message: `Cannot update User with username=${username}. Maybe User was not found or req.body is empty!`,
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating User with username=" + username,
        })
      })
  }
}
