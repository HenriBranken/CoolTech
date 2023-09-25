/*
procademy (19 August 2022), #71 How to show loading spinner | Working with HTTP Request & Response | A Complete React Course,
Retrieved on 7 August 2023, From: https://www.youtube.com/watch?v=sEuXFbwMgpY&ab_channel=procademy
*/

import React from "react";
import "./Loader.css";

function Loader() {
  return (
    <div className="modal">
      <div className="loader"></div>
    </div>
  );
}

export default Loader;
