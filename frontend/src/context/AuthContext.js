import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Context is the React way of other components requesting some global state.
// It returns us an object which has all the features of context.
const AuthContext = createContext();

// This component will provide the value of `true` or `false` whether I'm logged in or not.
// It will also provide on of either ["admin", "management", "normal"]; i.e. the role of the employee.
// Our props is related to the <Router /> in the App.js file.
const AuthContextProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [role, setRole] = useState("");

  // Request from the server to see if we are logged in or not.
  // Returns either `true` or `false`.
  const getLoggedIn = async () => {
    const response = await axios.get("/employee/loggedIn");
    setLoggedIn(response.data);
  };

  // Request from the server to determine the employee role.
  // Returns either "normal" / "management" / "admin".
  const getRole = async () => {
    const response = await axios.get("/employee/getRole");
    setRole(response.data);
  };

  // When the `App` mounts, make a request to the server to detect whether we are logged in or not, and to see what our `role` is.
  useEffect(() => {
    getLoggedIn();
    if (loggedIn) {
      getRole();
    }
  }, []);

  return (
    // In the object we have an object called `Provider`.
    // Provide the newly-updated `loggedIn` value via `getLoggedIn`.
    // Provide the determine `role` value via `getRole`.
    <AuthContext.Provider value={{ loggedIn, getLoggedIn, role, getRole }}>
      {props.children}
      {/* Anything inside will be provided with `value`: `props.children` in our <Router /> */}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthContextProvider };
