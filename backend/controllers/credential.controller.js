const Credential = require("../models/credential.model");

const postCredential = async (req, res) => {
  {
    try {
      const { DivisionId, Place, Username, Password, PasswordVerify } =
        req.body;
      // Validation
      // [1] All the variables must be present.
      if (!DivisionId || !Place || !Username || !Password || !PasswordVerify) {
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

      // [4] Check if a Credential with the specified UserName already exists in the database.
      const existingCredential = await Credential.findOne({ Username });
      if (existingCredential) {
        return res.status(400).json({
          errorMessage: "A Credential with this `Username` already exists.",
        });
      }

      // [5] Save a New Credential to the DB.
      // The Credential model is also a constructor:
      const newCredential = new Credential({
        DivisionId,
        Place,
        Username,
        Password,
      });
      const savedCredential = await newCredential.save(); // Save the Credential to the Database.

      res.send({ savedCredential });
    } catch (err) {
      console.error("There is a problem at /cred/", err);
      res.status(500).send(); // No Message. Don't want to give any clues to Hackers.
      // 500 : Internal Server Error.
    }
  }
};

const getCredential = async (req, res) => {
  try {
    const credentialId = req.params.credentialId;
    // Extract the Credential document from the DataBase.
    const response = await Credential.findById(credentialId)
      .populate("DivisionId")
      .exec();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json("There is an error at `/cred/:credentialId`", error);
  }
};

const patchCredential = async (req, res) => {
  try {
    // The "new" data is stored in `req.body`.
    const credentialId = req.params.credentialId;
    const credential = await Credential.findOneAndUpdate(
      { _id: credentialId },
      req.body,
      { runValidators: true },
      {
        new: true,
      }
    );
    console.log(credential);
    res.json(credential);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json("Something went wrong with the PATCH at '/cred/:credentialId'.");
  }
};

module.exports = {
  postCredential,
  getCredential,
  patchCredential,
};
