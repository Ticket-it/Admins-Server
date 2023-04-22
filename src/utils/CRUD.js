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

module.exports = {
    createRecord,
    readRecord,
    updateRecord,
    deleteRecord,
};
