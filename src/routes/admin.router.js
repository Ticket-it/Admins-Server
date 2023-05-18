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
router.route("/event/delete/:eventId").get(userControllers.deleteEvent);

// To add an event
router.route("/event-type/add").post(userControllers.addEventType); //done

// To get all event types
router.route("/event-types").get(userControllers.getEventTypes); //done

// To get all events by event type ID
router.route("/events/:eventTypeId").get(userControllers.getEventsByEventsTypeId); //done

// To get all tickets
router.route("/tickets/:eventId").get(userControllers.getTickets); //done

// To confirm booking
router.route("/tickets/:ticketId").post(userControllers.confirmTicket); //done

// To get user details by userid
router.route("/users/:userId").get(userControllers.getUserByUserId);

// To approve all tickets
router.route("/tickets-approve-all/:eventId").get(userControllers.approveAllTickets); //done

// To get Tickets of a specific user
router.route("/tickets-user/:userId").get(userControllers.getTicketsOfSpecificUser); //done

module.exports = router;