import React, { useState, useEffect } from "react"
import UserManagement from "../services/usermanagement.service"
import { useNavigate, useParams } from "react-router"

const Editprofile = () => {
  const { username } = useParams()
  const [currentUser, setCurrentUser] = useState("")
  const [currentNewUser, setCurrentNewUser] = useState("")
  const [message, setMessage] = useState("")
  const [check, setCheck] = useState(false)
  const [successful, setSuccessful] = useState(false)

  const getProfileUser = async (username) => {
    await UserManagement.getprofile(username)
      .then((response) => {
        setCurrentNewUser(response.data)
        setCurrentUser(response.data)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const updateUser = async (e) => {
    if (currentNewUser.password.length > 10) {
      currentNewUser.password = "none"
    }
    e.preventDefault()
    // setCheck(true)
    // if (currentNewUser.length == 0) {
    // if (check === true) {
    console.log("user", currentNewUser)
    UserManagement.updateprofile(currentNewUser.username, currentNewUser).then(
      (response) => {
        // console.log("HI", response.data)
        setSuccessful(true)
        setCheck(false)
        setMessage("The User was updated successfully!")
        setTimeout(function () {
          window.location.reload()
        }, 1000)
      },
      (error) => {
        console.log("joke", error)
        const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        setMessage(resMessage)
        setSuccessful(false)
        setCheck(false)
      }
    )
    // }
    // .catch((e) => {
    //   console.log(e)
    // })
    // } else {
    //   alert("Password does not meet the requirements!")
    // }
  }

  // const updateUserPassword = async (e) => {
  //   e.preventDefault()
  //   UserManagement.updateuserpassword(currentNewUser.username, currentNewUser).then(
  //     (response) => {
  //       console.log(response.data)
  //       setSuccessful(true)
  //       setCheck(false)
  //       setMessage("The User was updated successfully!")
  //     },
  //     (error) => {
  //       const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
  //       setMessage(resMessage)
  //       setSuccessful(false)
  //       setCheck(false)
  //     }
  //   )
  // }

  useEffect(() => {
    getProfileUser(username)
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setCurrentNewUser({ ...currentNewUser, [name]: value })
    if (currentNewUser.length) {
      return
    }
    // console.log(currentNewUser)
  }

  const onBlurPassword = (e) => {
    const check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/
    const ValidationPassword = check.test(e.target.value)
    if (ValidationPassword === false) {
      window.location.reload()
      return alert("ERROR! The password must be 8 - 10 characters and contains one alphabet, one number and one special character. Details will not be updated with wrong inputs.")
    } else {
      setCheck(true)
      return true
    }
  }
  const style = {
    "margin-left": "20px",
  }

  return (
    <div>
      <br />
      {currentUser ? (
        <div className="edit-form">
          <h4 aria-readonly>
            <b>Username: {currentUser.username}</b>
          </h4>
          <br />
          <form>
            <div className="form-group">
              <h5>
                <b>Password: xxxxx </b>
              </h5>
              <input type="password" onBlur={onBlurPassword} id="password" name="password" onChange={handleInputChange}></input>
              {/* <button style={style} onClick={(e) => updateUserPassword(e)}>
                Update password
              </button> */}
              <br /> <br /> <br />
              <h5 aria-readonly>
                <b>Email: {currentUser.email}</b>
              </h5>
              <input type="email" id="email" name="email" onChange={handleInputChange}></input>
              {message && (
                <div className="form-group">
                  <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                    {message}
                  </div>
                </div>
              )}
            </div>
            <br />
            <button className="ml-20" onClick={(e) => updateUser(e)}>
              Update
            </button>
          </form>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click a user...</p>
        </div>
      )}
    </div>
  )
}

export default Editprofile
