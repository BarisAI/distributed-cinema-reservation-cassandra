# Demo Notes

## Project

Distributed Cinema Reservation System with Apache Cassandra

## Team

Barış Sürmelioğlu
Ozan Polat

## Short Description

This project is a distributed cinema reservation system.

It uses Apache Cassandra as a distributed database. The system runs with Docker Compose and includes a Node.js backend and a React frontend.

Users can create, update, view, cancel, and bulk cancel cinema seat reservations.

## What to Show

During the demo, the following parts can be shown:

* Docker Cassandra containers
* Cassandra cluster status
* Cassandra keyspace and tables
* Backend running on port `5000`
* Frontend running on port `5173`
* Reservation creation
* Reservation update
* Reservation cancellation
* Bulk cancellation
* Stress test results

## Useful Commands

Check Cassandra cluster status:

```bash id="s4ymc3"
docker exec cassandra-node-1 nodetool status
```

Open Cassandra shell:

```bash id="4wtbyj"
docker exec -it cassandra-node-1 cqlsh
```

Show Cassandra tables:

```sql id="whzpk7"
USE cinema_reservation;
DESCRIBE TABLES;
```

Start backend:

```bash id="m73g7d"
npm.cmd run backend
```

Start frontend:

```bash id="m2pq4s"
npm.cmd run frontend
```

Run stress tests:

```bash id="mp2123"
npm.cmd run test1 --prefix stress-tests
npm.cmd run test2 --prefix stress-tests
npm.cmd run test3 --prefix stress-tests
npm.cmd run test4 --prefix stress-tests
npm.cmd run test5 --prefix stress-tests
```

## Demo Flow

First, show that the Cassandra containers are running in Docker.

Then, show the Cassandra cluster status with `nodetool status`.

After that, show the created keyspace and tables in `cqlsh`.

Next, open the backend URL:

```txt id="ief3r1"
http://localhost:5000
```

Then open the frontend URL:

```txt id="745ved"
http://localhost:5173
```

In the frontend, create a new reservation by selecting a movie, session, seat, and customer name.

Then update the reservation by changing the seat or customer name.

After that, cancel one reservation.

Finally, create several reservations and cancel them with the bulk cancellation feature.

## Important Explanation

The project prevents double booking with Cassandra `IF NOT EXISTS`.

```sql id="he0xyo"
INSERT INTO reservations_by_session (...)
VALUES (...)
IF NOT EXISTS;
```

This prevents two clients from reserving the same seat for the same movie and session.

## Scope Note

Authentication and user authorization are not included.

The project focuses on distributed database operations, Cassandra usage, reservation consistency, cancellation operations, and stress testing.

The GUI works as a reservation management interface.