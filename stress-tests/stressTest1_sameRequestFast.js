const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

const payload = {
  movieId: "MOVIE_1",
  sessionId: "SESSION_12_00",
  seatNumber: "A1",
  customerName: "StressTestClient"
};

const run = async () => {
  const totalRequests = 50;
  const requests = [];

  const startedAt = Date.now();

  for (let i = 0; i < totalRequests; i++) {
    requests.push(
      axios.post(`${API_BASE_URL}/reservations`, payload)
        .then((response) => ({
          success: true,
          status: response.status,
          data: response.data
        }))
        .catch((error) => ({
          success: false,
          status: error.response?.status || 500,
          message: error.response?.data?.message || error.message
        }))
    );
  }

  const results = await Promise.all(requests);
  const successCount = results.filter((result) => result.success).length;
  const failedCount = results.length - successCount;
  const conflictCount = results.filter((result) => result.status === 409).length;
  const finishedAt = Date.now();

  console.log("Stress Test 1: Same request very quickly");
  console.log(`Total requests: ${totalRequests}`);
  console.log(`Successful reservations: ${successCount}`);
  console.log(`Failed requests: ${failedCount}`);
  console.log(`Conflict responses: ${conflictCount}`);
  console.log(`Duration: ${finishedAt - startedAt} ms`);
  console.log("Expected result: only one request should reserve seat A1.");
};

run().catch((error) => {
  console.error("Stress Test 1 failed");
  console.error(error.message);
});