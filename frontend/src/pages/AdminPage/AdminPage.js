import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";

import css from "./AdminPage.module.css";

// This is the component only available to Admins in CoolTech.
// It renders when the user clicks on the `Admin` Tab on the Home Screen.

const AdminPage = () => {
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getRole, role } = useContext(AuthContext);

  /*
  `getAdminData` grabs an Employee (from the Employee Collection)
  IF one of the Employee's Divisions COINCIDES with the Divisions of the Admin User.
  In this sense, the Admin user can see all the employees belonging to his Divisions.
  */
  const getAdminData = async () => {
    setLoading(true);
    let response = await axios.get("/resources/getAdminData");
    let responseData = response.data;
    setAdminData(responseData);
    setLoading(false);
  };

  // When the component mounts, execute `getData()` to populate the table with appropriate data.
  useEffect(() => {
    getAdminData(); // This will set the `adminData` state, which will populate the table.
    getRole(); // To prevent a glitch when loading the page.
  }, []);

  return (
    <div className={css["table-container"]}>
      {loading && <Loader></Loader>}
      {!loading && role === "admin" && (
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Username</th>
              <th>Divisions</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Map out all the Employees. */}
            {adminData &&
              adminData.map((item) => {
                return (
                  <tr key={item.employeeId}>
                    <td className={css["codeCell"]}>{item.employeeId}</td>
                    <td>{item.username}</td>
                    <td>{item.divisions}</td>
                    <td>{item.role}</td>
                    <td>
                      {/* Navigate to the `AdminEdit` component when the Admin clicks on "Edit" */}
                      <Link to={`/admin/${item.employeeId}`}>
                        <button className={css["edit-btn"]}>Edit</button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
