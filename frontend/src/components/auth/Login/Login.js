import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../context/AuthContext";

import css from "./Login.module.css";
import { toast } from "react-toastify";

/*
    Logging an existing Employee In.
*/

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { getLoggedIn, getRole } = useContext(AuthContext);
  const navigate = useNavigate(); // Move to other pages.

  const login = async (event) => {
    event.preventDefault(); // We do not want to reload the page.

    try {
      const loginData = {
        Username: username,
        Password: password,
      };
      // Check if all the fields are supplied.
      if (!loginData.Username || !loginData.Password) {
        toast.warning("Please supply all the input fields.");
      }
      // Now we need to send `loginData` to our server and make an HTTP request (via Axios).
      // Try to Login the User:
      await axios.post("/employee/login", loginData);
      await getLoggedIn(); // Help us to get the newly-updated State of our `loggedIn` value.
      await getRole(); // Determine what the `role` of the employee is.
      toast.success("Successfully Logged In");

      // Redirect the User back to the Home page.
      setTimeout(() => {
        navigate("/"); // "/" is the <Home /> page.
      }, 750);
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  return (
    // This is the Login Form.
    <div className={css["form-container"]}>
      <form onSubmit={login}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          autoComplete="on"
          value={username}
          placeholder="Enter Username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          placeholder="Enter Password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input className={css["submit-btn"]} type="submit" value="Log In" />
      </form>
    </div>
  );
};

export default Login;
