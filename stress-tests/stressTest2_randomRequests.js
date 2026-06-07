const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

const movies = ["MOVIE_1", "MOVIE_2", "MOVIE_3"];
const sessions = ["SESSION_12_00", "SESSION_15_00", "SESSION_18_00"];
const seats = [
  "A1", "A2", "A3", "A4", "A5", "A6",
  "B1", "B2", "B3", "B4", "B5", "B6",
  "C1", "C2", "C3", "C4", "C5", "C6",
  "D1", "D2", "D3", "D4", "D5", "D6",
  "E1", "E2", "E3", "E4", "E5", "E6"
];

const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const createRandomReservation = async (clientName, index) => {
  const payload = {
    movieId: randomItem(movies),
    sessionId: randomItem(sessions),
    seatNumber: randomItem(seats),
    customerName: `${clientName}_${index}`
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/reservations`, payload);

    return {
      success: true,
      clientName,
      status: response.status,
      payload,
      reservationId: response.data.data.reservationId
    };
  } catch (error) {
    return {
      success: false,
      clientName,
      status: error.response?.status || 500,
      payload,
      message: error.response?.data?.message || error.message
    };
  }
};

const run = async () => {
  const clients = ["RandomClientA", "RandomClientB", "RandomClientC"];
  const requestsPerClient = 40;
  const requests = [];
  const startedAt = Date.now();

  for (const client of clients) {
    for (let i = 0; i < requestsPerClient; i++) {
      requests.push(createRandomReservation(client, i + 1));
    }
  }

  const results = await Promise.all(requests);
  const successCount = results.filter((result) => result.success).length;
  const failedCount = results.length - successCount;
  const conflictCount = results.filter((result) => result.status === 409).length;
  const finishedAt = Date.now();

  console.log("Stress Test 2: Two or more clients make random possible requests");
  console.log(`Clients: ${clients.join(", ")}`);
  console.log(`Total requests: ${results.length}`);
  console.log(`Successful reservations: ${successCount}`);
  console.log(`Failed requests: ${failedCount}`);
  console.log(`Conflict responses: ${conflictCount}`);
  console.log(`Duration: ${finishedAt - startedAt} ms`);
  console.log("Expected result: random requests should be processed without big delays and without double booking.");
};

run().catch((error) => {
  console.error("Stress Test 2 failed");
  console.error(error.message);
});