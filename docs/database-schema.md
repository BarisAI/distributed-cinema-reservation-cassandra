# Database Schema

This project uses Apache Cassandra as the distributed database for a cinema reservation system.

The database is designed according to Cassandra's query-based data modeling approach. Instead of using joins, the project stores reservation data in multiple tables for different queries.

## Keyspace

```sql
CREATE KEYSPACE IF NOT EXISTS cinema_reservation
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 3
};
```

The keyspace is named `cinema_reservation`.

The replication factor is set to `3` because the project is designed to run with a 3-node Cassandra cluster.

## Tables

The project uses the following Cassandra tables:

```txt
reservations_by_session
reservations_by_id
reservations_by_customer
reservation_events
```

## reservations_by_session

This table stores reservations by movie and session.

It is used to display the seat map and show which seats are already reserved.

```sql
CREATE TABLE IF NOT EXISTS reservations_by_session (
  movie_id text,
  session_id text,
  seat_number text,
  reservation_id text,
  customer_name text,
  status text,
  created_at timestamp,
  updated_at timestamp,
  PRIMARY KEY ((movie_id, session_id), seat_number)
);
```

The partition key is `(movie_id, session_id)`.

The clustering key is `seat_number`.

This makes it possible to list all reservations for one movie session efficiently.

## reservations_by_id

This table stores reservations by reservation ID.

It is used when the application needs to find, update, or cancel one reservation.

```sql
CREATE TABLE IF NOT EXISTS reservations_by_id (
  reservation_id text PRIMARY KEY,
  movie_id text,
  session_id text,
  seat_number text,
  customer_name text,
  status text,
  created_at timestamp,
  updated_at timestamp
);
```

## reservations_by_customer

This table stores reservations by customer name.

It is used to see which reservations were made by a specific customer.

```sql
CREATE TABLE IF NOT EXISTS reservations_by_customer (
  customer_name text,
  reservation_id text,
  movie_id text,
  session_id text,
  seat_number text,
  status text,
  created_at timestamp,
  updated_at timestamp,
  PRIMARY KEY ((customer_name), reservation_id)
);
```

## reservation_events

This table stores simple reservation events.

Examples of event types:

```txt
CREATED
UPDATED
CANCELLED
SYSTEM_INITIALIZED
```

```sql
CREATE TABLE IF NOT EXISTS reservation_events (
  event_id text,
  reservation_id text,
  event_type text,
  movie_id text,
  session_id text,
  seat_number text,
  customer_name text,
  created_at timestamp,
  PRIMARY KEY (event_id)
);
```

## Double Booking Prevention

The system prevents double booking with Cassandra lightweight transactions.

```sql
INSERT INTO reservations_by_session (...)
VALUES (...)
IF NOT EXISTS;
```

This means that if two clients try to reserve the same seat at the same time, only one request can succeed.

## Summary

The schema supports:

* creating reservations
* updating reservations
* viewing reservations
* seeing who made a reservation
* cancelling reservations
* bulk cancellation
* preventing double booking
* stress testing concurrent requests