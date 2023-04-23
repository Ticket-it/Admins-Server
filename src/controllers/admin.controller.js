// Important requires
const createError = require("http-errors");
const { v4: uuidv4 } = require('uuid');
const { createRecord, readRecord, updateRecord, deleteRecord } = require('../utils/CRUD');
const eventValidSchema =
    require("../utils/event.validationSchema").eventValidSchema;

/**
 * Function to add event
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const addEvent = async (req, res,next) => {

    try{

        const validResult = await eventValidSchema.validateAsync(req.body);

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
        };
        await createRecord(eventPath, recordData);

        return res.status(200).send({
            message: "true",
            eventId: eventId
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
}

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
        throw new createError[404](
            "Event not found"
        );
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
const deleteEvent = async (req, res,next) => {

    const eventId = req.params.eventId;

    try {

    // Check if the event exists in the database
    const eventRecord = await readRecord(`Events/${eventId}`);

    if (!eventRecord) {
        throw new createError[404](
            "Event not found"
        );
      }

    // Delete the event from the database
    await deleteRecord(`Events/${eventId}`);

    return res.status(200).send({ message: "Event deleted successfully" });
    
  } catch (error) {
    console.error(error);
    next(error);
  }

}

module.exports = {
    addEvent,
    editEvent,
    deleteEvent,
};
