const controller = require("../controllers/auth.controller")
const verifySignUp = require("../middleware/verifySignUp")

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
    next()
  })

  app.post("/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.CheckPassword], controller.signup)
  app.post("/api/auth/signin", controller.signin)
}
