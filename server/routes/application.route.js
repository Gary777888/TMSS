//import middleware
const { authJwt, verifySignUp } = require("../middleware")

//import application from controller folder
const application = require("../controllers/application.controller")

module.exports = function (app) {
  //Retrieve all applications
  app.get("/api/application", application.findallApp)

  //Create a new application
  app.post("/api/createApp", [authJwt.verifyToken, verifySignUp.checkApp_acronym, authJwt.isProjectLeader], application.createApp)

  //Retrieve an application (Edit)
  app.get("/api/application/editApp/:app_acronym", application.findOneApp)

  //Retrieve an application (View)
  app.get("/api/application/viewApp/:app_acronym", application.findOneApp)

  //Update an app
  app.put("/api/application/:app_acronym", application.updateApp)
}
