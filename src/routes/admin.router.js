const userControllers = require("../controllers/admin.controller");
const express = require('express');
const router = express.Router();

router.route("/test").get(userControllers.test);

router.route("/event/add").post(userControllers.addEvent);

router.route("/event/edit/:eventId").post(userControllers.editEvent);

router.route("/event/delete/:eventId").delete(userControllers.deleteEvent);

module.exports = router;