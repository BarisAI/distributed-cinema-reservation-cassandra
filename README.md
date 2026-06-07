# Distributed Cinema Reservation System

A distributed cinema reservation application built with **Apache Cassandra**, **Node.js**, and **React** for the Big Data and Distributed Processing course.

The system allows users to create, update, view, cancel, and bulk cancel cinema seat reservations through a GUI. Reservation data is stored in a 3-node Cassandra cluster.

## Team

Barış Sürmelioğlu
Ozan Polat

## Tech Stack

* Apache Cassandra
* Docker Compose
* Node.js
* Express.js
* React
* Vite
* Cassandra Driver
* Axios

## Features

* Create cinema seat reservations
* Update existing reservations
* View reservations by movie session
* See who made each reservation
* Cancel a reservation
* Bulk cancel multiple reservations
* Prevent double booking with Cassandra `IF NOT EXISTS`
* Run stress tests for concurrent reservation scenarios

## Project Structure

```txt
distributed-cinema-reservation-cassandra/
├── backend/
├── frontend/
├── cassandra/
├── stress-tests/
├── docs/
├── docker-compose.yml
├── README.md
└── package.json
```

## Setup

Install dependencies:

```bash
npm run install-all
```

Start Cassandra cluster:

```bash
docker compose up -d
```

Open Cassandra shell:

```bash
docker exec -it cassandra-node-1 cqlsh
```

Create keyspace and tables:

```sql
SOURCE '/cql/schema.cql';
SOURCE '/cql/seed.cql';
```

Start backend:

```bash
npm run backend
```

Start frontend:

```bash
npm run frontend
```

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:5000
```

## Stress Tests

Run all stress tests:

```bash
npm run stress
```

Run a single stress test:

```bash
npm run test1 --prefix stress-tests
npm run test2 --prefix stress-tests
npm run test3 --prefix stress-tests
npm run test4 --prefix stress-tests
npm run test5 --prefix stress-tests
```

## Cassandra Notes

The project uses query-based Cassandra tables:

* `reservations_by_session`
* `reservations_by_id`
* `reservations_by_customer`
* `reservation_events`

Double booking is prevented with a lightweight transaction:

```sql
INSERT INTO reservations_by_session (...) VALUES (...) IF NOT EXISTS;
```

## Documentation

Additional documentation is available in the `docs/` folder.

* `docs/database-schema.md`
* `docs/report.md`
* `docs/demo-notes.md`

## License

MIT