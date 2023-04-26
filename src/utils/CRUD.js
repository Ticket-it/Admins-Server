// Important requires
const { database } = require("../config/firebaseConfig");
const { ref, set, get, update, remove } = require("firebase/database");

// Function to create a new record
async function createRecord(path, data) {
    return await set(ref(database, path), data);
}

// Function to read a record
async function readRecord(path) {
    const snapshot = await get(ref(database, path));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

// Function to update a record
async function updateRecord(path, data) {
    await update(ref(database, path), data);
}

// Function to delete a record
async function deleteRecord(path) {
    await remove(ref(database, path));
}

// Function to get all records
async function getAllRecords(path) {
    const myRef = ref(database, path);
    const refSnapshot = await get(myRef);

    const myArr = [];
    if (refSnapshot.exists()) {
        refSnapshot.forEach((refChild) => {
            myArr.push(refChild.val());
        });
    }

    return myArr;
}

// Function to get all events by event type id
async function getEventsByType(type) {
    const eventsRef = ref(database, "Events");
    const eventsSnapshot = await get(eventsRef);

    const events = [];
    if (eventsSnapshot.exists()) {
        eventsSnapshot.forEach((eventChild) => {
            const eventData = eventChild.val();
            if (eventData.type === type) {
                const [day, month, year] = eventData.date.split("-");
                const [hours, minutes] = eventData.time.split(":");
                const eventDateTime = new Date(
                    `${year}-${month}-${day}T${hours}:${minutes}:00`
                );
                const now = new Date();
                if (eventDateTime >= now) {
                    events.push(eventData);
                }
            }
        });
    }

    return events;
}

module.exports = {
    createRecord,
    readRecord,
    updateRecord,
    deleteRecord,
    getAllRecords,
    getEventsByType,
};
