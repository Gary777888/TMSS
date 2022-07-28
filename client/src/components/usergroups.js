import React, { useState, useEffect, useRef, useMemo } from "react"
import { useTable } from "react-table"
import UserGroups from "../services/usergroups.service"

const UsergroupList = () => {
  const [usergroups, setusergroups] = useState([])
  const [status, setStatus] = useState(false)
  const [usergroupstate, setusergroupstate] = useState("")
  const [name, setname] = useState("")
  const [message, setMessage] = useState("")
  const [successful, setSuccessful] = useState(false)

  const usergroupsRef = useRef()

  usergroupsRef.current = usergroups

  useEffect(() => {
    retrieveusergroups()
  }, [])

  const retrieveusergroups = () => {
    UserGroups.getUsergroups()
      .then((response) => {
        setusergroups(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const onChangeName = (e) => {
    const name = e.target.value
    setname(name)
  }

  const onChangeStatus = (e) => {
    const { name, value } = e.target
    setStatus(true)
    setusergroupstate({ ...usergroupstate, [name]: value })
  }

  const handleCreate = (req, res) => {
    UserGroups.newUsergroup(name, status).then(
      (response) => {
        setSuccessful(true)
        setMessage(response.data.message)
        setTimeout(function () {
          window.location.reload()
        }, 3000)
      },
      (error) => {
        const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        setMessage(resMessage)
        setSuccessful(false)
      }
    )
  }

  const columns = useMemo(
    () => [
      {
        Header: "Index",
      },

      {
        Header: "Name",
        accessor: "name",
      },

      {
        Header: "Status",
        accessor: "status",
      },

      {
        Header: "Actions",
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: usergroups,
  })

  const updateStatus = (name) => {
    setSuccessful(false)
    UserGroups.updatestatus(name, usergroupstate)
      .then((response) => {
        setMessage(response.data.message)
        setSuccessful(true)
        setTimeout(function () {
          window.location.reload()
        }, 3000)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group" style={{ justifyContent: "center", alignItems: "center", width: "140%" }}>
          <br /> <br />
          <h5 className="pr-2">Create usergroup: </h5>
          <input className="mr-2 " name="name" onChange={onChangeName}></input>
          <button className="ml-10" onClick={handleCreate}>
            Create usergroup
          </button>
        </div>
        {message && (
          <div className="form-group">
            <div className={successful ? "alert alert-success" : "alert alert-danger"} style={{ justifyContent: "center", width: "155%" }} role="alert">
              {message}
            </div>
          </div>
        )}
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
            {usergroups.map((doc, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{doc.name}</td>
                  <td>{doc.status}</td>
                  <td>
                    <select id="status" name="status" onChange={(e) => onChangeStatus(e)}>
                      <option> </option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <button className="ml-2" onClick={() => updateStatus(doc.name)}>
                      Update
                    </button>
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

export default UsergroupList
