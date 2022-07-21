import React, { useState, useEffect, useRef, useMemo } from "react"
import { FaRegEdit, FaAngleDoubleRight, FaAngleDoubleLeft, FaEye } from "react-icons/fa"
import Task from "../services/task.service"
import Plans from "../services/plan.service"
import { useParams } from "react-router"
import Application from "../services/application.service"
import AuthService from "../services/auth.service"

// Import pop up form
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

const Card = (props) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [successful, setSuccessful] = useState(false)
  const [plans, setplans] = useState([])
  const { app_acronym } = useParams()

  const [task_description, setDescription] = useState("")
  const [task_plan, setTaskPlan] = useState("")
  const [task_notes, setTaskNotes] = useState("")
  const task_owner = JSON.parse(window.localStorage.getItem("user")).username
  const [openView, setOpenView] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleViewOpen = () => {
    setOpenView(true)
  }

  const handleViewClose = () => {
    setOpenView(false)
  }

  useEffect(() => {
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

  const updateTask = async (e, data) => {
    e.preventDefault()
    const task = {
      task_id: data.task_id,
      task_description: task_description,
      task_plan: task_plan,
      task_owner: task_owner,
      task_notes: task_notes,
    }
    Task.editselectedTask(task).then(
      (response) => {
        console.log(response.data)
        setSuccessful(true)
        setMessage(response.data.message)
        getApplication()
        handleClose()
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
  const getApplication = async (app_acronym) => {
    await Application.getSelectedViewApp(localStorage.getItem("selectedApplication"))
      .then((response) => {
        props.setCurrentApp(response.data)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const generatebutton = () => {
    let task_id = props.data.task_id
    let task_state = props.data.task_state
    console.log(task_id)
    const task = {
      task_id: props.data.task_id,
      task_notes: task_notes,
      task_owner: task_owner,
      task_state: task_state,
    }
    if (task_state === "Open") {
      {
        return (
          props.showRight && (
            <button>
              <FaAngleDoubleRight
                onClick={() => {
                  Task.forwardTask(task)
                  window.location.reload()
                }}
              />
            </button>
          )
        )
      }
    } else if (task_state === "To Do") {
      {
        return (
          props.showRight && (
            <button>
              <FaAngleDoubleRight
                onClick={() => {
                  Task.forwardTask(task)
                  window.location.reload()
                }}
              />
            </button>
          )
        )
      }
    } else if (task_state === "Doing") {
      return (
        <>
          {props.showLeft && (
            <button>
              <FaAngleDoubleLeft
                onClick={() => {
                  Task.reverseTask(task)
                  window.location.reload()
                }}
              />
            </button>
          )}
          {props.showRight && (
            <button>
              <FaAngleDoubleRight
                onClick={() => {
                  Task.forwardTask(task)
                  window.location.reload()
                }}
              />
            </button>
          )}
        </>
      )
    } else if (task_state === "Done") {
      return (
        <>
          {props.showLeft && (
            <button>
              <FaAngleDoubleLeft
                onClick={() => {
                  Task.reverseTask(task)
                  window.location.reload()
                }}
              />
            </button>
          )}
          {props.showRight && (
            <button>
              <FaAngleDoubleRight
                onClick={() => {
                  Task.forwardTask(task)
                  window.location.reload()
                }}
              />
            </button>
          )}
        </>
      )

      // <FaAngleDoubleRight
      //   onClick={() => {
      //     Task.forwardTask(task)
      //     window.location.reload()
      //   }}
      // />

      //  <button>
      //     <FaAngleDoubleLeft
      //       onClick={() => {
      //         Task.reverseTask(task)
      //         window.location.reload()
      //       }}
      //     />
      //     <FaAngleDoubleRight
      //       onClick={() => {
      //         Task.forwardTask(task)
      //         window.location.reload()
      //       }}
      //     />
      //   </button>
    }
  }
  console.log(props.showRight)
  return (
    <div className="cardContainer">
      <div className="cardHeader"> Task name: {props.data.task_name}</div>
      {/* <div className="cardContent">
        <p> Description: {props.data.task_description}</p>
        <p> Plan: {props.data.task_plan}</p>
        <p> App_acronym: {props.data.task_app_acronym} </p>
      </div> */}
      <div className="cardFooter">
        {/* creator: {props.data.task_creator}
        <p> State: {props.data.task_state}</p> */}
        <p>Owner: {props.data.task_owner}</p>
        {/* <p>Create Date: {props.data.task_createDate}</p>
        <div>
          Notes:
          <p className="scrollableContainer">{props.data.task_notes}</p>
        </div> */}
        {props.showedit && (
          <Button className="cardIcn" onClick={handleClickOpen}>
            <FaRegEdit color="black" fontSize="1.5em" />
          </Button>
        )}
        <Button className="cardIcn" onClick={handleViewOpen}>
          <FaEye color="black" fontSize="1.5em" />
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <div className="formSection">
              <label>Task description: </label>
              <p className="labelSection"> {props.data.task_description}</p>
            </div>
            <textarea id={props.data.task_description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <div className="formSection">
              <label>Task plan: </label>
              <p className="labelSection"> {props.data.task_plan}</p>
            </div>
            <select id={props.data.task_plan} onChange={(e) => setTaskPlan(e.target.value)}>
              <option></option>
              {plans.map((item) => (
                <option>{item}</option>
              ))}
            </select>
            <div className="formSection">
              <label>Task note: </label>
              <pre className="labelSection" style={{ overflow: "scroll" }}>
                {" "}
                {props.data.task_notes}
              </pre>
              <textarea id={props.data.task_notes} onChange={(e) => setTaskNotes(e.target.value)}></textarea>
            </div>
            {message && (
              <div className="form-group">
                <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                  {message}
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={(e) => updateTask(e, props.data)}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>

      <Dialog open={openView} onClose={handleViewClose}>
        <DialogTitle>View Task</DialogTitle>
        <DialogContent>
          <div className="formSection">
            <label>Task id: </label>
            <p className="labelSection"> {props.data.task_id}</p>
          </div>
          <div className="formSection">
            <label>Task name: </label>
            <p className="labelSection"> {props.data.task_name}</p>
          </div>
          <div className="formSection">
            <label>Task description: </label>
            <p className="labelSection"> {props.data.task_description}</p>
          </div>
          <div className="formSection">
            <label>Task plan: </label>
            <p className="labelSection"> {props.data.task_plan}</p>
          </div>
          <div className="formSection">
            <label>Task App acronym: </label>
            <p className="labelSection"> {props.data.task_app_acronym}</p>
          </div>
          <div className="formSection">
            <label>Current State: </label>
            <p className="labelSection"> {props.data.task_state}</p>
          </div>
          <div className="formSection">
            <label>Task creator: </label>
            <p className="labelSection"> {props.data.task_creator}</p>
          </div>
          <div className="formSection">
            <label>Last edited by: </label>
            <p className="labelSection"> {props.data.task_owner}</p>
          </div>
          <div className="formSection">
            <label>Task note: </label>
            <pre className="labelSection" style={{ overflow: "scroll" }}>
              {" "}
              {props.data.task_notes}
            </pre>
          </div>
          {message && (
            <div className="form-group">
              <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                {message}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Okay</Button>
        </DialogActions>
      </Dialog>

      <div className="actionSection">
        {props.showLeft && (
          <button>
            <FaAngleDoubleLeft
              onClick={() => {
                Task.reverseTask(props.data)
                window.location.reload()
              }}
            />
          </button>
        )}
        {props.showRight && (
          <button>
            <FaAngleDoubleRight
              onClick={() => {
                Task.forwardTask(props.data)
                window.location.reload()
              }}
            />
          </button>
        )}
      </div>
    </div>
  )
}

export default Card
