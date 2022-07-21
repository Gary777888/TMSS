module.exports = (sequelize, Sequelize) => {
  const Application = sequelize.define(
    "applications",
    {
      app_acronym: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      app_description: {
        type: Sequelize.TEXT,
      },
      app_Rnumber: {
        type: Sequelize.INTEGER,
      },
      app_startDate: {
        type: Sequelize.STRING,
      },
      app_endDate: {
        type: Sequelize.STRING,
      },
      app_permit_Open: {
        type: Sequelize.STRING,
      },
      app_permit_toDoList: {
        type: Sequelize.STRING,
      },
      app_permit_Doing: {
        type: Sequelize.STRING,
      },
      app_permit_Done: {
        type: Sequelize.STRING,
      },
      app_permit_Create: {
        type: Sequelize.STRING,
      },
    },
    { timestamps: false }
  )
  return Application
}
