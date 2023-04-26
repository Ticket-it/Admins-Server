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

        /**
         * Check if event exists
         */
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

module.exports = {
    addEvent,
    editEvent,
    deleteEvent,
    addEventType,
    getEventTypes,
    getEventsByEventsTypeId,
};
