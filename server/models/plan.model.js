module.exports = (sequelize, Sequelize) => {
  const Plan = sequelize.define(
    "plans",
    {
      plan_MVP_name: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      plan_startDate: {
        type: Sequelize.STRING,
      },
      plan_endDate: {
        type: Sequelize.STRING,
      },
      plan_app_acronym: {
        type: Sequelize.STRING,
      },
      plan_description: {
        type: Sequelize.TEXT,
      },
    },
    { timestamps: false }
  )
  return Plan
}
