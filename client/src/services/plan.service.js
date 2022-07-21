import axios from "axios"
import authHeader from "./auth-header"
const API_URL = "http://localhost:2000/api/"

const createPlan = (plan_MVP_name, plan_startDate, plan_endDate, app_acronym, plan_description) => {
  return axios.post(
    API_URL + `createPlan/${app_acronym}`,
    {
      plan_MVP_name,
      plan_startDate,
      plan_endDate,
      app_acronym,
      plan_description,
    },
    { headers: authHeader() }
  )
}

const getallplans = (app_acronym) => {
  return axios.get(API_URL + `viewPlans/${app_acronym}`)
}

const getSelectedPlan = (app_acronym, plan_MVP_name) => {
  return axios.get(API_URL + `editPlan/${app_acronym}/${plan_MVP_name}`)
}

const updatePlan = (app_acronym, plan_MVP_name, data) => {
  return axios.put(API_URL + `editPlan/${app_acronym}/${plan_MVP_name}`, data)
}

const Plans = {
  createPlan,
  getallplans,
  getSelectedPlan,
  updatePlan,
}

export default Plans
