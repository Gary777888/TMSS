import AuthService from "../services/auth.service"
import logo from "./account.png"
import React, { useState, useEffect } from "react"
import UserGroups from "../services/usergroups.service"

// Import select components
// import InputLabel from "@mui/material/InputLabel"
// import MenuItem from "@mui/material/MenuItem"
// import FormControl from "@mui/material/FormControl"
// import Select, { SelectChangeEvent } from "@mui/material/Select"

// const required = (value) => {
//   if (!value) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         This field is required!!!
//       </div>
//     )
//   }
// }

// const validEmail = (value) => {
//   if (!value) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         This is not a valid email.
//       </div>
//     )
//   }
// }

// const vusername = (value) => {
//   if (!value) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         The username must be filled.
//       </div>
//     )
//   }
// }

// const vpassword = (value) => {
//   if (value.length < 8 || value.length > 10) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         The password must be between 8 and 10 characters.
//       </div>
//     )
//   }
// }

const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [usergroup, setUsergroup] = useState("")
  const [message, setMessage] = useState("")
  const [successful, setSuccessful] = useState(false)
  const [check, setCheck] = useState(false)
  const [usergroups, setusergroups] = useState([])

  useEffect(() => {
    getAllusergroups()
  }, [])

  const getAllusergroups = () => {
    UserGroups.getUsergroups()
      .then((response) => {
        console.log("res", response)
        const usergroups = []
        for (let i = 0; i < response.data.length; i++) {
          usergroups.push(response.data[i].name)
        }
        console.log("s", usergroups)
        setusergroups(usergroups)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const onChangeUsername = (e) => {
    const username = e.target.value
    setUsername(username)
  }

  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
    console.log(password)
  }

  const onBlurPassword = (e) => {
    const check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/

    const ValidationPassword = check.test(e.target.value)
    if (ValidationPassword === false) {
      return alert("The password must be 8 - 10 characters and contains one alphabet, one number and one special character.")
    } else {
      setCheck(true)
      return true
    }
  }

  const onChangeEmail = (e) => {
    const email = e.target.value
    setEmail(email)
  }

  const onChangeUsergroup = (e) => {
    const usergroup = e.target.value
    setUsergroup(usergroup)
  }

  const handleRegister = (req, res) => {
    setMessage("")
    setSuccessful(false)
    console.log(check)
    if (check === true) {
      AuthService.register(username, email, password, usergroup).then(
        (response) => {
          setSuccessful(true)
          setMessage(response.data.message)
          console.log("Account created!")
          setCheck(false)

          setTimeout(function () {
            window.location.reload()
          }, 1000)
        },
        (error) => {
          const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
          setMessage(resMessage)
          setSuccessful(false)
          setCheck(false)
        }
      )
    } else {
      alert("Password does not meet the requirements!")
    }
  }

  return (
    <div>
      <div className="card card-container">
        <div>
          <img src={logo} style={{ height: 200 }} alt="Logo" />
          <h4>Username</h4>
          <input onChange={onChangeUsername}></input>
          <h4>Password</h4>
          <input type="password" onBlur={onBlurPassword} onChange={onChangePassword}></input>
          <h4>Email</h4>
          <input onChange={onChangeEmail}></input>
          <h4>Usergroup</h4>
          <select onChange={onChangeUsergroup}>
            <option></option>
            {usergroups.map((item) => (
              <option>{item}</option>
            ))}
          </select>
          <br />
          <br />
          {message && (
            <div className="form-group">
              <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                {message}
              </div>
            </div>
          )}
          <button onClick={handleRegister}>Create Account</button>
        </div>
      </div>
    </div>
  )
}

export default Register
