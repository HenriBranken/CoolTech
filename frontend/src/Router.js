import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthContext from "./context/AuthContext";

import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/Register/Register";
import Update from "./pages/Update/Update";
import Add from "./pages/Add/Add";
import AdminPage from "./pages/AdminPage/AdminPage";
import AdminEdit from "./pages/AdminEdit/AdminEdit";

const Router = () => {
  const { loggedIn } = useContext(AuthContext);
  return (
    // BrowserRouter is a router implementation that uses the HTML5 History API.
    <BrowserRouter>
      <div className="App">
        <Header />
        {/*Notification Messages to Inform User of successful transactions or Warnings.*/}
        <ToastContainer position="top-center" autoClose="2000" />

        {/* Routing = binding a web URL to specific resource in the web application. */}
        <Routes>
          {/*The Home Page.  GET all the Jobs..*/}
          <Route exact path="/" element={<Home />} />
          {/* Show the <Register /> and <Login /> if not Authenticated. */}
          {!loggedIn && (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </>
          )}
          {/* Routes accessible if the user IS logged in. */}
          {loggedIn === true && (
            <>
              <Route path="/update/:credentialId" element={<Update />} />
              <Route path="/add" element={<Add />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/:employeeId" element={<AdminEdit />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Router;
