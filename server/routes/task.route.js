const task = require("../controllers/task.controller.js")
const Usermanagement = require("../controllers/usermanagement.controller")
const { authJwt } = require("../middleware")

module.exports = function (app) {
  app.post("/api/createTask/:app_acronym", task.createTask)

  //Retrieve all Tasks
  app.get("/api/viewTasks/:app_acronym", task.findallTasks)

  //Update task forward state
  app.put("/api/updateTask/forwardTask", task.forwardState)

  //Update task reverse state
  app.put("/api/updateTask/reverseTask", task.reverseState)

  //Retrieve selected Task
  app.get("/api/viewTask/viewselected", task.findOneTask)

  //Edit selected task
  app.put("/api/updateTask/editTask", task.updateTask)

  //Retrieve Project leader
  app.get("/api/viewUser/allprojectleaders", Usermanagement.findAllProjectleader)
}
