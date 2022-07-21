const config = require("../config/db.config.js")
const Sequelize = require("sequelize")

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
})
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require("../models/user.model.js")(sequelize, Sequelize)
db.usergroup = require("../models/usergroup.model.js")(sequelize, Sequelize)
db.application = require("../models/application.model.js")(sequelize, Sequelize)
db.plan = require("../models/plan.model.js")(sequelize, Sequelize)
db.task = require("../models/task.model.js")(sequelize, Sequelize)

// db.application.hasMany(db.plan, {
//   foreignKey: 'plan_app_acronym',
//   sourceKey: 'app_acronym'
// });
// db.plan.belongsTo(db.application);

// db.application.hasMany(db.task, {
//   foreignKey: 'plan_app_acronym',
//   sourceKey: 'app_acronym'
// });

db.USERGROUP = ["admin", "project leader", "project manager", "team member", "user"] //roles from the usergroup table

module.exports = db
