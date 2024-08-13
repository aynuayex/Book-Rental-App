const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");

router.get("/",ownerController.handleGetAllOwners);

router.post('/:id',ownerController.handleOwnerUpdate);
router.delete('/:id', ownerController.handleOwnerDelete, ownerController.handleGetAllOwners);

module.exports = router;