import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "./account.png"

//import services
import AuthService from "../services/auth.service"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [successful, setSuccessful] = useState(false)

  const navigate = useNavigate()

  const onChangeUsername = (e) => {
    const username = e.target.value
    setUsername(username)
  }

  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
  }

  const handleLogin = (req, res) => {
    setMessage("")
    AuthService.login(username, password).then(
      () => {
        console.log("Login success!")
        navigate("/home")
        window.location.reload()
      },
      (error) => {
        const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        setMessage(resMessage)
      }
    )
  }

  return (
    <div>
      <div className="card card-container">
        <div>
          <img src={logo} style={{ height: 200 }} alt="Logo" />
          <h4>Username</h4>
          <input type="username" onChange={onChangeUsername} />
          <h4>Password</h4>
          <input type="password" onChange={onChangePassword} />
          <br />
          <br />
          {message && (
            <div className="form-group">
              <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                {message}
              </div>
            </div>
          )}
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Login
