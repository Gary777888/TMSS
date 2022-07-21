import React, { useState, useEffect } from "react"
import AuthService from "../services/auth.service"
import { Link } from "react-router-dom"
import UserManagement from "../services/usermanagement.service"
import { useParams } from "react-router"

const Profile = () => {
  const { username } = useParams()
  const [currentUser, setCurrentUser] = useState("")
  // const currentUser = UserManagement.get()
  // const currentUser = AuthService.getCurrentUser()

  useEffect(() => {
    getProfileUser(username)
  }, [])

  const getProfileUser = async (username) => {
    await UserManagement.getprofile(username)
      .then((response) => {
        setCurrentUser(response.data)
        console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  // function handleEdit(username) {
  //   navigate("/profile/editprofile/" + username)
  // }

  // useEffect(() => {
  //   navigate(handleEdit(currentUser.username))
  // }, [])

  return (
    <div>
      {currentUser ? (
        <div className="container">
          <header className="jumbotron">
            <h3>
              <strong>{currentUser.username}</strong> Profile
            </h3>
          </header>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <strong>Usergroup:</strong> {currentUser.usergroup}
          <br /> <br /> <br />
          <Link to={`/editprofile/${currentUser.username}`}>
            <button>Edit Profile</button>
          </Link>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click a user...</p>
        </div>
      )}
    </div>
  )
}

export default Profile
