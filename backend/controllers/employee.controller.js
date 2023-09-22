const Employee = require("../models/employee.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { Username, Password, PasswordVerify, Division_IDs, Role } = req.body;
    // Validation
    // [1] All the variables must be present. Default `Role` is "normal".
    if (!Username || !Password || !PasswordVerify || !Division_IDs) {
      return res
        .status(400)
        .json({ errorMessage: "Please Enter All The Required Fields." }); // Bad Request.
    }

    // [2] Password length needs to be tested and verified.
    if (Password.length < 4) {
      return res.status(400).json({
        errorMessage: "Your Password must contain at least 4 Characters.",
      });
    }

    // [3] Does both password entries match each other.
    if (Password !== PasswordVerify) {
      return res
        .status(400)
        .json({ errorMessage: "Please Enter the Same Password Twice." });
    }

    // [4] Check if a user with specified Username already exists in the database.
    const existingUsername = await Employee.findOne({ Username });
    if (existingUsername) {
      return res.status(400).json({
        errorMessage: "An account with this `Username` already exists.",
      });
    }

    // [5] Hash the Password.
    // `salt` is a random String of Characters.
    const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
    // console.log("SALT_ROUNDS, ", SALT_ROUNDS);
    // console.log(typeof SALT_ROUNDS);
    const salt = await bcrypt.genSalt(SALT_ROUNDS); // Argument is the SALT WORK FACTOR.
    // In the following we hash the password by using the `salt`.
    const passwordHash = await bcrypt.hash(Password, salt);

    // [6] Save a New User Account to the DB.
    // The User model is also a constructor.
    const newEmployee = new Employee({
      Username,
      Password: passwordHash,
      Division_IDs,
      Role,
    });
    const savedEmployee = await newEmployee.save(); // Save the Employee to the Database.
    console.log(savedEmployee);

    // Log the user immediately in after registering an account.

    // [7] Sign the Token.
    // Never put secure information inside of your Payload.
    const token = jwt.sign(
      {
        ID: savedEmployee.id,
      },
      process.env.PRIVATE_KEY
    ); // Cannot be accessed by Client-Side Scripts (JavaScript). Only the Server can access the cookie.

    // [8] Send the token in a HTTP-only Cookie to the Frontend/Browser.
    // Not using localStorage because it is accessible to JavaScript.
    // httpOnly-cookie cannot be read by JavaScript.  Only HyperText-Transfer-Protocol Allowed.
    // The name of the Cookie is 'token'
    // The Header is `Set-Cookie`.
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    console.log("Something wrong with /employee/register.");
    res.status(500).send(); // No Message. Don't want to give any clues to Hackers.
    // 500 : Internal Server Error.
  }
};

const login = async (req, res) => {
  {
    try {
      // [1] Extract the `email` and `password` from the request body.
      const { Username, Password } = req.body;

      // [2] Validate that all the credentials are present.
      if (!Username || !Password) {
        return res
          .status(400)
          .json({ errorMessage: "Please Enter All The Required Fields." }); // Bad Request.
      }

      // [3] Does the `Username` exist in the DataBase?
      const existingEmployee = await Employee.findOne({ Username });
      if (!existingEmployee) {
        // The `Username` cannot be found in the DataBase.
        return res.status(401).json({ errorMessage: "Wrong Credentials." }); // Unauthorised.
        // Vague message to frustrate any hackers.
      }

      // [4] Does the entered password "ALIGN" with the Hashed Password in the DataBase.
      // Compares the plain-text String with the Hash.
      // Only `true` if the password belongs to the Hash, otherwise `false`.
      const passwordCorrect = await bcrypt.compare(
        Password,
        existingEmployee.Password
      );
      // [5] Determine Validity of the Password.
      if (!passwordCorrect) {
        return res.status(401).json({ errorMessage: "Wrong credentials." }); // Unauthorised.
        // Vague message to frustrate any hackers.
      }

      // At this point we know that the Employee is valid!  Sjo dit is erg.

      // [6] Sign the Token.
      const token = jwt.sign(
        {
          ID: existingEmployee.id,
          role: existingEmployee.Role,
        },
        process.env.PRIVATE_KEY
      );

      /* Cannot be accessed by Client-Side Scripts (JavaScript).
             Only the Server can access the Cookie. */
      // [7] Send the token in a HTTP-Only Cookie.
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .send();
    } catch (error) {
      console.error(err);
      console.log("Something wrong with /employee/login.");
      res.status(500).send(); // Internal Server Error.
      //  Sent nothing; don't want to give any information to hackers.
    }
  }
};

