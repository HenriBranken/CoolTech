const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjId = mongoose.SchemaTypes.ObjectId;

/*
An Employee Document gives us the Username of the employee.
The Password in MongoDB is actually the HASHED passwords (by using bcryptjs).
Therefore, if the Passwords leaks, CoolTech is less compromised.
The Employee Document also specifies the Role of the Employee as well as
the Division IDs the Employee belongs to.
*/

const EmployeeSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Division_IDs: [
      {
        type: ObjId,
        ref: "Division",
        required: true,
      },
    ],
    Role: {
      type: String,
      required: true,
      enum: ["normal", "management", "admin"],
      default: "normal",
    },
  },
  { collection: "employees" }
);

const Employee = mongoose.model("Employee", EmployeeSchema);
// `ref` will be "Employee".

module.exports = Employee;
