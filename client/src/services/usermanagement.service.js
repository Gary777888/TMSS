import axios from "axios"
const API_URL = "http://localhost:2000/api/"

const getAll = () => {
  return axios.get(API_URL + "usermanagement")
}

const get = (username) => {
  return axios.get(API_URL + `edituser/${username}`)
}

const update = (username, data) => {
  return axios.put(API_URL + `edituser/${username}`, data)
}

const getallusergroups = () => {
  return axios.get(API_URL + `allusersgroup`)
}

const profile = (username) => {
  return axios.get(API_URL + `profile/${username}`)
}

const getprofile = (username) => {
  console.log(API_URL + `profile/editprofile/${username}`)
  return axios.get(API_URL + `profile/editprofile/${username}`)
}

const updateprofile = (username, data) => {
  return axios.put(API_URL + `profile/editprofile/${username}`, data)
}

const newusergroup = (name, status) => {
  return axios.post(API_URL + "usermanagement/usergroup", {
    name,
    status,
  })
}

const UserManagement = {
  getAll,
  get,
  update,
  getallusergroups,
  profile,
  getprofile,
  updateprofile,
  newusergroup,
}

export default UserManagement
