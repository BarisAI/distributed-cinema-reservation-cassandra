const app = require("./app");
const { connectCassandra } = require("./config/cassandraClient");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectCassandra();

    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server");
    console.error(err.message);
    process.exit(1);
  }
};

startServer();