const username = async (req, res) => {
  try {
    // Read the Cookie:
    const token = req.cookies.token;

    // If there is no token, or `token = ""`
    if (!token) {
      console.log("There is no token, or token = ''.");
      return res.json("");
    }

    const verified = jwt.verify(token, process.env.PRIVATE_KEY);
    const employeeId = verified.ID.toString();

    const employeeDocument = await Employee.findById(employeeId);
    const username = employeeDocument["Username"];

    res.json(username);
  } catch (error) {
    // We have an Unverified Token.
    console.error(error);
    console.log("We have an Unverified Token.");
    res.json("");
  }
};

const logout = (req, res) => {
  // Not only will the browser clear the cookie, but it will also completely remove it.
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // A date in the past.  Therefore it is ALREADY Expired.
    })
    .send();
};

const employeeDetails = async (req, res) => {
  {
    try {
      const employeeId = req.params.employeeId;
      console.log("employeeId is: ", employeeId);
      const response = await Employee.findById(employeeId);
      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json("Something wrong with /employee/employeeDetails/:employeeId.");
    }
  }
};

const adminDetails = async (req, res) => {
  {
    try {
      // Read the Cookie:
      const token = req.cookies.token;

      // If there is no token, or `token = ""`
      if (!token) {
        console.log("There is no token, or token = ''.");
        return res.status(500).json(false);
      }

      const verified = jwt.verify(token, process.env.PRIVATE_KEY);
      const adminId = verified.ID;

      const response = await Employee.findById(adminId);
      res.status(201).json(response);
      console.log(response);
    } catch (error) {
      // We have an Unverified Token.
      console.error(error);
      console.log("We have an Unverified Token.");
      res.status(500).json(false);
    }
  }
};

const patchEmployee = async (req, res) => {
  {
    try {
      const employeeId = req.params.employeeId;
      const employee = await Employee.findOneAndUpdate(
        { _id: employeeId },
        req.body,
        { runValidators: true },
        {
          new: true,
        }
      );
      console.log(employee);
      res.json(employee);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json(
          "Something went wrong with the PATCH at '/employee/:employeeId'."
        );
    }
  }
};

const loggedIn = (req, res) => {
  try {
    // Read the Cookie:
    const token = req.cookies.token;
    console.log(token);

    // If there is no token, or `token = ""`
    if (!token) {
      console.log("There is no token, or token = ''.");
      return res.json(false);
    }

    jwt.verify(token, process.env.PRIVATE_KEY);

    res.json(true);
  } catch (error) {
    // We have an Unverified Token.
    console.error(error);
    console.log("We have an Unverified Token.");
    res.json(false);
  }
};

const getRole = async (req, res, next) => {
  {
    try {
      // Read the Cookie:
      const token = req.cookies.token;

      // If there is no token, or `token = ""`
      if (!token) {
        return res.json("");
      }

      // Extract the Payload.
      const verified = jwt.verify(token, process.env.PRIVATE_KEY);
      const employeeId = verified.ID;

      // Extract the Employee Document, and then the role.
      const employeeDocument = await Employee.findById(employeeId, "Role");
      const role = employeeDocument.Role;
      res.status(201).json(role);
    } catch (error) {
      console.error(error);
      console.log("Something went wrong with /employee/getRole.");
      // We have an Unverified Token.
      res.json("");
    }
  }
};

module.exports = {
  register,
  login,
  username,
  logout,
  employeeDetails,
  adminDetails,
  patchEmployee,
  loggedIn,
  getRole,
};
