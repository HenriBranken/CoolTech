const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
A Division document specifies what is the `Unit` and `Unit_Division` of a specific "division".
It's also very useful in the sense of supplying the "division ID", which is the `_id` field.
*/

const DivisionSchema = new Schema(
  {
    Unit: {
      type: String,
      immutable: true,
      required: true,
    },
    Unit_Division: {
      type: String,
      immutable: true,
      required: true,
    },
  },
  { collection: "divisions" }
);

const Division = mongoose.model("Division", DivisionSchema);
// `ref` will be "Division".

module.exports = Division;
