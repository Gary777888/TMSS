//import middleware
const { authJwt, verifySignUp } = require("../middleware")

//import plan from controller
const plan = require("../controllers/plan.controller")

module.exports = function (app) {
  //Retrieve all plans
  app.get("/api/viewPlans/:app_acronym", plan.findallPlans)

  //Create a new plan
  app.post("/api/createPlan/:app_acronym", [authJwt.verifyToken, authJwt.isProjectManager, verifySignUp.checkplan_MVP_name], plan.createPlan)

  //Retrieve a plan (Edit)
  app.get("/api/editPlan/:app_acronym/:plan_MVP_name", plan.findOnePlan)

  //Update selected plan
  app.put("/api/editPlan/:app_acronym/:plan_MVP_name", plan.updatePlan)
}
