// src/components/Header/Header.js
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import css from "./Header.module.css";
import axios from "axios";

// This component is the Horizontal Banner at the Top of the Page.
// It displays all possible paths on the right-hand side.

const Header = () => {
  // By default the "Home" tab is the active tab.
  const [activeTab, setActiveTab] = useState("Home");
  const { getLoggedIn, getRole, loggedIn, role } = useContext(AuthContext);
  const [Username, setUsername] = useState(""); // The name of the Employee.

  // Get the username of the logged-in employee.
  const getUsername = async () => {
    const response = await axios.get("/employee/username");
    setUsername(response.data);
  };

  // Used for determining the pathnames in the address bar.
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // If the user manually alters the Route in the address bar,
    // we still want active tabs to behave properly.
    if (location.pathname === "/") {
      setActiveTab("Home");
    } else if (location.pathname === "/register") {
      setActiveTab("Register");
    } else if (location.pathname === "/login") {
      setActiveTab("Log In");
    } else if (location.pathname === "/admin") {
      setActiveTab("Admin");
    }
  }, [location]);

  useEffect(() => {
    if (loggedIn) {
      // If you are logged in, determine the Username and Role of the User.
      getUsername();
      getRole();
    }
  });

  return (
    // The header at the top of the page.
    <div className={css["header"]}>
      {/*Left-Hand Title*/}
      <p>Credential Management System</p>
      {/* Greet the User */}
      {loggedIn === true && (
        <div className={css["middle"]}>
          <p>Welcome {Username}!</p>
        </div>
      )}
      {/*Right-hand Tab options*/}
      <div className={css["header-right"]}>
        <Link to="/">
          <p
            className={activeTab === "Home" ? css["active"] : ""}
            onClick={() => setActiveTab("Home")}
          >
            Home
          </p>
        </Link>
        {/* Only available to the Admins */}
        {loggedIn === true && role === "admin" && (
          <>
            <Link to="/admin">
              <p
                className={activeTab === "Admin" ? css["active"] : ""}
                onClick={() => setActiveTab("Admin")}
              >
                Admin
              </p>
            </Link>
          </>
        )}
        {/* If you're not logged in, then either Register or Log In. */}
        {loggedIn === false && (
          <>
            <Link to="/register">
              <p
                className={activeTab === "Register" ? css["active"] : ""}
                onClick={() => setActiveTab("Register")}
              >
                Register
              </p>
            </Link>
            <Link to="/login">
              <p
                className={activeTab === "Log In" ? css["active"] : ""}
                onClick={() => setActiveTab("Log In")}
              >
                Log In
              </p>
            </Link>
          </>
        )}
        {/* Only show the Log Out Button if the user is logged in */}
        {loggedIn === true && (
          <Link
            to="/"
            onClick={async () => {
              setActiveTab("Home");
              await axios.get("/employee/logout");
              await getLoggedIn();
              navigate("/");
            }}
          >
            <p className={activeTab === "Log Out" ? css["active"] : ""}>
              Log Out
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
