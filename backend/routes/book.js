const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.post('/upload',bookController.handleBookUpload);
router.post('/:id',bookController.handleBookUpdate);
router.post('/detail/:id',bookController.handleBookDetailUpdate, bookController.handleGetAllBooks);

router.delete('/:id',bookController.handleBookDelete, bookController.handleGetAllBooks);

// not order matters here since they both match
router.get("/available",bookController.handleGetAvailableBooks);
router.get('/:id',bookController.handleBookGetByUserId);


router.get("/",bookController.handleGetAllBooks);

module.exports = router;