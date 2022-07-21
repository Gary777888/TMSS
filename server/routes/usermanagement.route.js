module.exports = (app) => {
  const Usermanagement = require("../controllers/usermanagement.controller")
  const verifySignUp = require("../middleware/verifySignUp")

  //Retrieve all Users
  app.get("/api/usermanagement", Usermanagement.findAll)

  //Retrieve an user
  app.get("/api/edituser/:username", Usermanagement.findOne)

  // //Update an user's password
  // app.put("/api/edituserpassword/:username", [verifySignUp.CheckPassword], Usermanagement.updatepassword)

  //Update an user
  app.put("/api/edituser/:username", [verifySignUp.CheckPassword], Usermanagement.update)

  //Retrieve all usergroups from usergroup table
  app.get("/api/allusersgroup", Usermanagement.findAllUserGroups)

  //Retrieve an user to edit profile
  // http://localhost:2000/api/profile/editprofile/:
  // app.get("/api/profile/editprofile/:username", function (req, res) {
  //   res.send("hi")
  // })
  app.get("/api/profile/editprofile/:username", Usermanagement.findOne)

  //Update an user profile
  app.put("/api/profile/editprofile/:username", [verifySignUp.CheckPassword], Usermanagement.update)
}
