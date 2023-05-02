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

// Function to delete tickets by event id
async function deleteTicketsByEventId(eventId) {

    // Delete all Tickets nodes with the same eventid
    const ticketsRef = ref(database, "Tickets");
    const ticketsSnapshot = await get(ticketsRef);

    if (ticketsSnapshot.exists()) {
        ticketsSnapshot.forEach((ticketChild) => {
            const ticketData = ticketChild.val();
            if (ticketData.eventId === eventId) {
                const ticketId = ticketChild.key;
                deleteRecord(`Tickets/${ticketId}`);
            }
        });
    }
}

// Function to get all tickets with event details
async function getTicketsWithEvents(paramsEventId) {
    const ticketsRef = ref(database, "Tickets");
    const ticketsSnapshot = await get(ticketsRef);

    const tickets = [];
    if (ticketsSnapshot.exists()) {
        const ticketPromises = [];
        ticketsSnapshot.forEach((ticketChild) => {
            const ticketData = ticketChild.val();
            const eventId = ticketData.eventId;
            if (paramsEventId == eventId) {
                const eventPromise = readRecord(`Events/${eventId}`).then((eventRecord) => {
                    if (eventRecord) {
                        ticketData.eventDetails = eventRecord;
                        tickets.push(ticketData);
                    }
                });
                ticketPromises.push(eventPromise);
            }

        });
        await Promise.all(ticketPromises);
    }

    return tickets;
}



async function approveTicketsByEventId(paramsEventId) {
    const ticketsRef = ref(database, "Tickets");
    const ticketsSnapshot = await get(ticketsRef);
  
    const tickets = [];
  
    if (ticketsSnapshot.exists()) {
      const ticketPromises = [];
  
      ticketsSnapshot.forEach((ticketChild) => {
        const ticketData = ticketChild.val();
        const eventId = ticketData.eventId;
        console.log(ticketData.ticketId)
  
        if (paramsEventId == eventId) {
          const recordData = {
            status: "Approved"
          };
          const promise = updateRecord(`Tickets/${ticketData.ticketId}`, recordData)
            .then(() => {
              // Update the ticketData object with the new status
              ticketData.status = "Approved";
            });
          ticketPromises.push(promise);
        }
        
        tickets.push(ticketData);
      });
  
      await Promise.all(ticketPromises);
    }
  
    return tickets;
  }
  
  // Function to get all events by event type id and filter events by date and time
async function getHistoryById(userId) {
    const ticketsRef = ref(database, "Tickets");
    const ticketsSnapshot = await get(ticketsRef);

    let subObject = {}
    const tickets = [];
    if (ticketsSnapshot.exists()) {
        const ticketPromises = [];
        ticketsSnapshot.forEach((ticketChild) => {
            const ticketData = ticketChild.val();
            if (ticketData.userId == userId) {
                const eventPromise = readRecord(`Events/${ticketData.eventId}`).then(async (eventRecord) => {
                    if (eventRecord) {
                        ticketData.eventDetails = eventRecord;
                        ticketData.eventDetails.availableTickets = "";
                        tickets.push(ticketData);
                    }
                });
                ticketPromises.push(eventPromise);
            }

        });
        subObject = {
            tickets,
        }
        await readRecord(`Users/${userId}`).then((userRecord) => {
            subObject.email = userRecord.email;
            subObject.fullName = userRecord.fullName;
        });
        await Promise.all(ticketPromises);
    }

    return subObject;
}


module.exports = {
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

};
