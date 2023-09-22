const router = require("express").Router();
const isAuthorizedAdmin = require("../middleware/isAuthorizedAdmin");
const dataCtrl = require("../controllers/data.controller");

/*
    The prepended path for this Router is:  "/data"
*/

// Get a list of all the unique `Unit` names in CoolTech Company. Requires no Input from the User.
// Return result as a List of Strings.
router.get("/units", dataCtrl.units);

// Populate the `Unit_Division` field, based on the selected `Unit`, with unique values.
// Return result as a List of Strings.
router.post("/unitDivisions", dataCtrl.unitDivisions);

// Work Backwards.  Based on the `Unit` and the `Unit_Division`, determine the `_id` for the Division.
router.post("/divisionId", dataCtrl.divisionId);

router.get("/getCombos", dataCtrl.getCombos);

router.get("/divisionData", isAuthorizedAdmin, dataCtrl.divisionData);

module.exports = router;
