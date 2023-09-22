const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjId = mongoose.SchemaTypes.ObjectId;

/*
A Credential document contains the Username and Password for a specific Place
inside of a Unit+Division combination.
Each Place has its own Username and Password.
*/

const CredentialSchema = new Schema(
  {
    DivisionId: {
      type: ObjId,
      ref: "Division",
      immutable: true,
      required: true,
    },
    Place: {
      type: String,
      required: true,
    },
    Username: {
      type: String,
      unique: true,
      required: true,
    },
    Password: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { collection: "credentials" }
);

const Credential = mongoose.model("Credential", CredentialSchema);
// `ref` will be "Credential".

module.exports = Credential;
