import React, { useState, useEffect, useRef, useMemo } from "react"
import Application from "../services/application.service"
import UserManagement from "../services/usermanagement.service"
import UserGroups from "../services/usergroups.service"
import AuthService from "../services/auth.service"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useTable } from "react-table"
import { useNavigate } from "react-router"
import App from "../App"

const CreateApp = () => {
  const [app_acronym, setApp_acronym] = useState("")
  const [app_description, setApp_description] = useState("")
  const [app_Rnumber, setApp_Rnumber] = useState("")
  const [app_startDate, setApp_startDate] = useState("")
  const [app_endDate, setApp_endDate] = useState("")
  const [app_permitOpen, setApp_permitOpen] = useState("")
  const [app_permit_toDoList, setApp_permit_toDolist] = useState("")
  const [app_permit_Doing, setApp_permit_doing] = useState("")
  const [app_permit_Done, setApp_permit_done] = useState("")
  const [app_permit_Create, setApp_permit_create] = useState("")
  const [message, setMessage] = useState("")
  const [successful, setSuccessful] = useState(false)
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
        // setCurrentNewUser(response.data)
        // usergroupstatus(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const onChangeApp_acronym = (e) => {
    const app_acronym = e.target.value
    setApp_acronym(app_acronym)
  }

  const onChangeApp_description = (e) => {
    const app_description = e.target.value
    setApp_description(app_description)
  }

  const onChangeApp_Rnumber = (e) => {
    const app_Rnumber = e.target.value
    setApp_Rnumber(app_Rnumber)
  }

  const onBlurApp_Rnumber = (e) => {
    if (e.target.value < 0) {
      message = "Rnumber must be more than 0"
      return alert("Rnumber must be more than 0")
    }
  }

  const onChangeApp_startdate = (e) => {
    const app_startDate = e.target.value
    setApp_startDate(app_startDate)
  }

  const onChangeApp_enddate = (e) => {
    const app_endDate = e.target.value
    setApp_endDate(app_endDate)
  }

  const onChangeApp_permitOpen = (e) => {
    const app_permitOpen = e.target.value
    setApp_permitOpen(app_permitOpen)
  }

  const onChangeApp_permit_toDolist = (e) => {
    const app_permit_toDoList = e.target.value
    setApp_permit_toDolist(app_permit_toDoList)
  }

  const onChangeApp_permit_doing = (e) => {
    const app_permit_Doing = e.target.value
    setApp_permit_doing(app_permit_Doing)
  }

  const onChangeApp_permit_done = (e) => {
    const app_permit_Done = e.target.value
    setApp_permit_done(app_permit_Done)
  }

  const onChangeApp_permit_create = (e) => {
    const app_permit_create = e.target.value
    setApp_permit_create(app_permit_create)
  }

  const handleCreateApp = (req, res) => {
    setMessage("")
    setSuccessful(false)
    console.log("ih", app_startDate)
    if (app_acronym === "") {
      alert("App acronym cannot be empty.")
    } else {
      Application.createApp(app_acronym, app_description, app_Rnumber, app_startDate, app_endDate, app_permitOpen, app_permit_toDoList, app_permit_Doing, app_permit_Done, app_permit_Create).then(
        (response) => {
          setSuccessful(true)
          setMessage(response.data.message)
          setTimeout(function () {
            window.location.reload()
          }, 1000)
        },
        (error) => {
          const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
          setMessage(resMessage)
          setSuccessful(false)
        }
      )
    }
  }

  return (
    <div>
      <div className="card card-container">
        <h1 style={{ backgroundColor: "lightblue", height: "50px" }}>Create App</h1>
        <div>
          <h4>App_acronym</h4>
          <input value={app_acronym} onChange={onChangeApp_acronym}></input>
          <h4>Description</h4>
          <textarea value={app_description} onChange={onChangeApp_description}></textarea>
          <h4>Rnumber</h4>
          <input type="number" value={app_Rnumber} min="0" onBlur={onBlurApp_Rnumber} onChange={onChangeApp_Rnumber}></input>
          <h4>Start Date</h4>
          <input type="date" value={app_startDate} onChange={onChangeApp_startdate}></input>
          <h4>End Date</h4>
          <input type="date" value={app_endDate} onChange={onChangeApp_enddate}></input>
          <h4>Permit Open</h4>

          <select value={app_permitOpen} onChange={onChangeApp_permitOpen}>
            <option></option>
            {usergroups.map((item) => (
              <option>{item}</option>
            ))}
          </select>
          <h4>To Do List</h4>
          <select value={app_permit_toDoList} onChange={onChangeApp_permit_toDolist}>
            <option></option>
            {usergroups.map((item) => (
              <option>{item}</option>
            ))}
          </select>
          <h4>Doing</h4>
          <select value={app_permit_Doing} onChange={onChangeApp_permit_doing}>
            <option></option>
            {usergroups.map((item) => (
              <option>{item}</option>
            ))}
          </select>
          <h4>Done</h4>
          <select value={app_permit_Done} onChange={onChangeApp_permit_done}>
            <option></option>
            {usergroups.map((item) => (
              <option>{item}</option>
            ))}
          </select>
          <h4>Create</h4>
          <select value={app_permit_Create} onChange={onChangeApp_permit_create}>
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
          <button onClick={handleCreateApp}>Create App</button>
        </div>
      </div>
    </div>
  )
}

export default CreateApp
