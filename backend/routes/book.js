const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const rentalsController = require("../controllers/rentalsController");
const earningsController = require("../controllers/earningsController");

router.post('/upload',bookController.handleBookUpload);
router.post('/:id',bookController.handleBookUpdate, rentalsController.handleRentalInsert, earningsController.updateMonthlyEarnings);
router.post('/detail/:id',bookController.handleBookDetailUpdate, bookController.handleGetAllBooks);

router.delete('/:id',bookController.handleBookDelete, bookController.handleGetAllBooks);

// not order matters here since they both match
router.get("/available",bookController.handleGetAvailableBooks);
router.get("/available/category",bookController.handleGetAvailableBooksByCategory);
router.get("/available/category/:id",bookController.handleGetAvailableBooksByCategoryUserId);
router.get('/available/:id',bookController.handleGetAvailableBooksByUserId);


router.get("/",bookController.handleGetAllBooks);

module.exports = router;