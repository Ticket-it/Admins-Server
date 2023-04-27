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

// To add an event
router.route("/event-type/add").post(userControllers.addEventType);

// To get all event types
router.route("/event-types").get(userControllers.getEventTypes);

// To get all events by event type ID
router.route("/events/:eventTypeId").get(userControllers.getEventsByEventsTypeId);

// To get all tickets
router.route("/tickets/:eventId").get(userControllers.getTickets);

// To confirm booking
router.route("/tickets/edit/:ticketId").post(userControllers.confirmTicket);

// To get user details by userid
router.route("/users/:userId").get(userControllers.getUserByUserId);

module.exports = router;