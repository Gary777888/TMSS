//import models
const db = require("../models")
const Task = db.task
const Application = db.application
const Plan = db.plan
const User = db.user
const { Sequelize } = require("../models")

const nodemailer = require("nodemailer")

let temparray = []
let sender = []

// Retrieve all Project Leader from the user table.
const findAllProjectleader = async (req, res) => {
  await User.findAll({
    where: {
      usergroup: {
        [Sequelize.Op.like]: "%project leader%",
      },
    },
  }).then((data) => {
    for (let i = 0; i < data.length; i++) {
      temparray.push(data[i].email)
    }
  })
  /* return temparray.catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving all users from user table.",
    })
  }) */
}

async function email(sender, reciever, taskId) {
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "aa01c5f640454d",
      pass: "93b5f74b543afa",
    },
  })

  let info = await transporter.sendMail({
    from: sender, // sender address
    to: reciever, // list of receivers
    subject: `Task ID: ${taskId}, Task State updated from Doing to Done`, // Subject line
    text: "Hello, the task is completed. See you all", // plain text body
    html: "<b>Task Completed, Task State updated from Doing to Done</b>", // html body
  })
}

exports.createTask = (req, res) => {
  const app_acronym = req.params.app_acronym
  const d_t = new Date()

  let year = d_t.getFullYear()
  let month = ("0" + (d_t.getMonth() + 1)).slice(-2)
  let day = ("0" + d_t.getDate()).slice(-2)
  let hour = d_t.getHours()
  let minute = d_t.getMinutes()
  let seconds = d_t.getSeconds()

  Application.findByPk(app_acronym).then((app) => {
    if (!app) {
      res.status(404).send({
        message: `Cannot find app_acronym=${app_acronym}.`,
      })
    } else {
      Task.create({
        task_name: req.body.task_name,
        task_description: req.body.task_description,
        task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " " + "Task created by " + req.body.task_owner + ". Current State: Open",
        task_id: app_acronym + "_" + app.app_Rnumber,
        task_plan: req.body.task_plan,
        task_app_acronym: app_acronym,
        task_state: "Open",
        task_creator: req.body.task_creator,
        task_owner: req.body.task_owner,
        task_createDate: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds,
      }).then(() => {
        res.send({ message: "Task created!!" })
      })
      // Update App's Rnumber
      Application.findByPk(app_acronym).then(() => {
        const appRnumber = app.app_Rnumber + 1
        Application.update(
          {
            app_Rnumber: appRnumber,
          },
          { where: { app_acronym: app_acronym } }
        )
      })
    }
  })
}

