import React from "react";
import axios from "axios";
import Router from "./Router";
import { AuthContextProvider } from "../src/context/AuthContext";

// Axios will now allow Credentials (such as http-only Cookies) to be set in the Browser.
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <AuthContextProvider>
      <Router />
      {/* The <Router /> component will detect the different paths.
          Everything INSIDE the <Router /> will now have access to 
          `loggedIn` & `getLoggedIn` & `role` & `getRole`
          provided from the AuthContextProvider.*/}
    </AuthContextProvider>
  );
};

export default App;
