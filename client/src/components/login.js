import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthService from "../services/auth.service"
import Form from "react-validation/build/form"

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    )
  }
}

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [successful, setSuccessful] = useState(false)

  const navigate = useNavigate()

  // function validationForm() {
  //   return email.length > 0
  // }

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
    // setSuccessful(false)
    AuthService.login(username, password).then(
      (response) => {
        // setSuccessful(true)

        console.log("Login success!")
        navigate("/home")
        window.location.reload()
      },
      (error) => {
        const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        setMessage(resMessage)
        // setSuccessful(false)
      }
    )
  }

  return (
    <div>
      <div className="card card-container">
        <Form>
          <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />
          <h4 style={{ textAlign: "left" }}>Username</h4>
          <input type="username" onChange={onChangeUsername} />
          <h2>Password</h2>
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
        </Form>
      </div>
    </div>
  )
}

export default Login
