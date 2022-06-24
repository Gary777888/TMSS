import "./App.css"
import React, { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import AuthService from "./services/auth.service"
import "bootstrap/dist/css/bootstrap.min.css"

// import components
import Register from "./components/register"
import Login from "./components/login"
import Profile from "./components/profile"
import Home from "./components/home"
import Admin from "./components/admin"
import User from "./components/user"
import Usermanagement from "./components/usermanagement"

function App() {
  const [showAdminBoard, setshowAdminBoard] = useState(false)
  const [currentUser, setCurrentUser] = useState(undefined)
  const [showUserBoard, setshowUserBoard] = useState(false)

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
    console.log(user)

    if (user) {
      setCurrentUser(user)
      setshowAdminBoard(user.usergroup.includes("admin"))
    }

    if (user) {
      setCurrentUser(user)
      setshowUserBoard(user.usergroup.includes("user"))
    }
  }, [])

  const logOut = () => {
    AuthService.logout()
    setshowAdminBoard(false)
    setshowUserBoard(false)
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

            {showAdminBoard && (
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

              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>

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

              <li className="nav-item">
                <Link to={"/registerpage"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <Routes>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/registerpage" element={<Register />} />
          <Route exact path="/loginpage" element={<Login />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/admin" element={<Admin />} />
          <Route exact path="/user" element={<User />} />
          <Route exact path="/usermanagement" element={<Usermanagement />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
