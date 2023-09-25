// Inside the src/pages/Add.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import css from "./Add.module.css";

/*
    This component is the one that renders when we click on the plus icon
    in the top-left corner.

    We must keep in mind that a new credentialId (in `credentials` collection)
    will be automatically generated when adding a new credential to a division.
*/

const Add = () => {
  // Used later to re-direct a user.
  const navigate = useNavigate();

  const [DivisionId, setDivisionId] = useState(""); // Fetched from DB
  const [Place, setPlace] = useState(""); // New
  const [Username, setUsername] = useState(""); // New
  const [Password, setPassword] = useState(""); // New
  const [PasswordVerify, setPasswordVerify] = useState(""); // New
  const [loading, setLoading] = useState(false);

  // Thi
  const [combos, setCombos] = useState({}); // Gets configured by `useEffect()`

  // Get the {divisionId: Unit > Division} Combos:
  const getCombos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/data/getCombos");
      setCombos(response.data);
      setLoading(false);
    } catch (error) {
      console.error({
        error: error,
        message: "Could not retrieve the combos.",
      });
    }
  };

  // Configure the `combos` when this component mounts.
  useEffect(() => {
    getCombos();
  }, []);

  // POST request is performed to add a new credential if we click the `Add` button.
  const addCredential = async (bodyObject) => {
    await axios.post("/cred/", bodyObject);
    toast.success("Successfully added a new Credential.");

    // After 750 milliseconds, redirect back to the Home page.
    setTimeout(() => {
      navigate("/"); // "/" is the <Home /> page.
    }, 750);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      // There is data missing in the form.
      if (!DivisionId || !Place || !Username || !Password || !PasswordVerify) {
        toast.warning("Please provide a value for each input field.");
        // Check if the two passwords are equal.
      } else if (Password !== PasswordVerify) {
        toast.warning("Please enter the same password twice.");
        // Check that the password is long enough.
      } else if (Password.length < 4) {
        toast.warning("Password must be at least four characters long.");
        // We may proceed with adding the new credential to the repository.
      } else {
        // Try to add the Credential to the List.
        const credentialObject = {
          DivisionId,
          Place,
          Username,
          Password,
          PasswordVerify,
        };
        addCredential(credentialObject); // Adding the new Credential for the First Time.
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    // Form to input the Unit, Division, Place, Username, Password, PasswordVerify.
    <div>
      {loading && <Loader></Loader>}
      {!loading && (
        <div className={css["form-container"]}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="divisionId">Division ID</label>
            <select
              name="divisionId"
              id="divisionId"
              onChange={(event) => setDivisionId(event.target.value)}
            >
              <option value="0">
                &diams;&clubs; Select Division &clubs;&diams;
              </option>
              {/* Map all the possible Unit > Division Combos in the Company */}
              {Object.keys(combos).map((key) => {
                return (
                  <option key={key} value={key}>
                    {combos[key]}
                  </option>
                );
              })}
            </select>
            <br />
            <label htmlFor="place">Place</label>
            <input
              type="text"
              id="place"
              name="place"
              placeholder="Enter Place"
              onChange={(event) => {
                setPlace(event.target.value);
              }}
              value={Place}
            />
            <label htmlFor="username">Username</label>
            <input
              className={css["editable"]}
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              value={Username}
            />
            <label htmlFor="password">Password</label>
            <input
              className={css["editable"]}
              type="text"
              id="password"
              name="password"
              placeholder="Enter Password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              value={Password}
            />
            <label htmlFor="passwordVerify">Verify Password</label>
            <input
              className={css["editable"]}
              type="text"
              id="passwordVerify"
              name="passwordVerify"
              placeholder="Enter the Password Again"
              onChange={(event) => {
                setPasswordVerify(event.target.value);
              }}
              value={PasswordVerify}
            />
            <input className={css["submit-btn"]} type="submit" value="Add" />
          </form>
        </div>
      )}
    </div>
  );
};

export default Add;
