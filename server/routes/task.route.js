const task = require("../controllers/task.controller.js")
const Usermanagement = require("../controllers/usermanagement.controller")

const { authJwt } = require("../middleware")

module.exports = function (app) {
  // app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
  //   next()
  // })
  const errorHandler = (error, request, response, next) => {
    response.send({ code: 600, Message: error.message })
  }
  //sd
  //Create a new Task (Assignemnt 3)
  app.post("/api/createTask/:username/:password/:app_acronym", [authJwt.checkuser, authJwt.isProjectLeaderAssig3], task.createTaskAssig3)

  //GetTaskbyState (Assignment 3)
  app.post("/api/GetTaskbyState/:username/:password/:app_acronym/:task_state", [authJwt.checkuser, authJwt.isProjectLeaderAssig3], task.GetTaskbyState)

  //PromoteTask2Done (Assignment 3)
  app.post("/api/PromoteTask2Done/:username/:password/:task_id", [authJwt.checkuser, authJwt.isProjectLeaderAssig3], task.PromoteTask2Done)

  //Create a new Task
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

  //Retrieve all Project leaders
  app.get("/api/viewUser/allprojectleaders", Usermanagement.findAllProjectleader)

  app.use("/api", errorHandler)
}
