import React, { useState, useEffect, useRef, useMemo } from "react"
import Application from "../services/application.service"
import AuthService from "../services/auth.service"
import UserManagement from "../services/usermanagement.service"
import { useTable } from "react-table"
import { useNavigate } from "react-router"

const ApplicatonList = () => {
  const navigate = useNavigate()
  const [application, setApplication] = useState([])
  const [showProjectLeader, setshowProjectLeader] = useState(false)
  const [currentUser, setCurrentUser] = useState(undefined)

  const applicationRef = useRef()

  applicationRef.current = application

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    retrieveapplications()
    if (user) {
      setCurrentUser(user)
      UserManagement.get(user.username).then((response) => {
        setshowProjectLeader(response.data.usergroup.includes("project leader"))
      })
    }
  }, [])

  const retrieveapplications = () => {
    Application.getallapplications()
      .then((response) => {
        setApplication(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  function handleView(app_acronym, doc) {
    localStorage.setItem("SelectedData", JSON.stringify(doc))
    localStorage.setItem("selectedApplication", app_acronym)
    console.log("ji", localStorage.getItem("usergroup"))

    navigate("/application/viewApp/" + app_acronym)
  }

  function handleEdit(app_acronym) {
    navigate("/application/editApp/" + app_acronym)
  }

  const columns = useMemo(
    () => [
      {
        Header: "Index",
      },

      {
        Header: "App Acronym",
        accessor: "app_acronym",
      },

      {
        Header: "Description",
        accessor: "app_description",
      },

      {
        Header: "Start Date",
        accessor: "app_startDate",
      },

      {
        Header: "End Date",
        accessor: "app_endDate",
      },

      {
        Header: "Open",
        accessor: "app_permit_Open",
      },

      {
        Header: "To Do List",
        accessor: "app_permit_toDoList",
      },

      {
        Header: "Doing",
        accessor: "app_permit_Doing",
      },

      {
        Header: "Done",
        accessor: "app_permit_Done",
      },

      {
        Header: "Create",
        accessor: "app_permit_Create",
      },

      {
        Header: "Actions",
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: application,
  })

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3" style={{ justifyContent: "center", alignItems: "center", width: "140%" }}></div>
      </div>
      <div className="col-md-12 list">
        <table className="table table-striped table-bordered" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {application.map((doc, index) => {
              return (
                <tr key={doc.app_acronym}>
                  <td>{index + 1}</td>
                  <td>{doc.app_acronym}</td>
                  <td>{doc.app_description}</td>
                  <td>{doc.app_startDate}</td>
                  <td>{doc.app_endDate}</td>
                  <td>{doc.app_permit_Open}</td>
                  <td>{doc.app_permit_toDoList}</td>
                  <td>{doc.app_permit_Doing}</td>
                  <td>{doc.app_permit_Done}</td>
                  <td>{doc.app_permit_Create}</td>
                  <td>
                    <button style={{ backgroundColor: "lightblue" }} onClick={(e) => handleView(doc.app_acronym, doc)}>
                      View
                    </button>
                    <br />
                    <br />
                    {showProjectLeader && (
                      <button style={{ width: "50px", backgroundColor: "lightgreen" }} onClick={(e) => handleEdit(doc.app_acronym)}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ApplicatonList
