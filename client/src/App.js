import "./App.css"
import React, { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import AuthService from "./services/auth.service"
import UserManagement from "./services/usermanagement.service"
import "bootstrap/dist/css/bootstrap.min.css"

// import components
import Register from "./components/register"
import Login from "./components/login"
import Profile from "./components/profile"
import Home from "./components/home"
import UsermanagementList from "./components/usermanagement"
import Edituser from "./components/edituser"
import Editprofile from "./components/editprofile"
import Usergroup from "./components/usergroups"
import ApplicatonList from "./components/application"
import CreateApp from "./components/createApplication"
import EditApp from "./components/editApp"
import ViewApp from "./components/viewapp"
import CreatePlan from "./components/createplan"
import Viewallplans from "./components/viewallplans"
import EditPlan from "./components/editplan"
import CreateTask from "./components/createtask"

function App() {
  const [showAdminBoard, setshowAdminBoard] = useState(false)
  const [currentUser, setCurrentUser] = useState(undefined)
  const [showUserBoard, setshowUserBoard] = useState(false)
  const [showProjectLeader, setshowProjectLeader] = useState(false)
  const [showAllUsers, setshowAllUsers] = useState(false)
  // const componentDidMount = () => {
  //   const user = AuthService.getCurrentUser()
  //   console.log(user)

  //   if (user) {
  //     setCurrentUser(currentUser)
  //      showAdminBoard= user.usergroup.includes("admin")
  //     setshowAdminBoard(showAdminBoard)
  //   }
  // }

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    // console.log(user)
    if (user) {
      setCurrentUser(user)
      UserManagement.get(user.username).then((response) => {
        setshowAdminBoard(response.data.usergroup.includes("admin"))
        setshowProjectLeader(response.data.usergroup.includes("project leader"))
        setshowAllUsers(response.data.usergroup)
      })
    }
  }, [])

  const logOut = () => {
    AuthService.logout()
    // setshowAdminBoard(false)
    // setshowUserBoard(false)
    //setCurrentUser(false)
  }

  return (
    <div className="App">
      <BrowserRouter>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/home"} className="navbar-brand">
            TMS
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {/* {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin
                </Link>
              </li>
            )}

            {showUserBoard && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User
                </Link>
              </li>
            )} */}

            {showAllUsers && (
              <li className="nav-item">
                <Link to={"/application"} className="nav-link">
                  Application
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/usermanagement"} className="nav-link">
                    Usermanagement
                  </Link>
                </li>
              )}
              {showProjectLeader && (
                <li className="nav-item">
                  <Link to={"/createApp"} className="nav-link">
                    Create App
                  </Link>
                </li>
              )}

              {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/usergroups"} className="nav-link">
                    Usergroup
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <Link to={`profile/${currentUser.username}`} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>

              {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/registerpage"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <a href="/home" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/loginpage"} className="nav-link">
                  Login
                </Link>
              </li>
            </div>
          )}
        </nav>

        <Routes>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/registerpage" element={<Register />} />
          <Route exact path="/loginpage" element={<Login />} />
          <Route exact path="/profile/:username" element={<Profile />} />
          {/* <Route exact path="/admin" element={<Admin />} /> */}
          {/* <Route exact path="/user" element={<User />} /> */}
          <Route exact path="/usermanagement" element={<UsermanagementList />} />
          <Route exact path="/edituser/:username" element={<Edituser />} />
          <Route exact path="/editprofile/:username" element={<Editprofile />} />
          <Route exact path="/usergroups" element={<Usergroup />} />
          <Route exact path="/application" element={<ApplicatonList />} />
          <Route exact path="/createApp" element={<CreateApp />} />
          <Route exact path="/application/editApp/:app_acronym" element={<EditApp />} />
          <Route exact path="/application/viewApp/:app_acronym" element={<ViewApp />} />
          <Route exact path="/createPlan/:app_acronym" element={<CreatePlan />} />
          <Route exact path="/viewPlans/:app_acronym" element={<Viewallplans />} />
          <Route exact path="/editPlan/:app_acronym/:plan_MVP_name" element={<EditPlan />} />
          <Route exact path="/createTask/:app_acronym" element={<CreateTask />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
