const router = require("express").Router();
const isAuthorized = require("../middleware/isAuthorized");
const credentialCtrl = require("../controllers/credential.controller");

/*
    The prepended 'PATH' for this router is `/cred`.
*/

/*
Register a new Credential (or Place) belonging to a specific DivisionId.
`isAuthorized` is a middleware function.
*/
router.post("/", isAuthorized, credentialCtrl.postCredential);

// Get the details of a Specific Credential.
router.get("/:credentialId", credentialCtrl.getCredential);

// Update information about a single Credential - PATCH
router.patch("/:credentialId", isAuthorized, credentialCtrl.patchCredential);

module.exports = router;
