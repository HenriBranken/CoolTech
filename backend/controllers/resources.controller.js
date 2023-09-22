const Credential = require("../models/credential.model");
const Employee = require("../models/employee.model");

const getPlaces = async (req, res) => {
  // I want data in the format of:
  // [
  //     {
  //         "placeId": "650467e0034597cae7c37da8",
  //         "divisionId": "65044667a8416917276b05d7",
  //         "unit": "News Management",
  //         "unitDivision": "Writing",
  //         "place": "WP Sites",
  //         "username": "newswrit_wp",
  //         "password": "nitrogen"
  //     }, ...
  // ]
  // This is for the table in the Home page.
  try {
    console.log("The req.employeeId is: ", req.employeeId);
    if (!req.employeeId) {
      console.log("req.employeeId is missing somehow.");
      throw Error("req.employeeId is missing somehow.");
    }
  } catch (error) {
    console.log("The req.employeeId is missing somehow.");
    return res.status(500).json("Could not find Employee ID from token.");
  }

  try {
    // Find the Employee Document of the User that is currently signed in.
    const employeeDocument = await Employee.findOne(
      { _id: req.employeeId },
      "Division_IDs"
    );
    // Extract the Division_IDs of the signed-in user.
    const divIds = employeeDocument.Division_IDs;

    // Get all the credentials who has a division id coinciding with one of the `divIds`.
    const placeData = await Credential.find({ DivisionId: { $in: divIds } })
      .populate("DivisionId")
      .exec();
    const returnedData = [];
    // Make a pretty array with pretty data.
    for (let i = 0; i < placeData.length; i++) {
      const pretty = {};
      pretty.placeId = placeData[i]["_id"].toString();
      pretty.divisionId = placeData[i]["DivisionId"]["_id"].toString();
      pretty.unit = placeData[i]["DivisionId"]["Unit"];
      pretty.unitDivision = placeData[i]["DivisionId"]["Unit_Division"];
      pretty.place = placeData[i]["Place"];
      pretty.username = placeData[i]["Username"];
      pretty.password = placeData[i]["Password"];

      returnedData.push(pretty);
    }
    res.status(201).json(returnedData);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something wrong at /resources/getPlaces.");
  }
};

const getAdminData = async (req, res) => {
  // I want data in the format of:
  // [
  //     {
  //         "employeeId": "6505aeeda702caaf8ef0041a",
  //         "username": "karrie",
  //         "divisions": "News Management > Finances & News Management > Writing",
  //         "role": "management"
  //     }, ...
  // ]
  // This is for the table in the Admin Page.
  try {
    console.log("The req.employeeId is: ", req.employeeId);
    if (!req.employeeId) {
      console.log("req.employeeId is missing somehow.");
      throw Error("req.employeeId is missing somehow.");
    }
  } catch (error) {
    console.log("The req.employeeId is missing somehow.");
    return res.status(500).json("Could not find Employee ID from token.");
  }

  try {
    // Find the Employee Document of the User that is currently signed in.
    const employeeDocument = await Employee.findOne(
      { _id: req.employeeId },
      "Division_IDs"
    );
    // Extract the Division_IDs of the signed-in user.
    const divIds = employeeDocument.Division_IDs;

    // Find all the Employees who contains a Division_ID that coincides with one in those of `divIds`.
    const adminData = await Employee.find({ Division_IDs: { $in: divIds } })
      .populate("Division_IDs")
      .exec();

    const returnedData = [];
    // Make an array with pretty data.
    for (let i = 0; i < adminData.length; i++) {
      const pretty = {};
      pretty.employeeId = adminData[i]["_id"].toString();
      pretty.username = adminData[i]["Username"];
      const combos = [];
      for (let j = 0; j < adminData[i]["Division_IDs"].length; j++) {
        const unit = adminData[i]["Division_IDs"][j]["Unit"];
        const unitDivision = adminData[i]["Division_IDs"][j]["Unit_Division"];
        const combo = `${unit} > ${unitDivision}`;
        combos.push(combo);
      }
      pretty.divisions = combos.join(" & ");
      pretty.role = adminData[i]["Role"];
      returnedData.push(pretty);
    }
    res.status(201).json(returnedData);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something srong with /resources/getAdminData");
  }
};

module.exports = {
  getPlaces,
  getAdminData,
};
