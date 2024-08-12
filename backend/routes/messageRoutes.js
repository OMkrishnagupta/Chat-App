const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { allMessages, sendMessage } = require("../controllers/messageControllers");
const router = express.Router(); // Use Router() with a capital 'R'

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
