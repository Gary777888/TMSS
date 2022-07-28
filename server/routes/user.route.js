//This file is to send content according to the specific role from user.controller.js
const { authJwt } = require("../middleware")
const controller = require("../controllers/user.controller")
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
    next()
  })
  app.get("/api/home/allusers", controller.allAccess)
}
