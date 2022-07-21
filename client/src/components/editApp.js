import React, { useState, useEffect, useRef, useMemo } from "react"
import Application from "../services/application.service"
import AuthService from "../services/auth.service"
import UserManagement from "../services/usermanagement.service"
import UserGroups from "../services/usergroups.service"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useTable } from "react-table"
import { useNavigate } from "react-router"
import App from "../App"

const EditApp = () => {
  const { app_acronym } = useParams()
  const [message, setMessage] = useState("")
  const [successful, setSuccessful] = useState(false)
  const [currentApp, setCurrentApp] = useState("")
  const [currentnewApp, setCurrentnewApp] = useState("")
  const [usergroups, setusergroups] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getApplication(app_acronym)
    getAllUserGroups()
  }, [])

  const getAllUserGroups = () => {
    UserGroups.getUsergroups()
      .then((response) => {
        const usergroups = []
        for (let i = 0; i < response.data.length; i++) {
          usergroups.push(response.data[i].name)
        }
        setusergroups(usergroups)
        // setCurrentNewUser(response.data)
        // usergroupstatus(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const getApplication = async (app_acronym) => {
    await Application.getSelectedEditApp(app_acronym)
      .then((response) => {
        setCurrentApp(response.data)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const updateApp = async (e) => {
    e.preventDefault()
    console.log(currentApp.app_acronym)

    Application.updateApp(currentApp.app_acronym, currentnewApp).then(
      (response) => {
        console.log(response.data)
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

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setCurrentnewApp({ ...currentnewApp, [name]: value })
  }

  return (
    <div>
      <br />
      {currentApp ? (
        <div className="edit-selected-app">
          <h4>
            <b>App_acronym: {currentApp.app_acronym}</b>
          </h4>
          <br />
          <form>
            <div className="form-group">
              <h5>
                <b>Description: {currentApp.app_description} </b>
              </h5>
              <textarea id="app_description" name="app_description" onChange={handleInputChange}></textarea>
              <br />
              <h5 aria-readonly>
                <b>Rnumber: {currentApp.app_Rnumber}</b>
              </h5>
              <input type="number" value={currentApp.app_Rnumber} disabled="true"></input>
              <h5>
                <b>Start Date: {currentApp.app_startDate} </b>
              </h5>
              <input type="date" id="app_startDate" name="app_startDate" onChange={handleInputChange}></input>
              <h5>
                <b>End Date: {currentApp.app_endDate}</b>
              </h5>
              <input type="date" id="app_endDate" name="app_endDate" onChange={handleInputChange}></input>
              <h5>
                <b>Permit Open: {currentApp.app_permit_Open} </b>
              </h5>
              <select id="app_permit_Open" name="app_permit_Open" onChange={handleInputChange}>
                <option></option>
                {usergroups.map((item) => (
                  <option>{item}</option>
                ))}
              </select>
              <h5>
                <b>To Do List: {currentApp.app_permit_toDoList}</b>
              </h5>
              <select id="app_permit_toDoList" name="app_permit_toDoList" onChange={handleInputChange}>
                <option></option>
                {usergroups.map((item) => (
                  <option>{item}</option>
                ))}
              </select>
              <h5>
                <b>Permit Doing: {currentApp.app_permit_Doing} </b>
              </h5>
              <select id="app_permit_Doing" name="app_permit_Doing" onChange={handleInputChange}>
                <option></option>
                {usergroups.map((item) => (
                  <option>{item}</option>
                ))}
              </select>
              <h5>
                <b>Permit Done: {currentApp.app_permit_Done}</b>
              </h5>
              <select id="app_permit_Done" name="app_permit_Done" onChange={handleInputChange}>
                <option></option>
                {usergroups.map((item) => (
                  <option>{item}</option>
                ))}
              </select>
              <h5>
                <b>Permit Create: {currentApp.app_permit_Create} </b>
              </h5>
              <select id="app_permit_Create" name="app_permit_Create" onChange={handleInputChange}>
                <option></option>
                {usergroups.map((item) => (
                  <option>{item}</option>
                ))}
              </select>
              {message && (
                <div className="form-group">
                  <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                    {message}
                  </div>
                </div>
              )}
            </div>
            <button style={{ width: "110px", height: "33px", borderRadius: "10px", fontSize: "18px", marginRight: "20px", backgroundColor: "lightgreen" }} onClick={() => navigate("/application")}>
              Back
            </button>
            <button style={{ width: "110px", height: "33px", borderRadius: "10px", fontSize: "16px", backgroundColor: "lightblue" }} className="ml-20" onClick={(e) => updateApp(e)}>
              Update App
            </button>
          </form>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click an app...</p>
        </div>
      )}
    </div>
  )
}

export default EditApp
