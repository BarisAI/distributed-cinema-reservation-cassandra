const cassandra = require("cassandra-driver");
require("dotenv").config();

const contactPoints = process.env.CASSANDRA_CONTACT_POINTS.split(",");

const client = new cassandra.Client({
  contactPoints,
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE
});

const connectCassandra = async () => {
  await client.connect();
  console.log("Connected to Cassandra cluster");
};

module.exports = {
  client,
  connectCassandra,
  cassandra
};