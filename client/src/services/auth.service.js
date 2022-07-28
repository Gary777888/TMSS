import axios from "axios"
const API_URL = "http://localhost:2000/api/auth/"

const register = (username, email, password, usergroup) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
    usergroup,
  })
}

const login = (username, password) => {
  console.log("username: " + username, "\npassword: " + password)
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data))
        // console.log("res", response.data)
        localStorage.setItem("usergroup", response.data.usergroup)
      }
      return response.data
    })
}

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"))
}

const logout = () => {
  localStorage.removeItem("user")
}

const AuthService = {
  register,
  login,
  getCurrentUser,
  logout,
}
export default AuthService
