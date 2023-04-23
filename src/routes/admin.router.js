// Important requires
const userControllers = require("../controllers/admin.controller");
const express = require('express');
const router = express.Router();

/**
 * Events routes
 */

// To add an event
router.route("/event/add").post(userControllers.addEvent);

// To edit an event
router.route("/event/edit/:eventId").post(userControllers.editEvent);

// To delete an event
router.route("/event/delete/:eventId").delete(userControllers.deleteEvent);

module.exports = router;