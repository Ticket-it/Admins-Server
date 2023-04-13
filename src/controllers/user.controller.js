// Important requires
const createError = require("http-errors");
const { database } = require("../config/firebaseConfig");
const { ref, set, get, child, update } = require("firebase/database");

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
            sub:"123",
            name:"Test"
        }

        // Insert the user
        set(ref(database, "Users/" + response.sub), {
            userId: response.sub,
            name: response.name,
        });

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
};
