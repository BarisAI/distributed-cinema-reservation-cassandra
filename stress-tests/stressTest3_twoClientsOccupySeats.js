const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

const seats = [
  "A1", "A2", "A3", "A4", "A5", "A6",
  "B1", "B2", "B3", "B4", "B5", "B6",
  "C1", "C2", "C3", "C4", "C5", "C6",
  "D1", "D2", "D3", "D4", "D5", "D6",
  "E1", "E2", "E3", "E4", "E5", "E6"
];

const reserveSeat = async (clientName, seatNumber) => {
  const payload = {
    movieId: "MOVIE_2",
    sessionId: "SESSION_17_30",
    seatNumber,
    customerName: clientName
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/reservations`, payload);

    return {
      success: true,
      clientName,
      seatNumber,
      reservationId: response.data.data.reservationId
    };
  } catch (error) {
    return {
      success: false,
      clientName,
      seatNumber,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message
    };
  }
};

const run = async () => {
  const startedAt = Date.now();

  const clientARequests = seats.map((seatNumber) => reserveSeat("PartyA", seatNumber));
  const clientBRequests = seats.map((seatNumber) => reserveSeat("PartyB", seatNumber));

  const results = await Promise.all([...clientARequests, ...clientBRequests]);

  const successfulResults = results.filter((result) => result.success);
  const partyAReservations = successfulResults.filter((result) => result.clientName === "PartyA").length;
  const partyBReservations = successfulResults.filter((result) => result.clientName === "PartyB").length;
  const uniqueReservedSeats = new Set(successfulResults.map((result) => result.seatNumber));
  const finishedAt = Date.now();

  console.log("Stress Test 3: Immediate occupancy of all seats on 2 clients");
  console.log(`Total available seats: ${seats.length}`);
  console.log(`Total successful reservations: ${successfulResults.length}`);
  console.log(`Unique reserved seats: ${uniqueReservedSeats.size}`);
  console.log(`PartyA reservations: ${partyAReservations}`);
  console.log(`PartyB reservations: ${partyBReservations}`);
  console.log(`Failed or conflict requests: ${results.length - successfulResults.length}`);
  console.log(`Duration: ${finishedAt - startedAt} ms`);
  console.log("Expected result: no double booking, both parties should get some reservations.");
};

run().catch((error) => {
  console.error("Stress Test 3 failed");
  console.error(error.message);
});