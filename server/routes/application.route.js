const { authJwt, verifySignUp } = require("../middleware")
const application = require("../controllers/application.controller")

module.exports = function (app) {
  app.get("/api/application", application.findallApp)
  app.post("/api/createApp", [authJwt.verifyToken, verifySignUp.checkApp_acronym, authJwt.isProjectLeader], application.createApp)

  //Retrieve an application (Edit)
  app.get("/api/application/editApp/:app_acronym", application.findOneApp)

  //Retrieve an application (View)
  app.get("/api/application/viewApp/:app_acronym", application.findOneApp)

  //Update an app
  app.put("/api/application/:app_acronym", application.updateApp)
}
