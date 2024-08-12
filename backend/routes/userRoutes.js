const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");
const { authUser } = require("../controllers/userController");
const { allUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
// Define routes
router.post("/", registerUser); // Use router.post to handle POST requests
router.post("/login", authUser);
router.route("/").get(protect, allUsers);

module.exports = router;