// Retrieve all tasks
exports.findallTasks = (req, res) => {
  const app_acronym = req.params.app_acronym

  Application.findByPk(app_acronym).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find app_acronym=${app_acronym}.`,
      })
    } else {
      Task.findAll({ where: { task_app_acronym: app_acronym } })
        .then((data) => {
          res.send(data)
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving plans from plan table.",
          })
        })
    }
  })
}

// Change forward state
exports.forwardState = (req, res) => {
  const d_t = new Date()

  let year = d_t.getFullYear()
  let month = ("0" + (d_t.getMonth() + 1)).slice(-2)
  let day = ("0" + d_t.getDate()).slice(-2)
  let hour = d_t.getHours()
  let minute = d_t.getMinutes()
  let seconds = d_t.getSeconds()

  Task.findByPk(req.body.task.task_id).then((task) => {
    switch (req.body.task.task_state) {
      case "Open": {
        Task.update(
          {
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " " + req.body.task.task_owner + "\ntask updated from state: Open to state: To Do" + "\n\n" + task.task_notes,
            task_state: "To Do",
            task_owner: req.body.task.task_owner,
          },
          { where: { task_id: req.body.task.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with task id=${req.body.task.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
        break
      }
      case "To Do": {
        Task.update(
          {
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " " + req.body.task.task_owner + "\ntask updated from state: To Do to state: Doing" + "\n\n" + task.task_notes,
            task_state: "Doing",
            task_owner: req.body.task.task_owner,
          },
          { where: { task_id: req.body.task.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with task id=${req.body.task.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
        break
      }
      case "Doing": {
        Task.update(
          {
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " " + req.body.task.task_owner + "\ntask updated from state: Doing to state: Done" + "\n\n" + task.task_notes,
            task_state: "Done",
            task_owner: req.body.task.task_owner,
          },
          { where: { task_id: req.body.task.task_id } }
        ).then((num) => {
          if (num == 1) {
            findAllProjectleader()
            User.findOne({
              where: { username: req.body.task.task_owner },
            }).then((nice) => {
              sender.push(nice.email)
            })

            email(sender, temparray, req.body.task.task_id)
            res.send({
              message: "Task ID: " + req.body.task.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with task id=${req.body.task.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
        break
      }
      case "Done": {
        Task.update(
          {
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " " + req.body.task.task_owner + "\ntask updated from state: Done to state: Close" + "\n\n" + task.task_notes,
            task_state: "Close",
            task_owner: req.body.task.task_owner,
          },
          { where: { task_id: req.body.task.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with task id=${req.body.task.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
        break
      }
    }
  })
}

// Change reverse state
exports.reverseState = (req, res) => {
  const d_t = new Date()

  let year = d_t.getFullYear()
  let month = ("0" + (d_t.getMonth() + 1)).slice(-2)
  let day = ("0" + d_t.getDate()).slice(-2)
  let hour = d_t.getHours()
  let minute = d_t.getMinutes()
  let seconds = d_t.getSeconds()

  Task.findByPk(req.body.task.task_id).then((task) => {
    switch (req.body.task.task_state) {
      case "Done": {
        Task.update(
          {
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " " + req.body.task_owner + "\ntask updated from state: Done to state: Doing" + "\n\n" + task.task_notes,
            task_state: "Doing",
            task_owner: req.body.task.task_owner,
          },
          { where: { task_id: req.body.task.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with task id=${req.body.task.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
        break
      }
      case "Doing": {
        Task.update(
          {
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " " + req.body.task_owner + "\ntask updated from state: Doing to state: To Do" + "\n\n" + task.task_notes,
            task_state: "To Do",
            task_owner: req.body.task.task_owner,
          },
          { where: { task_id: req.body.task.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with task id=${req.body.task.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
        break
      }
    }
  })
}
// View selected task
exports.findOneTask = (req, res) => {
  Task.findByPk(req.body.task_id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find Task ID=${req.body.task_id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Task ID=" + req.body.task_id,
      })
    })
}

//Edit selected task
exports.updateTask = (req, res) => {
  const d_t = new Date()

  let year = d_t.getFullYear()
  let month = ("0" + (d_t.getMonth() + 1)).slice(-2)
  let day = ("0" + d_t.getDate()).slice(-2)
  let hour = d_t.getHours()
  let minute = d_t.getMinutes()
  let seconds = d_t.getSeconds()

  Task.findByPk(req.body.task_id)
    .then((task) => {
      if (req.body.task_plan == "" && req.body.task_description == "" && req.body.task_notes !== "") {
        Task.update(
          {
            task_description: req.body.task_description,
            task_plan: req.body.task_plan,
            task_owner: req.body.task_owner,
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " Updated by: " + req.body.task_owner + ". Current state: " + task.task_state + ".\ntask plan and task notes have been changed" + "\ntask notes:" + req.body.task_notes + "\n\n" + task.task_notes,
          },
          { where: { task_id: req.body.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with Task ID=${req.body.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
      } else if (req.body.task_plan !== "" && req.body.task_description == "" && req.body.task_notes !== "") {
        Task.update(
          {
            task_description: req.body.task_description,
            task_plan: req.body.task_plan,
            task_owner: req.body.task_owner,
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " Updated by: " + req.body.task_owner + ". Current state: " + task.task_state + ".\ntask plan and task notes have been changed" + "\ntask notes:" + req.body.task_notes + "\n\n" + task.task_notes,
          },
          { where: { task_id: req.body.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with Task ID=${req.body.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
      } else if (req.body.task_plan == "" && req.body.task_description !== "" && req.body.task_notes !== "") {
        Task.update(
          {
            task_description: req.body.task_description,
            task_plan: req.body.task_plan,
            task_owner: req.body.task_owner,
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " Updated by: " + req.body.task_owner + ". Current state: " + task.task_state + ".\ntask plan and task notes have been changed" + "\ntask notes:" + req.body.task_notes + "\n\n" + task.task_notes,
          },
          { where: { task_id: req.body.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with Task ID=${req.body.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
      } else if (req.body.task_plan !== "" && req.body.task_description == "" && req.body.task_notes == "") {
        Task.update(
          {
            task_description: req.body.task_description,
            task_plan: req.body.task_plan,
            task_owner: req.body.task_owner,
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " Updated by: " + req.body.task_owner + ". Current state: " + task.task_state + ".\ntask plan and task notes have been changed" + "\ntask notes:" + req.body.task_notes + "\n\n" + task.task_notes,
          },
          { where: { task_id: req.body.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with Task ID=${req.body.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
      } else if (req.body.task_plan == "" && req.body.task_description !== "" && req.body.task_notes == "") {
        Task.update(
          {
            task_description: req.body.task_description,
            task_plan: req.body.task_plan,
            task_owner: req.body.task_owner,
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " Updated by: " + req.body.task_owner + ". Current state: " + task.task_state + ".\ntask plan and task notes have been changed" + "\ntask notes:" + req.body.task_notes + "\n\n" + task.task_notes,
          },
          { where: { task_id: req.body.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with Task ID=${req.body.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
      } else if (req.body.task_plan !== "" && req.body.task_description !== "" && req.body.task_notes == "") {
        Task.update(
          {
            task_description: req.body.task_description,
            task_plan: req.body.task_plan,
            task_owner: req.body.task_owner,
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " Updated by: " + req.body.task_owner + ". Current state: " + task.task_state + ".\ntask plan and task notes have been changed" + "\ntask notes:" + req.body.task_notes + "\n\n" + task.task_notes,
          },
          { where: { task_id: req.body.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with Task ID=${req.body.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
      } else if (req.body.task_plan !== "" && req.body.task_description !== "" && req.body.task_notes !== "") {
        Task.update(
          {
            task_description: req.body.task_description,
            task_plan: req.body.task_plan,
            task_owner: req.body.task_owner,
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " Updated by: " + req.body.task_owner + ". Current state: " + task.task_state + ".\ntask plan and task notes have been changed" + "\ntask notes:" + req.body.task_notes + "\n\n" + task.task_notes,
          },
          { where: { task_id: req.body.task_id } }
        ).then((num) => {
          if (num == 1) {
            res.send({
              message: "Task ID: " + req.body.task_id + " was updated successfully.",
            })
          } else {
            res.status(404).send({
              message: `Cannot update Task with Task ID=${req.body.task_id}. Maybe Task was not found or req.body is empty!`,
            })
          }
        })
      } else {
        res.send({ message: "Nothing has been changed." })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Task with Task ID=" + req.body.task_id,
      })
    })
}

//Assignment 3 (Create Task)
exports.createTaskAssig3 = (req, res) => {
  const app_acronym = req.params.app_acronym
  const username = req.params.username

  const d_t = new Date()

  let year = d_t.getFullYear()
  let month = ("0" + (d_t.getMonth() + 1)).slice(-2)
  let day = ("0" + d_t.getDate()).slice(-2)
  let hour = d_t.getHours()
  let minute = d_t.getMinutes()
  let seconds = d_t.getSeconds()

  Application.findByPk(app_acronym).then((app) => {
    if (!app) {
      res.status(501).send({
        message: "Error code: 501",
      })
    } else {
      Plan.findOne({ where: { plan_app_acronym: app_acronym, plan_MVP_name: req.body.task_plan } }).then((plan) => {
        if (!plan && req.body.task_plan !== "") {
          return res.status(502).send({ message: "Error code: 502" })
        } else {
          if (req.body.task_name === "") {
            return res.status(500).send({ message: "Error code: 500" })
          }
          Task.create({
            task_name: req.body.task_name,
            task_description: req.body.task_description,
            task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " " + "Task created by " + req.body.task_creator + ". Current State: Open.",
            task_id: app_acronym + "_" + app.app_Rnumber,
            task_plan: req.body.task_plan,
            task_app_acronym: app_acronym,
            task_state: "Open",
            task_creator: username,
            task_owner: username,
            task_createDate: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds,
          }).then(() => {
            return res.status(200).send({ message: "Success Code: 200" })
          })
          // Update App's Rnumber
          Application.findByPk(app_acronym).then(() => {
            const appRnumber = app.app_Rnumber + 1
            Application.update(
              {
                app_Rnumber: appRnumber,
              },
              { where: { app_acronym: app_acronym } }
            )
          })
        }
      })
    }
  })
}

//Assignment 3 (GetTaskbyState)
exports.GetTaskbyState = (req, res) => {
  const app_acronym = req.params.app_acronym
  const task_state = req.params.task_state

  Application.findByPk(app_acronym).then((app) => {
    if (!app) {
      res.status(501).send({
        message: "Error code: 501",
      })
    } else {
      let temparray = ["Success code: 210"]
      Task.findAll({ where: { task_app_acronym: app_acronym, task_state: task_state } }).then((app) => {
        temparray.push(app)
        if (task_state === "Open") {
          res.status(210).send(temparray)
        } else if (task_state === "To Do") {
          res.status(210).send(temparray)
        } else if (task_state === "Doing") {
          res.status(210).send(temparray)
        } else if (task_state === "Done") {
          res.status(210).send(temparray)
        } else if (task_state === "Close") {
          res.status(210).send(temparray)
        } else {
          return res.status(505).send({ message: "Error code: 505" })
        }
      })
    }
  })
}

//Promote tasks from doing to done (Assignment 3)
exports.PromoteTask2Done = (req, res) => {
  const task_id = req.params.task_id

  const d_t = new Date()

  let year = d_t.getFullYear()
  let month = ("0" + (d_t.getMonth() + 1)).slice(-2)
  let day = ("0" + d_t.getDate()).slice(-2)
  let hour = d_t.getHours()
  let minute = d_t.getMinutes()
  let seconds = d_t.getSeconds()

  Task.findOne({ where: { task_id: task_id } }).then((app) => {
    if (app == null) {
      return res.status(504).send({ message: "Error code: 504" })
    } else if (app.task_state !== "Doing") {
      return res.status(503).send({ message: "Error code: 503" })
    } else {
      Task.update(
        {
          task_notes: year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds + " " + req.params.username + "\ntask updated from state: Doing to state: Done" + "\n\n" + app.task_notes,
          task_state: "Done",
          task_owner: req.params.username,
        },
        { where: { task_id: task_id } }
      ).then((num) => {
        if (num == 1) {
          findAllProjectleader()
          User.findOne({
            where: { username: req.params.username },
          }).then((nice) => {
            sender.push(nice.email)
          })
          email(sender, temparray, task_id)
          return res.send({
            message: "Success code: 220",
          })
        }
      })
    }
  })
}
