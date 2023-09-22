const jwt = require("jsonwebtoken");
const Division = require("../models/division.model");
const Employee = require("../models/employee.model");

const units = async (req, res) => {
  try {
    // Get all the distinct "Unit"s.
    const units = await Division.find({}).distinct("Unit");
    res.status(201).json(units);
  } catch (error) {
    console.log(error);
    console.log("Something went wrong with /data/units.");
  }
};

const unitDivisions = async (req, res) => {
  try {
    const { Unit } = req.body; // Extract the `Unit` Value that we need to filter by.
    // Based on the `Unit`, get all the unique `Unit_Division`s.
    const divisions = await Division.find({ Unit }).distinct("Unit_Division");
    res.status(201).json(divisions);
  } catch (error) {
    console.log(error);
    console.log("Something went wrong with /data/unitDivisions.");
  }
};

const divisionId = async (req, res) => {
  try {
    console.log(req.body);
    const { Unit, Unit_Division } = req.body; // Extract the `Unit` and `Unit_Division` Data.
    const idValue = await Division.find({ Unit, Unit_Division }).distinct(
      "_id"
    ); // Determine `_id`.
    res.status(201).json(idValue); // Return as a list containing one String. e.g. ["6504457da8416917276b05d5"]
  } catch (error) {
    console.log(error);
    console.log("Something is wrong with /data/divisionId.");
  }
};

const getCombos = async (req, res, next) => {
  try {
    // Read the Cookie:
    const token = req.cookies.token;

    // If there is no token, or `token = ""`
    if (!token) {
      return res.status(400).json(false);
    }

    // Extract the Payload.
    const verified = jwt.verify(token, process.env.PRIVATE_KEY);
    const employeeId = verified.ID;

    // Extract Employee Document.
    const employeeDocument = await Employee.findById(employeeId, "Division_IDs")
      .populate("Division_IDs")
      .exec();

    const divisions = employeeDocument.Division_IDs;

    // I want something in the format of:
    // [{"asdfjklw3874fdasdf": "Software Reviews > IT" }, ...]
    const options = {};
    for (let i = 0; i < divisions.length; i++) {
      const divId = divisions[i].id.toString();
      const combo = `${divisions[i].Unit} > ${divisions[i].Unit_Division}`;
      options[divId] = combo;
    }
    res.status(201).json(options);
  } catch (error) {
    // We have an Unverified Token.
    console.log(error);
    console.log("Something went wrong with /data/getCombos.");
    res.status(404).json(false);
  }
};

const divisionData = async (req, res) => {
  {
    try {
      // I want returned data in the format of:
      // [
      //   {
      //     "divisionId": "6504457da8416917276b05d5",
      //     "division": "News Management > Finances"
      //   }, ...
      // ]
      const divData = await Division.find({});
      const returnedData = [];
      for (let i = 0; i < divData.length; i++) {
        const pretty = {};
        pretty.divisionId = divData[i]["_id"].toString();
        const unit = divData[i]["Unit"];
        const unitDivision = divData[i]["Unit_Division"];
        pretty.division = `${unit} > ${unitDivision}`;
        returnedData.push(pretty);
      }
      res.status(201).json(returnedData);
    } catch (error) {
      console.log(error);
      console.log("Something wrong with /data/divisionData.");
    }
  }
};

module.exports = {
  units,
  unitDivisions,
  divisionId,
  getCombos,
  divisionData,
};
