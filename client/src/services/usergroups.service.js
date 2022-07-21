import axios from "axios"
const API_URL = "http://localhost:2000/api/"

const getUsergroups = () => {
  return axios.get(API_URL + "usergroups")
}

const newUsergroup = (name, status) => {
  return axios.post(API_URL + "usergroup", {
    name,
    status,
  })
}

const updatestatus = (name, data) => {
  return axios.put(API_URL + `${name}`, data)
}

const UserGroups = {
  getUsergroups,
  newUsergroup,
  updatestatus,
}

export default UserGroups
