module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define(
    "tasks",
    {
      task_name: {
        type: Sequelize.STRING,
      },
      task_description: {
        type: Sequelize.TEXT,
      },
      task_notes: {
        type: Sequelize.TEXT,
      },
      task_id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      task_plan: {
        type: Sequelize.STRING,
      },
      task_app_acronym: {
        type: Sequelize.STRING,
      },
      task_state: {
        type: Sequelize.STRING,
      },
      task_creator: {
        type: Sequelize.STRING,
      },
      task_owner: {
        type: Sequelize.STRING,
      },
      task_createDate: {
        type: Sequelize.DATEONLY,
      },
    },
    { timestamps: false }
  )
  return Task
}
