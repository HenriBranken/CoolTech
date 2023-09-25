import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";
import axios from "axios";

import plus from "../../static/addIcon.png";
import wallpaper from "../../static/homepage.jpg";

import css from "./Home.module.css";

/*
The first page that renders when the site is visited.
If you're not logged in, a background wallpaper will display.
If you are logged in, Credential Data in a Table will be displayed.
*/

const Home = () => {
  const { loggedIn, role, getRole } = useContext(AuthContext);
  const [resourceData, setResourceData] = useState([]); // The Credential Data.
  const [loading, setLoading] = useState(false);

  // Fetch data from the `Credentials` Collection, and filter by the user who is logged in.
  const getData = async () => {
    setLoading(true);
    let response = await axios.get("/resources/getPlaces");
    let responseData = response.data;
    setResourceData(responseData);
    setLoading(false);
  };

  // When the component mounts, execute `getData()` to populate the table with appropriate data.
  // Execute `getRole()` to get the most updated `role` context value.
  useEffect(() => {
    if (loggedIn) {
      getData();
      getRole();
    }
  }, [loggedIn]);

  return (
    <div>
      {loggedIn === false && (
        <div>
          <img className={css["background"]} src={wallpaper} />
        </div>
      )}
      {loading && <Loader></Loader>}
      {!loading && loggedIn === true && (
        <>
          {/* Navigate to the Add.js page when clicking on the Plus icon. */}
          <Link to={"/add"}>
            <button className={css["plus-button"]} title="Add Credential">
              <img className={css["plus-image"]} src={plus}></img>
            </button>
          </Link>
          {/* Table showing the Credential Data */}
          <div className={css["table-container"]}>
            <table>
              <thead>
                <tr>
                  <th>Place ID</th>
                  <th>Division ID</th>
                  <th>Unit</th>
                  <th>Division</th>
                  <th>Place</th>
                  <th>Username</th>
                  <th>Password</th>
                  {/* Only Managers and Admins can make updates to a Credential */}
                  {(role === "management" || role === "admin") && (
                    <th>Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {resourceData &&
                  resourceData.map((item) => {
                    return (
                      <tr key={item.placeId}>
                        <td className={css["codeCell"]}>{item.placeId}</td>
                        <td className={css["codeCell"]}>{item.divisionId}</td>
                        <td>{item.unit}</td>
                        <td>{item.unitDivision}</td>
                        <td>{item.place}</td>
                        <td className={css["creds"]}>{item.username}</td>
                        <td className={css["creds"]}>{item.password}</td>
                        {/* Navigate to Update.js if the user clicks on "Edit" */}
                        {(role === "management" || role === "admin") && (
                          <td>
                            <Link to={`/update/${item.placeId}`}>
                              <button className={css["edit-btn"]}>Edit</button>
                            </Link>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
