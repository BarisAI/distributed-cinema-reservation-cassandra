const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

const seats = [
  "A1", "A2", "A3", "A4", "A5", "A6",
  "B1", "B2", "B3", "B4", "B5", "B6",
  "C1", "C2", "C3", "C4", "C5", "C6"
];

const createReservation = async (seatNumber, index) => {
  const payload = {
    movieId: "MOVIE_3",
    sessionId: "SESSION_20_30",
    seatNumber,
    customerName: `CancelReserveClient_${index}`
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

const cancelReservation = async (reservationId) => {
  try {
    await axios.delete(`${API_BASE_URL}/reservations/${reservationId}`);

    return {
      success: true,
      reservationId
    };
  } catch (error) {
    return {
      success: false,
      reservationId,
      message: error.response?.data?.message || error.message
    };
  }
};

const run = async () => {
  const startedAt = Date.now();
  const loops = 5;
  let createdCount = 0;
  let cancelledCount = 0;
  let failedCreateCount = 0;
  let failedCancelCount = 0;

  for (let loop = 1; loop <= loops; loop++) {
    const createResults = await Promise.all(
      seats.map((seatNumber, index) => createReservation(seatNumber, `${loop}_${index + 1}`))
    );

    const createdReservations = createResults.filter((result) => result.success);
    createdCount += createdReservations.length;
    failedCreateCount += createResults.length - createdReservations.length;

    const cancelResults = await Promise.all(
      createdReservations.map((result) => cancelReservation(result.reservationId))
    );

    const cancelledReservations = cancelResults.filter((result) => result.success);
    cancelledCount += cancelledReservations.length;
    failedCancelCount += cancelResults.length - cancelledReservations.length;
  }

  const finishedAt = Date.now();

  console.log("Stress Test 4: Constant cancellations and seat occupancy");
  console.log(`Loops: ${loops}`);
  console.log(`Created reservations: ${createdCount}`);
  console.log(`Cancelled reservations: ${cancelledCount}`);
  console.log(`Failed create operations: ${failedCreateCount}`);
  console.log(`Failed cancel operations: ${failedCancelCount}`);
  console.log(`Duration: ${finishedAt - startedAt} ms`);
  console.log("Expected result: seats should be reserved and cancelled repeatedly without double booking.");
};

run().catch((error) => {
  console.error("Stress Test 4 failed");
  console.error(error.message);
});