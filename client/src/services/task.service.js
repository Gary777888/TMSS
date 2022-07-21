import axios from "axios"
import authHeader from "./auth-header"
const API_URL = "http://localhost:2000/api/"

const createTask = (task_name, task_description, task_notes, task_plan, app_acronym, task_creator, task_owner) => {
  console.log(task_creator, "FRONT END CREATOR 2")
  return axios.post(API_URL + `createTask/${app_acronym}`, {
    task_name,
    task_description,
    task_notes,
    task_plan,
    app_acronym,
    task_creator,
    task_owner,
  })
}

const getalltasks = (app_acronym) => {
  return axios.get(API_URL + `viewTasks/${app_acronym}`)
}

const forwardTask = (task) => {
  return axios.put(API_URL + `updateTask/forwardTask`, {
    task,
  })
}

const reverseTask = (task) => {
  return axios.put(API_URL + `updateTask/reverseTask`, {
    task,
  })
}

const editselectedTask = (data) => {
  return axios.put(API_URL + "updateTask/editTask", data)
}

const getallprojectleaders = () => {
  return axios.get(API_URL + "viewUser/allprojectleaders")
}

const Task = {
  createTask,
  getalltasks,
  forwardTask,
  reverseTask,
  editselectedTask,
  getallprojectleaders,
}

export default Task
