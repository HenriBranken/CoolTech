import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import css from "./AdminEdit.module.css";

/*
This is the component that is rendered when an Admin wants to tweak
the settings of an Employee.
*/

const AdminEdit = () => {
  const [Username, setUsername] = useState(""); // The Username of the Employee.
  const [Division_IDs, setDivision_IDs] = useState([]); // The Division IDs of the Employee.
  const [theAdminsDivisionIds, setTheAdminsDivisionIds] = useState([]); // Pertaining to the Admin.
  const [Role, setRole] = useState(""); // The role of the Employee.
  const [corpDivisionList, setCorpDivisionList] = useState([]); // All divisions possible in CoolTech.

  // Used to redirect the user to a different page.
  const navigate = useNavigate();

  // Fetch the `employeeId` parameter from the URL. It should be a long string.
  const { employeeId } = useParams();

  // Based on the `employeeId` parameter, fetch data about the employee, and update the some state.
  const getEmployee = async (employeeId) => {
    const response = await axios.get(`/employee/employeeDetails/${employeeId}`);
    const responseData = response.data;
    setUsername(responseData.Username); // [1]
    setRole(responseData.Role); // [2]

    const list = [];
    responseData.Division_IDs.forEach((divId) => {
      list.push(divId.toString());
    });
    setDivision_IDs(list); // [3]
  };

  const getCorpDivisions = async () => {
    const response = await axios.get("/data/divisionData");
    const responseData = response.data;
    setCorpDivisionList(responseData);
  };

  const getTheAdminsDivisionIds = async () => {
    const response = await axios.get(`/employee/adminDetails`);
    const responseData = response.data;

    const adminList = [];
    responseData.Division_IDs.forEach((divId) => {
      adminList.push(divId.toString());
    });
    setTheAdminsDivisionIds(adminList); // [3]
  };

  // When the page mounts:
  useEffect(() => {
    getEmployee(employeeId);
    getCorpDivisions();
    getTheAdminsDivisionIds();
  }, []);

  // A Tick Event is when a checkbox is selected OR deselected.
  const handleTick = (event) => {
    const { value, checked } = event.target;
    console.log(`${value} is ${checked}`);

    // Case 1:  The user checks the Box:
    // Add the corresponding Division ID to the `Division_IDs`.
    if (checked) {
      setDivision_IDs([...Division_IDs, value]);
    }

    // Case 2: The user unchecks the Box:
    // Remove the corresponding Division ID to the `Division_IDs`.
    else {
      setDivision_IDs(Division_IDs.filter((element) => element !== value));
    }
  };

  console.log("Division_IDs, ", Division_IDs);
  console.log("Role, ", Role);
  console.log("theAdminsDivisionIds, ", theAdminsDivisionIds);

  // The PATCH request to Update the Employee.
  // The only stuff needed in the `req.body` Payload is the `Role` and `Division_IDs`.
  const updateEmployee = async (employeeId, Role, Division_IDs) => {
    let response = await axios.patch(`/employee/${employeeId}`, {
      Role,
      Division_IDs,
    });
    console.log(response); // QA

    // Notify the user that the Update was a success.
    toast.success("Successfully configured the Employee Data.");
    // After waiting 750 milliseconds, navigate back to the "Home" page.
    setTimeout(() => {
      navigate("/admin"); // "/admin" is the <AdminPage /> page.
    }, 750);
  };

  // Executed when the <form> is submitted.
  const handleFormSubmit = (event) => {
    event.preventDefault();
    try {
      // Ensure that ALL fields are populated with data as they should be.
      if (!Role || !Division_IDs) {
        toast.warning(
          "Please configure both the `Divisions` and `Role` of the user."
        );
        // If the `state` is not empty, update the Employee via PATCH request.
      } else {
        updateEmployee(employeeId, Role, Division_IDs);
      }
    } catch (error) {
      console.log(error);
      toast(error);
    }
  };

  // The Form Components.
  return (
    <>
      <div className={css["form-container"]}>
        <form onSubmit={handleFormSubmit}>
          {/* Describe the Username inside the <h3> */}
          <h3>
            Configure Divisions for <u>{Username}</u>:
          </h3>
          {/* Map out ALL possible divisions in CoolTech. */}
          {corpDivisionList.map((elem) => {
            return (
              <div className={css["checkbox"]} key={elem.divisionId}>
                <input
                  type="checkbox"
                  name="divisions"
                  value={elem.divisionId}
                  // Default check the Intial Divisions of the Employee
                  defaultChecked={Division_IDs.includes(elem.divisionId)}
                  onChange={handleTick}
                />
                <label
                  // Highlight the Division Label IF it is part of the Admin's Divisions
                  className={
                    theAdminsDivisionIds.includes(elem.divisionId)
                      ? css["inclusive"]
                      : ""
                  }
                >
                  &nbsp;&nbsp;{elem.division}
                </label>
              </div>
            );
          })}
          {/* Decide between `normal`, `management`, `admin`. */}
          <h3>Configure User Role:</h3>
          <div className={css["radio-btn"]}>
            <label>
              <input
                type="radio"
                name="role"
                id="role"
                value="normal"
                checked={Role === "normal"}
                onChange={(e) => setRole(e.target.value)}
              />
              &nbsp;&nbsp;Normal
            </label>
          </div>
          <div className={css["radio-btn"]}>
            <label>
              <input
                type="radio"
                name="role"
                id="role"
                value="management"
                checked={Role === "management"}
                onChange={(e) => setRole(e.target.value)}
              />
              &nbsp;&nbsp;Management
            </label>
          </div>
          <div className={css["radio-btn"]}>
            <label>
              <input
                type="radio"
                name="role"
                id="role"
                value="admin"
                checked={Role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              &nbsp;&nbsp;Admin
            </label>
          </div>
          <button className={css["submit-btn"]} type="submit">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminEdit;
