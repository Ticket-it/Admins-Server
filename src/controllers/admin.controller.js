// Important requires
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const {
    createRecord,
    readRecord,
    updateRecord,
    deleteRecord,
    getAllRecords,
    getEventsByType,
    deleteTicketsByEventId,
    getTicketsWithEvents,
    approveTicketsByEventId,
    getHistoryById

} = require("../utils/CRUD");
const eventValidSchema =
    require("../utils/event.validationSchema").eventValidSchema;
const eventTypeValidSchema =
    require("../utils/event.validationSchema").eventTypeValidSchema;

/**
 * Function to add event
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const addEvent = async (req, res, next) => {
    try {
        const validResult = await eventValidSchema.validateAsync(req.body);

        /**
         * Check if type does not exists
         */
        const eventTypePath = `Events-Type/${validResult.type}`;
        const eventTypeRecord = await readRecord(eventTypePath);

        if (!eventTypeRecord) {
            throw new createError[404]("Event type not found");
        }

        // Generate a new UUID
        const eventId = uuidv4();

        const eventPath = `Events/${eventId}`;

        /**
         * Create Record
         */
        const recordData = {
            eventId: eventId,
            eventName: validResult.eventName,
            location: validResult.location,
            country: validResult.country,
            description: validResult.description,
            city: validResult.city,
            availableTickets: validResult.availableTickets,
            imageURL: validResult.imageURL,
            price: validResult.price,
            date: validResult.date,
            time: validResult.time,
            type: validResult.type,
        };
        await createRecord(eventPath, recordData);

        return res.status(200).send({
            message: "true",
            eventId: eventId,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Function to edit event
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const editEvent = async (req, res, next) => {
    try {
        const validResult = await eventValidSchema.validateAsync(req.body);

        const eventId = req.params.eventId;

        const eventPath = `Events/${eventId}`;

        /**
         * Check if event exists
         */
        const eventRecord = await readRecord(eventPath);

        if (!eventRecord) {
            throw new createError[404]("Event not found");
        }

        /**
         * Check if type does not exists
         */
        const eventTypePath = `Events-Type/${validResult.type}`;

        const eventTypeRecord = await readRecord(eventTypePath);

        if (!eventTypeRecord) {
            throw new createError[404]("Event type not found");
        }

        /**
         * Update event
         */
        const recordData = {
            eventName: validResult.eventName,
            location: validResult.location,
            country: validResult.country,
            description: validResult.description,
            city: validResult.city,
            availableTickets: validResult.availableTickets,
            imageURL: validResult.imageURL,
            price: validResult.price,
            date: validResult.date,
            time: validResult.time,
            type: validResult.type,
        };
        await updateRecord(eventPath, recordData);

        return res.status(200).send({
            message: "true",
            eventId: eventId,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Function to delete event
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const deleteEvent = async (req, res, next) => {
    const eventId = req.params.eventId;

    try {
        // Check if the event exists in the database
        const eventRecord = await readRecord(`Events/${eventId}`);

        if (!eventRecord) {
            throw new createError[404]("Event not found");
        }

        await deleteTicketsByEventId(eventId)

        // Delete the event from the database
        await deleteRecord(`Events/${eventId}`);

        return res.status(200).send({ message: "Event deleted successfully" });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Function to add event
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const addEventType = async (req, res, next) => {
    try {
        const validResult = await eventTypeValidSchema.validateAsync(req.body);

        // Generate a new UUID
        const eventTypeId = uuidv4();

        const eventTypePath = `Events-Type/${eventTypeId}`;

        /**
         * Create Record
         */
        const recordData = {
            eventTypeId: eventTypeId,
            eventTypeName: validResult.eventTypeName,
        };
        await createRecord(eventTypePath, recordData);

        return res.status(200).send({
            message: "true",
            eventId: eventTypeId,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


/**
 * Function to get all event types
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getEventTypes = async (req, res, next) => {
    try {
        const eventTypes = await getAllRecords("Events-Type");

        res.status(200).send(eventTypes);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Function to get Events by event type ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getEventsByEventsTypeId = async (req, res, next) => {
    try {
        const eventTypeId = req.params.eventTypeId;

        /**
         * Check if type does not exists
         */
        const eventTypePath = `Events-Type/${eventTypeId}`;
        const eventTypeRecord = await readRecord(eventTypePath);

        if (!eventTypeRecord) {
            throw new createError[404]("Event type not found");
        }

        const events = await getEventsByType(eventTypeId);

        res.status(200).send(events);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Function to get all tickets
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getTickets = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        /**
         * Check if event does not exists
         */
        const event = `Events/${eventId}`;
        const eventRecord = await readRecord(event);

        if (!eventRecord) {
            return res.status(404).json({
                status: 404,
                message: "Event not found"
            });
        }

        const tickets = await getTicketsWithEvents(eventId);
        res.status(200).send(tickets);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Function to confirm Ticket
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const confirmTicket = async (req, res, next) => {
    try {

        const ticketId = req.params.ticketId;

        const ticketPath = `Tickets/${ticketId}`;

        /**
         * Check if ticket exists
         */
        const ticketRecord = await readRecord(ticketPath);

        if (!ticketRecord) {
            return res.status(404).json({
                status: 404,
                message: "Ticket not found"
            });
        }

        /**
         * Update event
         */
        const recordData = {
            status: req.body.status
        };
        await updateRecord(ticketPath, recordData);

        return res.status(200).send({
            message: "true",
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Function to approve on all tickets
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const approveAllTickets = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;

        /**
         * Check if type does not exists
         */
        const eventPath = `Events/${eventId}`;
        const eventRecord = await readRecord(eventPath);

        if (!eventRecord) {
            throw new createError[404]("User not found");
        }

        const tickets = await approveTicketsByEventId(eventId)

        res.status(200).send(tickets);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Function to get user detials by userId
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getUserByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        /**
         * Check if type does not exists
         */
        const userPath = `Users/${userId}`;
        const userRecord = await readRecord(userPath);

        if (!userRecord) {
            throw new createError[404]("User not found");
        }

        res.status(200).send(userRecord);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Function to get Tickets Of Specific User
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getTicketsOfSpecificUser = async (req, res, next) => {

    try {

        const userId = req.params.userId;

        /**
         * Check if user does not exists
         */
        const userPath = `Users/${userId}`;
        const userRecord = await readRecord(userPath);

        if (!userRecord) {
            return res.status(404).json({
                status: 404,
                message: "Error, User not found"
              });
        }

        const history=await getHistoryById(userId);        
    
        return res.status(200).send({
            history
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};


module.exports = {
    addEvent,
    editEvent,
    deleteEvent,
    addEventType,
    getEventTypes,
    getEventsByEventsTypeId,
    getTickets,
    confirmTicket,
    getUserByUserId,
    approveAllTickets,
    getTicketsOfSpecificUser

};
