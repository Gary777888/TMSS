import React, { useState, useEffect, useRef, useMemo } from "react"
import Application from "../services/application.service"
import AuthService from "../services/auth.service"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useTable } from "react-table"
import { useNavigate } from "react-router"
import App from "../App"
import Plan from "../services/plan.service"

const CreatePlan = () => {
  const navigate = useNavigate()
  const { app_acronym } = useParams()
  const [plan_MVP_name, setPlan_MVP_name] = useState("")
  const [plan_startDate, setPlan_startDate] = useState("")
  const [plan_endDate, setPlan_endDate] = useState("")
  const [plan_app_acronym, setPlan_app_acronym] = useState("")
  const [plan_description, setPlan_description] = useState("")
  const [message, setMessage] = useState("")
  const [successful, setSuccessful] = useState(false)

  const onChangePlan_MVP_name = (e) => {
    const plan_MVP_name = e.target.value
    setPlan_MVP_name(plan_MVP_name)
  }

  const onChangePlan_startDate = (e) => {
    const plan_startDate = e.target.value
    setPlan_startDate(plan_startDate)
  }

  const onChangePlan_endDate = (e) => {
    const plan_endDate = e.target.value
    setPlan_endDate(plan_endDate)
  }

  const onChangePlan_description = (e) => {
    const plan_description = e.target.value
    setPlan_description(plan_description)
  }

  const handleCreatePlan = (req, res) => {
    setMessage("")
    setSuccessful(false)
    if (plan_MVP_name === "") {
      alert("Plan MVP name cannot be empty.")
    } else {
      Plan.createPlan(plan_MVP_name, plan_startDate, plan_endDate, app_acronym, plan_description).then(
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
        <h1 style={{ backgroundColor: "lightblue", height: "50px" }}>Create Plan</h1>
        <div>
          <h4>Plan MVP name</h4>
          <input onChange={onChangePlan_MVP_name}></input>
          <h4>Plan Start Date</h4>
          <input type="date" onChange={onChangePlan_startDate}></input>
          <h4>Plan End Date</h4>
          <input type="date" onChange={onChangePlan_endDate}></input>
          <h4>Plan App Acronym</h4>
          <input value={app_acronym} disabled="true"></input>
          <h4>Plan Description</h4>
          <textarea onChange={onChangePlan_description}></textarea>
          <br />
          <br />
          <button style={{ width: "100px", backgroundColor: "lightgreen", marginRight: "25px", borderRadius: "10px", fontSize: "16px" }} onClick={() => navigate("/application/viewApp/" + app_acronym)}>
            Back
          </button>
          <button style={{ width: "100px", backgroundColor: "lightblue", borderRadius: "10px", fontSize: "16px" }} onClick={handleCreatePlan}>
            Create Plan
          </button>

          {message && (
            <div className="form-group">
              <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                {message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreatePlan
