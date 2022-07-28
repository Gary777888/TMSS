import React, { useState, useEffect } from "react"
import Application from "../services/application.service"
import AuthService from "../services/auth.service"
import UserManagement from "../services/usermanagement.service"
import Task from "../services/task.service"
import { Link } from "react-router-dom"
import { useParams } from "react-router"

// import task component
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "./Card"

const ViewApp = () => {
  const { app_acronym } = useParams()
  const [currentApp, setCurrentApp] = useState("")
  const [showProjectManager, setshowProjectManager] = useState(false)
  const [showProjectLeader, setshowProjectLeader] = useState(false)
  const [tasks, setTasks] = useState([])
  const [group, setGroup] = useState(localStorage.getItem("usergroup").split(","))
  useEffect(() => {
    const user = AuthService.getCurrentUser()
    getApplication(app_acronym)
    retrievetasks(app_acronym)
    if (user) {
      setCurrentApp(user)
      UserManagement.get(user.username).then((response) => {
        setshowProjectManager(response.data.usergroup.includes("project manager"))
        setshowProjectLeader(response.data.usergroup.includes("project leader"))
      })
    }
  }, [])

  const getApplication = async (app_acronym) => {
    await Application.getSelectedViewApp(app_acronym)
      .then((response) => {
        setCurrentApp(response.data)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const retrievetasks = () => {
    Task.getalltasks(app_acronym)
      .then((response) => {
        setTasks(response.data)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }
  return (
    <div>
      {currentApp ? (
        <div style={{ backgroundColor: "rgb(247 247 248)" }} className="view-selected-app">
          <div style={{ fontSize: "34px", borderRadius: "10px" }}>
            <b>App_acronym: {currentApp.app_acronym}</b>
            {group.includes(currentApp.app_permit_Create) && (
              <Link to={`/createTask/${app_acronym}`}>
                <button style={{ width: "200px", borderRadius: "10px", height: "45px", float: "left", backgroundColor: "lightpink", fontSize: "30px" }}>Create Task</button>
              </Link>
            )}
            <Link to={`/viewPlans/${app_acronym}`}>
              <button style={{ width: "200px", borderRadius: "10px", height: "45px", float: "right", backgroundColor: "lightgreen", fontSize: "30px" }}>View Plans</button>
            </Link>
            {group.includes("project manager") && (
              <Link to={`/createPlan/${app_acronym}`}>
                <button style={{ width: "200px", borderRadius: "10px", height: "45px", float: "right", backgroundColor: "lightblue", fontSize: "30px" }}>Create Plan</button>
              </Link>
            )}
            <br />
            <div style={{ border: "2px solid red", borderColor: "red" }}>
              <Container>
                <Row>
                  <Col>Open</Col>
                  <Col>To Do</Col>
                  <Col>Doing</Col>
                  <Col>Done</Col>
                  <Col>Close</Col>
                </Row>
              </Container>
            </div>
            <div>
              <Container>
                <Row>
                  <Col>
                    {tasks
                      .filter((taskList) => taskList.task_state === "Open")
                      .map((tasks) => {
                        return (
                          <div>
                            <Card data={tasks} setCurrentApp={setCurrentApp} showedit={group.includes(currentApp.app_permit_Open) ? true : false} showLeft={false} showRight={group.includes(currentApp.app_permit_Open) ? true : false} />
                          </div>
                        )
                      })}
                  </Col>
                  <Col>
                    {tasks
                      .filter((taskList) => taskList.task_state === "To Do")
                      .map((tasks) => {
                        return <Card data={tasks} setCurrentApp={setCurrentApp} showedit={group.includes(currentApp.app_permit_toDoList) ? true : false} showRight={group.includes(currentApp.app_permit_toDoList) ? true : false} />
                      })}
                  </Col>
                  <Col>
                    {tasks
                      .filter((taskList) => taskList.task_state === "Doing")
                      .map((tasks) => {
                        return <Card data={tasks} setCurrentApp={setCurrentApp} showedit={group.includes(currentApp.app_permit_Doing) ? true : false} showRight={group.includes(currentApp.app_permit_Doing) ? true : false} showLeft={group.includes(currentApp.app_permit_Doing) ? true : false} />
                      })}
                  </Col>
                  <Col>
                    {tasks
                      .filter((taskList) => taskList.task_state === "Done")
                      .map((tasks) => {
                        return <Card data={tasks} setCurrentApp={setCurrentApp} showedit={group.includes(currentApp.app_permit_Done) ? true : false} showRight={group.includes(currentApp.app_permit_Done) ? true : false} showLeft={group.includes(currentApp.app_permit_Done) ? true : false} />
                      })}
                  </Col>
                  <Col>
                    {tasks
                      .filter((taskList) => taskList.task_state === "Close")
                      .map((tasks) => {
                        return <Card data={tasks} setCurrentApp={setCurrentApp} />
                      })}
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
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

export default ViewApp
