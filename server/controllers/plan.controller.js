const db = require("../models")
const Plan = db.plan
const Application = db.application

// Create a plan
exports.createPlan = (req, res) => {
  const app_acronym = req.params.app_acronym
  Application.findByPk(app_acronym).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find app_acronym=${app_acronym}.`,
      })
    } else {
      Plan.create({
        plan_MVP_name: req.body.plan_MVP_name,
        plan_startDate: req.body.plan_startDate,
        plan_endDate: req.body.plan_endDate,
        plan_app_acronym: app_acronym,
        plan_description: req.body.plan_description,
      }).then(() => {
        res.send({ message: "Plan created!!" })
      })
    }
  })
}

// Retrieve all plans
exports.findallPlans = (req, res) => {
  const app_acronym = req.params.app_acronym
  Application.findByPk(app_acronym).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find app_acronym=${app_acronym}.`,
      })
    } else {
      Plan.findAll({ where: { plan_app_acronym: app_acronym } })
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

// View selected plan
exports.findOnePlan = (req, res) => {
  const app_acronym = req.params.app_acronym
  const plan_MVP_name = req.params.plan_MVP_name
  Application.findByPk(app_acronym).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find app_acronym=${app_acronym}.`,
      })
    } else {
      Plan.findOne({
        where: {
          plan_MVP_name: plan_MVP_name,
          plan_app_acronym: app_acronym,
        },
      })
        .then((data) => {
          if (data) {
            res.send(data)
          } else {
            res.status(404).send({
              message: `Cannot find plan_MVP_name=${plan_MVP_name}.`,
            })
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error retrieving plan_MVP_name=" + plan_MVP_name,
          })
        })
    }
  })
}

//Edit selected plan
exports.updatePlan = (req, res) => {
  const app_acronym = req.params.app_acronym
  const plan_MVP_name = req.params.plan_MVP_name
  Application.findByPk(app_acronym).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find app_acronym=${app_acronym}.`,
      })
    } else {
      Plan.findOne({
        where: {
          plan_MVP_name: plan_MVP_name,
          plan_app_acronym: app_acronym,
        },
      })
        .then(() => {
          Plan.update(
            {
              plan_startDate: req.body.plan_startDate,
              plan_endDate: req.body.plan_endDate,
              plan_description: req.body.plan_description,
            },
            { where: { plan_MVP_name: plan_MVP_name } }
          ).then((num) => {
            if (num == 1) {
              res.send({
                message: "plan_MVP_name: " + plan_MVP_name + " was updated successfully.",
              })
            } else {
              res.status(404).send({
                message: `Cannot update Plan with plan_MVP_name=${plan_MVP_name}. Maybe Plan was not found or req.body is empty!`,
              })
            }
          })
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating Plan with plan_MVP_name=" + plan_MVP_name,
          })
        })
    }
  })
}
