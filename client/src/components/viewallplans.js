import React, { useState, useEffect } from "react"
import Plans from "../services/plan.service"
import AuthService from "../services/auth.service"
import UserManagement from "../services/usermanagement.service"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useNavigate } from "react-router"

const Viewallplans = () => {
  const { app_acronym } = useParams()
  const { plan_MVP_name } = useParams()
  const navigate = useNavigate()
  const [plan, setPlan] = useState([])
  const [showProjectManager, setshowProjectManager] = useState(false)
  const [currentUser, setCurrentUser] = useState(undefined)

  // const planRef = useRef()

  // planRef.current = plan

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    retrieveplans()
    if (user) {
      setCurrentUser(user)
      UserManagement.get(user.username).then((response) => {
        setshowProjectManager(response.data.usergroup.includes("project manager"))
      })
    }
  }, [])

  const retrieveplans = () => {
    Plans.getallplans(app_acronym)
      .then((response) => {
        setPlan(response.data)
        console.log(plan)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  function handleEdit(plan_MVP_name) {
    navigate("/editPlan/" + plan_MVP_name)
  }

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3" style={{ justifyContent: "center", alignItems: "center", width: "140%" }}></div>
      </div>
      <div className="col-md-12 list">
        <table className="table table-striped table-bordered" /* {...getTableProps()} */>
          <thead>
            <tr>
              <th>Index</th>
              <th>Plan MVP name</th>
              <th>Plan Start Date</th>
              <th>Plan End Date</th>
              <th>Plan App Acronym</th>
              <th>Plan Description</th>
              {showProjectManager && <th>Action</th>}
            </tr>
          </thead>
          <tbody /* {...getTableBodyProps()} */>
            {plan.map((doc, index) => {
              return (
                <tr key={doc.plan_MVP_name}>
                  <td>{index + 1}</td>
                  <td>{doc.plan_MVP_name}</td>
                  <td>{doc.plan_startDate}</td>
                  <td>{doc.plan_endDate}</td>
                  <td>{doc.plan_app_acronym}</td>
                  <td>{doc.plan_description}</td>
                  {showProjectManager && (
                    <td>
                      <Link to={`/editPlan/${app_acronym}/${doc.plan_MVP_name}`}>
                        <button style={{ width: "50px", backgroundColor: "lightgreen" }}>Edit</button>
                      </Link>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
        <br />
        <button style={{ width: "80px", borderRadius: "10px", fontSize: "18px" }} onClick={() => navigate("/application/viewApp/" + app_acronym)}>
          Back
        </button>
      </div>
    </div>
  )
}

export default Viewallplans
