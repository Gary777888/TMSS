import axios from "axios"
const API_URL = "http://localhost:2000/api/"

const getPublicContent = () => {
  return axios.get(API_URL + "home/allusers")
}

const UserService = {
  getPublicContent,
}
export default UserService
