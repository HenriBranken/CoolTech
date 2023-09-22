import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import css from "./Update.module.css";

/*  
The component that renders if a Manager or Admin desires to Update a Credential.
*/

const Update = () => {
  const [DivisionId, setDivisionId] = useState("");
  const [Unit, setUnit] = useState(""); // Just populated, not editable.
  const [Unit_Division, setUnit_Division] = useState(""); // Just populated, not editable.
  const [Place, setPlace] = useState(""); // Just populated, not editable.
  const [Username, setUsername] = useState(""); // Is editable.
  const [Password, setPassword] = useState(""); // Is editable.

  // Used to redirect the user to a different page.
  const navigate = useNavigate();

  // Fetch the `credentialId` parameter from the URL. It should be a long string.
  const { credentialId } = useParams();

  // Based on the ID parameter, fetch data about the Place's Credential, and update some state.
  const getSingleCredential = async (credentialId) => {
    const response = await axios.get(`/cred/${credentialId}`);
    // Extract the data from the server response.
    const responseData = response.data;
    // Update State so that we don't have any blank fields.
    setDivisionId(responseData.DivisionId._id);
    setUnit(responseData.DivisionId.Unit);
    setUnit_Division(responseData.DivisionId.Unit_Division);
    setPlace(responseData.Place);
    setUsername(responseData.Username);
    setPassword(responseData.Password);
  };

  // When the page opens, execute `getSingleCredential(credentialId)`;
  useEffect(() => {
    getSingleCredential(credentialId);
  }, []);

  // The PATCH request.
  // `state` represents the data of a Credential grabbed from the <form> below.
  const updateCredential = async (credentialId, Username, Password) => {
    let response = await axios.patch(`/cred/${credentialId}`, {
      Username,
      Password,
    });
    console.log(response); // QA

    // Notify the user that the Update was a success.
    toast.success("Successfully updated the Credential.");
    // After waiting 750 milliseconds, navigate back to the "Home" page.
    setTimeout(() => {
      navigate("/"); // "/" is the <Home /> page.
    }, 750);
  };

  // Executed when the <form> is submitted.
  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      // Ensure that ALL fields are populated with data as they should be.
      if (!Username || !Password) {
        toast.warning(
          "Please provide a value for both `Username` and `Password`."
        );
        // Ensure that the password contains at least four characters.
      } else if (Password.length < 4) {
        toast.warning("Password must contain at least four characters.");
        // Patch the Credential with the (new) Username and Password.
      } else {
        updateCredential(credentialId, Username, Password);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  // <form> element used to captured the new data.
  return (
    <div>
      <form className={css["form-container"]} onSubmit={handleSubmit}>
        <label htmlFor="Unit">Unit</label>
        {/* `Unit` field cannot be edited. */}
        <input
          className={css["uneditable"]}
          type="text"
          id="unit"
          name="unit"
          value={Unit}
          readOnly
        />
        <label htmlFor="Division">Division</label>
        {/* The Division Field cannot be Edited. */}
        <input
          className={css["uneditable"]}
          type="text"
          id="division"
          name="division"
          value={Unit_Division}
          readOnly
        />
        <label htmlFor="Place">Place</label>
        {/* Place cannot be edited. */}
        <input
          className={css["uneditable"]}
          type="text"
          id="place"
          name="place"
          value={Place}
          readOnly
        />
        <label htmlFor="username">Username</label>
        {/* Username IS editable */}
        <input
          className={css["editable"]}
          type="text"
          id="username"
          name="username"
          value={Username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label htmlFor="password">Password</label>
        {/* Password IS editable. */}
        <input
          className={css["editable"]}
          type="text"
          id="password"
          name="password"
          value={Password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input className={css["submit-btn"]} type="submit" value={"Update"} />
      </form>
    </div>
  );
};

export default Update;
