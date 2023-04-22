// Important requires
const createError = require("http-errors");
const { v4: uuidv4 } = require('uuid');
const { createRecord, readRecord, updateRecord, deleteRecord } = require('../utils/CRUD');
const eventValidSchema =
    require("../utils/event.validationSchema").eventValidSchemaRegister;

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

        const eventPath = `Users/${eventId}`;

        /**
         * Create Record
         */
        const recordData = { 
            eventId: eventId,
            eventName: validResult.eventName,
            location: validResult.location,
            availableTickets: validResult.availableTickets,
            price: validResult.price,
        };
        await createRecord(userPath, recordData);

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
const editEvent = async (req, res,next) => {

}

/**
 * Function to delete event
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const deleteEvent = async (req, res,next) => {

    const eventId = req.params.eventId;

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
