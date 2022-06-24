module.exports = (sequelize, Sequelize) => {
  const Usergroup = sequelize.define(
    "usergroups",
    {
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      status: {
        type: Sequelize.STRING,
      },
    },
    { timestamps: false }
  )
  return Usergroup
}
