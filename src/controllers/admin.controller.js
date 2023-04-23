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

/**
 * Test Function
 * @param {*} req
 * @param {*} res
 * @returns
 */
const test = async (req, res,next) => {
    try {
        if (0) {
            throw new createError[422](
                "Error no userId/userDetails not found!"
            );
        }

        const response = {
            sub:"1234",
            name:"Test2"
        }


        /**
         * Create Record
         */
        const recordPath = 'Users/'+ response.sub;
        const recordData = { userId: response.sub,
            name: response.name,};
        await createRecord(recordPath, recordData);

        /**
         * Read Record
         */
        const recordPath2 = `Users/${response.sub}`;
        const recordData2 = await readRecord(recordPath2);

        console.log(recordData2)

        const response2 = {
            sub:"1234",
            name:"Test5"
        }

        /**
         * Update Record
         */
        const recordPath3 = 'Users/'+ response.sub;
        const recordData3 = { userId: response2.sub,
            name: response2.name,};
        await updateRecord(recordPath3, recordData3);

        /**
         * Delete Record
         */
        const recordPath4 = `Users/${response2.sub}`;
        await deleteRecord(recordPath4);

        return res.status(200).send({
            message: "true",
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = {
    test,
    addEvent,
    editEvent,
    deleteEvent,
};
