//import models
const db = require("../models")
const User = db.user

//import config
const config = require("../config/auth.config")

var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    usergroup: req.body.usergroup,
    status: "active",
  }).then(() => {
    res.send({ message: "Account created!!!" })
  })
}

exports.signin = (req, res) => {
  console.log("req", req.body)
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User not found." })
    }
    if (user.status != "active") {
      return res.status(401).send({ message: "User is unauthorised." })
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      })
    }
    var token = jwt.sign({ username: req.body.username }, config.secret, {
      expiresIn: 86400, //24 hrs
    })
    res.status(200).send({
      username: user.username,
      email: user.email,
      usergroup: user.usergroup,
      accessToken: token,
    })
  })
}
