const express = require("express");
const router = express.Router();
const earningsController = require("../controllers/earningsController");

router.get("/month", earningsController.getMonthlyEarningsData);
router.get("/month/total", earningsController.getTotalMonthlyEarningsData);
router.get("/month/graph", earningsController.getTotalMonthRangeEarningsData);

module.exports = router;
