import React, { useState, useEffect, useRef, useMemo } from "react"
import UserManagement from "../services/usermanagement.service"
import { useTable } from "react-table"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"

const UsermanagementList = () => {
  const navigate = useNavigate()
  const [usermanagements, setusermanagements] = useState([])

  const usermanagementRef = useRef()

  usermanagementRef.current = usermanagements

  useEffect(() => {
    retrieveusermanagements()
  }, [])

  const retrieveusermanagements = () => {
    UserManagement.getAll()
      .then((response) => {
        setusermanagements(response.data)
        console.log(usermanagements)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  function handleEdit(username) {
    navigate("/edituser/" + username)
  }

  const columns = useMemo(
    () => [
      {
        Header: "Index",
      },

      {
        Header: "Username",
        accessor: "username",
      },

      {
        Header: "Email",
        accessor: "email",
      },

      {
        Header: "Usergroup",
        accessor: "usergroup",
      },

      {
        Header: "Status",
        accessor: "status",
      },

      {
        Header: "Actions",
        // accessor: "actions",
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: usermanagements,
  })

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3" style={{ justifyContent: "center", alignItems: "center", width: "140%" }}>
          <br />
        </div>
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
            {usermanagements.map((doc, index) => {
              return (
                <tr key={doc.username}>
                  <td>{index + 1}</td>
                  <td>{doc.username}</td>
                  <td>{doc.email}</td>
                  <td>{doc.usergroup}</td>
                  <td>{doc.status}</td>
                  <td>
                    <button onClick={(e) => handleEdit(doc.username)}>Edit User</button>
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

export default UsermanagementList
