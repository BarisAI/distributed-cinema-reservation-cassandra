# Distributed Cinema Reservation System with Apache Cassandra

## Description

This project was developed for the Big Data and Distributed Processing course.

The application is a distributed cinema reservation system. It uses Apache Cassandra as the distributed database, Node.js and Express.js for the backend, and React for the graphical user interface.

Users can create, update, view, cancel, and bulk cancel cinema seat reservations.

The project was developed by Baris Surmelioglu and Ozan Polat.

## Technologies

* Apache Cassandra
* Docker Compose
* Node.js
* Express.js
* React
* Vite
* Cassandra Driver
* Axios

## Distributed Database Setup

The project uses Docker Compose to run a Cassandra cluster.

The Cassandra keyspace is:

```txt id="sfjg21"
cinema_reservation
```

The main Cassandra tables are:

```txt id="g5nlyi"
reservations_by_session
reservations_by_id
reservations_by_customer
reservation_events
```

The database schema was designed according to Cassandra's query-based data modeling approach.

## Main Functionalities

The application supports the main reservation operations required for the project.

Users can make a reservation by selecting a movie, session, seat, and customer name.

Users can update an existing reservation.

Users can view reservations and see who made each reservation.

Users can cancel one reservation.

Users can cancel multiple reservations at the same time.

The project also includes stress test scripts for concurrent reservation requests.

## Double Booking Prevention

A common problem in reservation systems is double booking.

This project prevents double booking with Cassandra lightweight transactions.

```sql id="tzyh7t"
IF NOT EXISTS
```

This is used when inserting a new reservation into the `reservations_by_session` table.

If two clients try to reserve the same seat for the same movie and session at the same time, only one request can succeed.

## Stress Tests

The project includes five stress tests.

Stress Test 1 sends the same reservation request very quickly.

Stress Test 2 sends random reservation requests from multiple clients.

Stress Test 3 simulates two clients trying to reserve many seats at the same time.

Stress Test 4 repeatedly creates and cancels reservations.

Stress Test 5 creates many reservations and cancels them with bulk cancellation.

The stress test results showed that the system handles concurrent requests and prevents double booking.

## Problems Encountered

The main challenge was Cassandra data modeling.

Cassandra requires query-based table design, so the same reservation data had to be stored in multiple tables.

Another challenge was preventing double booking during concurrent requests. This was solved by using Cassandra `IF NOT EXISTS`.

A smaller issue was invalid seat numbers during reservation updates. This was fixed by using a seat dropdown in the frontend and validating seat numbers in the backend.

## Conclusion

The project demonstrates a working distributed database application using Apache Cassandra.

It includes a graphical user interface, backend API, Cassandra database schema, reservation management features, cancellation features, bulk cancellation, and stress tests.

The system satisfies the main requirements of the project assignment.