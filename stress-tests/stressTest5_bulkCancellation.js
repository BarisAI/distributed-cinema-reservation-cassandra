const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

const seats = [
  "A1", "A2", "A3", "A4", "A5", "A6",
  "B1", "B2", "B3", "B4", "B5", "B6",
  "C1", "C2", "C3", "C4", "C5", "C6",
  "D1", "D2", "D3", "D4", "D5", "D6"
];

const createReservation = async (seatNumber, index) => {
  const payload = {
    movieId: "MOVIE_1",
    sessionId: "SESSION_18_00",
    seatNumber,
    customerName: `BulkCancelClient_${index}`
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/reservations`, payload);

    return {
      success: true,
      reservationId: response.data.data.reservationId,
      seatNumber
    };
  } catch (error) {
    return {
      success: false,
      seatNumber,
      message: error.response?.data?.message || error.message
    };
  }
};

const run = async () => {
  const startedAt = Date.now();

  const createResults = await Promise.all(
    seats.map((seatNumber, index) => createReservation(seatNumber, index + 1))
  );

  const createdReservations = createResults.filter((result) => result.success);
  const reservationIds = createdReservations.map((result) => result.reservationId);

  let bulkCancelResult = null;

  try {
    const response = await axios.post(`${API_BASE_URL}/reservations/bulk-cancel`, {
      reservationIds
    });

    bulkCancelResult = response.data.data;
  } catch (error) {
    bulkCancelResult = {
      error: error.response?.data?.message || error.message
    };
  }

  const finishedAt = Date.now();

  console.log("Stress Test 5: Large group cancellation of many reservations");
  console.log(`Reservation create attempts: ${seats.length}`);
  console.log(`Reservations created: ${createdReservations.length}`);
  console.log(`Bulk cancellation request size: ${reservationIds.length}`);

  if (Array.isArray(bulkCancelResult)) {
    const cancelledCount = bulkCancelResult.filter((result) => result.cancelled).length;
    const failedCount = bulkCancelResult.length - cancelledCount;

    console.log(`Cancelled reservations: ${cancelledCount}`);
    console.log(`Failed cancellations: ${failedCount}`);
  } else {
    console.log("Bulk cancellation result:");
    console.log(bulkCancelResult);
  }

  console.log(`Duration: ${finishedAt - startedAt} ms`);
  console.log("Expected result: many reservations should be cancelled in one operation.");
};

run().catch((error) => {
  console.error("Stress Test 5 failed");
  console.error(error.message);
});