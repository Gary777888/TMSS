module.exports = (app) => {
  const Usergroups = require("../controllers/usergroups.controller")
  const checkUsergroup = require("../middleware/checkusergroup")

  //Retrieve all usergroups from usergroup table
  app.get("/api/usergroups", Usergroups.findAllUserGroups)

  //Add an new usergroup
  app.post("/api/usergroup", [checkUsergroup.checkDuplicateUsergroup], Usergroups.newusergroup)

  //Update usergroup status
  app.put("/api/:name", Usergroups.usergroupstatus)
}
