import React, { useState, useEffect, useRef, useMemo } from "react"
import Plans from "../services/plan.service"
import AuthService from "../services/auth.service"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useTable } from "react-table"
import { useNavigate } from "react-router"
import App from "../App"

const EditPlan = () => {
  const { app_acronym } = useParams()
  const { plan_MVP_name } = useParams()
  const [message, setMessage] = useState("")
  const [successful, setSuccessful] = useState(false)
  const [currentApp, setCurrentApp] = useState("")
  const [currentnewApp, setCurrentnewApp] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    getPlan(app_acronym, plan_MVP_name)
  }, [])

  const getPlan = async (app_acronym, plan_MVP_name) => {
    await Plans.getSelectedPlan(app_acronym, plan_MVP_name)
      .then((response) => {
        setCurrentApp(response.data)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const updatePlan = async (e) => {
    e.preventDefault()
    console.log(currentApp.plan_MVP_name)

    Plans.updatePlan(currentApp.plan_app_acronym, currentApp.plan_MVP_name, currentnewApp).then(
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
            <b>Plan Mvp Name: {currentApp.plan_MVP_name}</b>
          </h4>
          <br />
          <form>
            <div className="form-group">
              <h5>
                <b>Plan Start Date: {currentApp.plan_startDate} </b>
              </h5>
              <input type="date" id="plan_startDate" name="plan_startDate" onChange={handleInputChange}></input>
              <h5>
                <b>Plan End Date: {currentApp.plan_endDate}</b>
              </h5>
              <input type="date" id="plan_endDate" name="plan_endDate" onChange={handleInputChange}></input>
              <h5>
                <b>Plan App acronym: {currentApp.plan_app_acronym} </b>
              </h5>
              <input disabled="true" value={currentApp.plan_app_acronym}></input>
              <h5>
                <b>Plan Description: {currentApp.plan_description}</b>
              </h5>
              <textarea id="plan_description" name="plan_description" onChange={handleInputChange}></textarea>
              {message && (
                <div className="form-group">
                  <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                    {message}
                  </div>
                </div>
              )}
            </div>
            <button style={{ backgroundColor: "lightgreen", width: "100px", borderRadius: "10px", fontSize: "16px" }} onClick={() => navigate("/viewPlans/" + currentApp.plan_app_acronym)}>
              Back
            </button>
            <button style={{ backgroundColor: "lightblue", fontSize: "16px", borderRadius: "10px" }} className="ml-20" onClick={(e) => updatePlan(e)}>
              Update Plan
            </button>
          </form>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click a plan...</p>
        </div>
      )}
    </div>
  )
}

export default EditPlan
