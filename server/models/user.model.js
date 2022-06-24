module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "accounts",
    {
      username: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      usergroup: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
    },
    { timestamps: false }
  )
  return User
}
