import React, { useState, useEffect, useRef, useMemo } from "react"
import Application from "../services/application.service"
import AuthService from "../services/auth.service"
import UserManagement from "../services/usermanagement.service"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useTable } from "react-table"
import { useNavigate } from "react-router"
import App from "../App"
import Plans from "../services/plan.service"
import Task from "../services/task.service"

const CreateTask = () => {
  const navigate = useNavigate()
  const { app_acronym } = useParams()
  const [task_name, setTask_name] = useState("")
  const [task_description, setTask_description] = useState("")
  const [task_notes, setTask_notes] = useState("")
  const [task_plan, setTask_plan] = useState("")
  const [task_state, setTask_state] = useState("")
  const [task_creator, setTask_creator] = useState(AuthService.getCurrentUser().username)
  const [task_owner, setTask_owner] = useState(AuthService.getCurrentUser().username)
  const [task_createDate, setTask_createDate] = useState("")
  const [message, setMessage] = useState("")
  const [successful, setSuccessful] = useState(false)
  const [plans, setplans] = useState([])
  const [currentuser, setCurrentuser] = useState(AuthService.getCurrentUser())

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    setCurrentuser(user)
    getAllPlans()
  }, [])

  const getAllPlans = () => {
    Plans.getallplans(app_acronym)
      .then((response) => {
        const plans = []
        for (let i = 0; i < response.data.length; i++) {
          plans.push(response.data[i].plan_MVP_name)
        }
        setplans(plans)
        // setCurrentNewUser(response.data)
        // planstatus(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const onChangeTask_name = (e) => {
    const task_name = e.target.value
    setTask_name(task_name)
  }

  const onChangeTask_description = (e) => {
    const task_description = e.target.value
    setTask_description(task_description)
  }

  const onChangeTask_notes = (e) => {
    const task_notes = e.target.value
    setTask_notes(task_notes)
  }

  const onChangeTask_plan = (e) => {
    const task_plan = e.target.value
    setTask_plan(task_plan)
  }

  const onChangeTask_creator = (e) => {
    const task_creator = currentuser.username
    setTask_creator(task_creator)
  }

  const onChangeTask_owner = (e) => {
    const task_owner = currentuser.username

    setTask_owner(task_owner)
  }

  const handleCreatePlan = (req, res) => {
    setMessage("")
    setSuccessful(false)
    if (task_name === "") {
      alert("Task name cannot be empty.")
    } else {
      Task.createTask(task_name, task_description, task_notes, task_plan, app_acronym, task_creator, task_owner).then(
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
        <h1 style={{ backgroundColor: "lightblue", height: "50px" }}>Create Task</h1>
        <h3>App Acronym: </h3>

        <div>
          <h4>Task Name</h4>
          <input value={task_name} onChange={onChangeTask_name}></input>
          <h4>Task Description</h4>
          <textarea value={task_description} onChange={onChangeTask_description}></textarea>
          {/* <h4>Task Notes</h4>
          <input value={task_notes} onChange={onChangeTask_notes}></input> */}
          <h4>Task Plan</h4>
          <select value={task_plan} onChange={onChangeTask_plan}>
            <option></option>
            {plans.map((item) => (
              <option>{item}</option>
            ))}
          </select>
          <h4>Task App Acronym</h4>
          <input value={app_acronym} disabled="true"></input>
          <h4>Task Creator</h4>
          <input value={currentuser.username} onChange={onChangeTask_creator} disabled="true"></input>
          <h4>Task Owner</h4>
          <input value={currentuser.username} onChange={onChangeTask_owner} disabled="true"></input>
          <br />
          <br />
          <button style={{ width: "100px", backgroundColor: "lightgreen", marginRight: "25px", borderRadius: "10px", fontSize: "16px" }} onClick={() => navigate("/application/viewApp/" + app_acronym)}>
            Back
          </button>
          <button style={{ width: "100px", backgroundColor: "lightblue", borderRadius: "10px", fontSize: "16px" }} onClick={handleCreatePlan}>
            Create Task
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

export default CreateTask
