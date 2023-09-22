const router = require("express").Router();
const isAuthorized = require("../middleware/isAuthorized");
const isAuthorizedAdmin = require("../middleware/isAuthorizedAdmin");
const employeeCtrl = require("../controllers/employee.controller");

/*
    The prepended 'PATH' for this router is `/employee`.
*/

/* Registration Path. Sign Up. */
// Hierdie is 'n moerse proses.
router.post("/register", employeeCtrl.register);

/* Log-In End-Point. Also Known As Sign In. */
router.post("/login", employeeCtrl.login);

// Determine what is the Username based on the token.
// I.e. based on the person who is currently signed in.
router.get("/username", employeeCtrl.username);

// To Log someone out, we just need to,
// [1] erase the token and
// [2] remove the cookie from the browser.
router.get("/logout", employeeCtrl.logout);

// Get all the details of a specific Employee based on the supplied `employeeId`.
router.get(
  "/employeeDetails/:employeeId",
  isAuthorized,
  employeeCtrl.employeeDetails
);

// Get all the details of an Admin (based on the cookie token).
router.get("/adminDetails", employeeCtrl.adminDetails);

// Update information about a single Employee - PATCH
// Only Admins can do this.
router.patch("/:employeeId", isAuthorizedAdmin, employeeCtrl.patchEmployee);

// This is a Helper Function to quickly determine whether an Employee is already Authenticated.
// A way for the FrontEnd to quickly check whether the user is logged in.
router.get("/loggedIn", employeeCtrl.loggedIn);

// Determine if the currently logged-in user has a role of [1] normal, [2] management, [3] admin.
router.get("/getRole", employeeCtrl.getRole);

module.exports = router;
