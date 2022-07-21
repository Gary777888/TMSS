import axios from "axios"
import authHeader from "./auth-header"
const API_URL = "http://localhost:2000/api/"

const createApp = (app_acronym, app_description, app_Rnumber, app_startDate, app_endDate, app_permit_Open, app_permit_toDoList, app_permit_Doing, app_permit_Done, app_permit_Create) => {
  return axios.post(
    API_URL + "createApp/",
    {
      app_acronym,
      app_description,
      app_Rnumber,
      app_startDate,
      app_endDate,
      app_permit_Open,
      app_permit_toDoList,
      app_permit_Doing,
      app_permit_Done,
      app_permit_Create,
    },
    { headers: authHeader() }
  )
}

const getSelectedEditApp = (app_acronym) => {
  return axios.get(API_URL + `application/editApp/${app_acronym}`)
}

const getSelectedViewApp = (app_acronym) => {
  return axios.get(API_URL + `application/viewApp/${app_acronym == "undefined" ? localStorage.getItem("selectedApplication") : app_acronym}`)
}

const getallapplications = () => {
  return axios.get(API_URL + "application")
}

const updateApp = (app_acronym, data) => {
  return axios.put(API_URL + `application/${app_acronym}`, data)
}

const Application = {
  createApp,
  getallapplications,
  getSelectedEditApp,
  updateApp,
  getSelectedViewApp,
}

export default Application
