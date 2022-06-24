const express = require("express")
const cors = require("cors")
const db = require("./models")

const app = express()
var corsOptions = {
  origin: "http://localhost:2001",
}
app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// routes (To call the GET, POST, PUT, DELETE requests)
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." })
})
require("./routes/auth.route")(app)
require("./routes/user.route")(app)

// set port, listen for requests
const PORT = process.env.PORT || 2000

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
  })
})
