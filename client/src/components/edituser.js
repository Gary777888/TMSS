import React, { useState, useEffect } from "react"
import UserManagement from "../services/usermanagement.service"
import { useParams } from "react-router"

const Edituser = () => {
  const { username } = useParams()
  const [usergroup, setUsergroup] = useState([])
  const [currentUser, setCurrentUser] = useState("")
  const [currentNewUser, setCurrentNewUser] = useState("")
  const [message, setMessage] = useState("")
  const [check, setCheck] = useState(false)
  const [status, setStatus] = useState(false)
  const [checked, setChecked] = useState([])
  const [successful, setSuccessful] = useState(false)
  const [password, setPassword] = useState(false)

  useEffect(() => {
    getUser(username)
    getAllUserGroups()
  }, [])

  const getAllUserGroups = () => {
    UserManagement.getallusergroups()
      .then((response) => {
        const usergroup = []
        for (let i = 0; i < response.data.length; i++) {
          usergroup.push(response.data[i].name)
        }
        setUsergroup(usergroup)
        // setCurrentNewUser(response.data)
        // userstatus(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  // Return classes based on whether item is checked
  const isChecked = (item) => (checked.includes(item) ? "checked-item" : "not-checked-item")

  // const [checkedState, setCheckedState] = useState(new Array(getAllUserGroups.length).fill(false))

  // const usergroupOnChange = (position) => {
  //   const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item))

  //   setCheckedState(updatedCheckedState)
  // }
  const getUser = async (username) => {
    await UserManagement.get(username)
      .then((response) => {
        setCurrentNewUser(response.data)
        setCurrentUser(response.data)
        // userstatus(response.data)
        console.log(response.data.status)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  // const getUser2 = (username) => {
  //   UserManagement.get(username)
  //     .then((response) => {
  //       setCurrentUser(response.data)
  //       userstatus(response.data)
  //       console.log(response.data)
  //     })
  //     .catch((e) => {
  //       console.log(e)
  //     })
  // }

  const onChangeStatus = (e) => {
    const { name, value } = e.target
    setStatus(true)
    setCurrentNewUser({ ...currentNewUser, [name]: value })
  }

  const handleCheck = (event) => {
    var updatedList = [...checked]
    if (event.target.checked) {
      updatedList = [...checked, event.target.value]
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1)
    }
    setChecked(updatedList)
    console.log(checked)
  }

  const updateUser = async (e) => {
    e.preventDefault()
    console.log(checked == "")
    if (checked == "") {
      currentNewUser.usergroup = currentUser.usergroup
    } else {
      const grpString = checked.reduce((acc, curr) => {
        return acc + "," + curr
      })
      console.log(grpString)
      currentNewUser.usergroup = grpString
    }

    console.log(currentNewUser.status)
    // if (status == false) {
    //   currentNewUser.status = "active"
    // }
    // setCheck(true)
    // if (check === true) {
    // setMessage("")
    // setSuccessful(false)
    // console.log(check)
    // if (check === true) {
    console.log(currentNewUser.password)
    if (password == false) {
      console.log("false")
      currentNewUser.password = "none"
    }
    console.log(currentNewUser, "CURRENT")
    UserManagement.update(currentNewUser.username, currentNewUser).then(
      (response) => {
        console.log(response.data)
        setSuccessful(true)
        setCheck(false)
        setMessage(response.data.message)
        localStorage.setItem("usergroup", currentNewUser.usergroup)
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
    // .catch((e) => {
    //   console.log(e)
    //   setSuccessful(false)
    //   setCheck(false)
    // })
    // } else {
    //   alert("Password does not meet the requirements!")
    // }
  }

  const changePassword = (e) => {
    const value = e.target.value
    console.log(value, "Password")
    if (e.target.value.length > 7 && e.target.value.length < 11) {
      setCurrentNewUser({ ...currentNewUser, password: value })
    }
  }

  // const userstatus = (response) => {
  //   var Status = []
  // }

  // useEffect(() => {
  //   getUser(username)
  //   // getUser2(username)
  // }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setCurrentNewUser({ ...currentNewUser, [name]: value })
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
      setPassword(true)
      return true
    }
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
              {message && (
                <div className="form-group">
                  <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                    {message}
                  </div>
                </div>
              )}
              <h5>
                <b>Password: xxxxx </b>
              </h5>
              <input type="password" onBlur={onBlurPassword} id="password" name="password" onChange={changePassword}></input> <br /> <br />
              <h5 aria-readonly>
                <b>Email: {currentUser.email}</b>
              </h5>
              <input type="email" id="email" name="email" onChange={handleInputChange}></input> <br /> <br />
              <h5>
                <b>Status: {currentUser.status}</b>
              </h5>
              <select id="status" name="status" onChange={(e) => onChangeStatus(e)}>
                <option></option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <br /> <br />
              <h5>
                <b>Usergroup: {currentUser.usergroup}</b>
              </h5>
              <div className="list-container">
                {usergroup.map((item, index) => (
                  <div key={index}>
                    <input value={item} name="usergroup" type="checkbox" onChange={handleCheck} />
                    <span className={isChecked(item)}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={(e) => updateUser(e)}>Update</button>
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

export default Edituser
