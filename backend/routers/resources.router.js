const router = require("express").Router();
const isAuthorized = require("../middleware/isAuthorized");
const isAuthorizedAdmin = require("../middleware/isAuthorizedAdmin");
const resourcesCtrl = require("../controllers/resources.controller");

/*
    The prepended 'PATH' for this router is `/resources`.
*/

router.get("/getPlaces", isAuthorized, resourcesCtrl.getPlaces);

router.get("/getAdminData", isAuthorizedAdmin, resourcesCtrl.getAdminData);

module.exports = router;
