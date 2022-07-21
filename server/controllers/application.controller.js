const db = require("../models")
const Application = db.application

// Create an app
exports.createApp = (req, res) => {
  console.log("backend", req.body.app_startDate)
  Application.create({
    app_acronym: req.body.app_acronym,
    app_description: req.body.app_description,
    app_Rnumber: req.body.app_Rnumber,
    app_startDate: req.body.app_startDate,
    app_endDate: req.body.app_endDate,
    app_permit_Open: req.body.app_permit_Open,
    app_permit_toDoList: req.body.app_permit_toDoList,
    app_permit_Doing: req.body.app_permit_Doing,
    app_permit_Done: req.body.app_permit_Done,
    app_permit_Create: req.body.app_permit_Create,
  }).then(() => {
    res.send({ message: "App created!!" })
  })
}

// Retrieve all applications
exports.findallApp = (req, res) => {
  Application.findAll()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving applications from application table.",
      })
    })
}

// View selected application
exports.findOneApp = (req, res) => {
  const app_acronym = req.params.app_acronym
  Application.findByPk(app_acronym)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find app_acronym=${app_acronym}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving app_acronym=" + app_acronym,
      })
    })
}

//Update an app
exports.updateApp = (req, res) => {
  const app_acronym = req.params.app_acronym
  Application.findByPk(app_acronym)
    .then(() => {
      Application.update(
        {
          app_description: req.body.app_description,
          app_startDate: req.body.app_startDate,
          app_endDate: req.body.app_endDate,
          app_permit_Open: req.body.app_permit_Open,
          app_permit_toDoList: req.body.app_permit_toDoList,
          app_permit_Doing: req.body.app_permit_Doing,
          app_permit_Done: req.body.app_permit_Done,
          app_permit_Create: req.body.app_permit_Create,
        },
        { where: { app_acronym: app_acronym } }
      ).then((num) => {
        if (num == 1) {
          res.send({
            message: "App acronym: " + app_acronym + " was updated successfully.",
          })
        } else {
          res.status(404).send({
            message: `Cannot update Application with app_acronym=${app_acronym}. Maybe Application was not found or req.body is empty!`,
          })
        }
      })
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Application with app_acronym=" + app_acronym,
      })
    })
}
