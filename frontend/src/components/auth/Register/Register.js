import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../context/AuthContext";

import css from "./Register.module.css";
import { toast } from "react-toastify";

// Component used to Register a new Employee.

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [unit, setUnit] = useState("");
  const [unitList, setUnitList] = useState([]);
  const [division, setDivision] = useState("");
  const [divisionList, setDivisionList] = useState([]);
  const [divisionId, setDivisionId] = useState("");

  const { getLoggedIn, getRole } = useContext(AuthContext); // These are functions.
  const navigate = useNavigate();

  // This `useEffect()` is used to populate `unitList`.
  // Get all the possible Units in CoolTech company.
  useEffect(function () {
    axios
      .get("/data/units")
      .then((response) => setUnitList(response.data))
      .catch((error) => console.error(error));
  }, []);

  // This `useEffect()` is used to populate `divisionList` when the `unit` changes.
  // Based on selected `unit`, populate `divisionList` accordingly.
  useEffect(
    function () {
      axios
        .post("/data/unitDivisions", { Unit: unit })
        .then((response) => setDivisionList(response.data))
        .catch((error) => console.error(error));
    },
    [unit]
  );

  // This `useEffect()` is used to populate `divisionId` when the `division` changes.
  // Set Division ID based on the selected Unit+Division Combo.
  useEffect(() => {
    const populateId = async () => {
      const output = await axios.post("/data/divisionId", {
        Unit: unit,
        Unit_Division: division,
      });
      setDivisionId(output.data[0]);
    };

    populateId().catch((err) => {
      console.error(err);
    });
  }, [division]);

  // We need to make the Register Request to our server.
  const register = async (event) => {
    event.preventDefault(); // We don't want to reload the page.

    try {
      const registerData = {
        Username: username,
        Password: password,
        PasswordVerify: passwordVerify,
        Division_IDs: [divisionId],
      };
      // Check if all the fields were populated with information.
      if (
        !registerData.Username ||
        !registerData.Password ||
        !registerData.PasswordVerify ||
        !registerData.Division_IDs
      ) {
        toast.warning("Please supply all the input fields.");
        // Check that the two passwords match each other.
      } else if (registerData.Password !== registerData.PasswordVerify) {
        toast.warn("Please enter the same password twice.");
        // Check that the password is long enough.
      } else if (registerData.Password.length < 4) {
        toast.warn("The password must contain at least four characters");
      } else {
        // Now we need to send `registerData` to our server and make an HTTP request (via Axios).
        // Try to Register the User.
        // By default, the `Role` of the user is "Normal".
        await axios.post("/employee/register", registerData);
        await getLoggedIn(); // Help us to get the newly-updated State of our `loggedIn` value.
        await getRole(); // Help us get the newly-updated State of our `role` value.
        toast.success("Registered Successfully");

        // Redirect back to the Home page.
        setTimeout(() => {
          navigate("/"); // "/" is the <Home /> page.
        }, 750);
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  return (
    <div className={css["form-container"]}>
      <form onSubmit={register}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter Username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <label htmlFor="passwordVerify">Verify Password</label>
        <input
          type="password"
          id="passwordVerify"
          name="passwordVerify"
          placeholder="Enter Password Again"
          onChange={(event) => setPasswordVerify(event.target.value)}
          value={passwordVerify}
        />
        <label htmlFor="unit">Unit</label>
        <select
          name="unit"
          id="unit"
          onChange={(event) => setUnit(event.target.value)}
        >
          <option value="0">
            &diams;&clubs; Selet Organisational Unit &clubs;&diams;
          </option>
          {/* Map all the possible Units available in CoolTech */}
          {unitList.map((unit) => {
            return (
              <option key={unit} value={unit}>
                {unit}
              </option>
            );
          })}
        </select>
        <br />
        <label htmlFor="division">Division</label>
        <select
          name="division"
          id="division"
          onChange={(event) => setDivision(event.target.value)}
        >
          <option value="0">
            &diams;&clubs; Select Division &clubs;&diams;
          </option>
          {/* Map all the possible Divisions of the selected Unit */}
          {divisionList.map((divis) => {
            return (
              <option key={divis} value={divis}>
                {divis}
              </option>
            );
          })}
        </select>
        <br />
        <input className={css["submit-btn"]} type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;
