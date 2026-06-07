CREATE KEYSPACE IF NOT EXISTS cinema_reservation
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 3
};

USE cinema_reservation;

CREATE TABLE IF NOT EXISTS reservations_by_session (
  movie_id text,
  session_id text,
  seat_number text,
  reservation_id uuid,
  customer_name text,
  status text,
  created_at timestamp,
  updated_at timestamp,
  PRIMARY KEY ((movie_id, session_id), seat_number)
);

CREATE TABLE IF NOT EXISTS reservations_by_id (
  reservation_id uuid PRIMARY KEY,
  movie_id text,
  session_id text,
  seat_number text,
  customer_name text,
  status text,
  created_at timestamp,
  updated_at timestamp
);

CREATE TABLE IF NOT EXISTS reservations_by_customer (
  customer_name text,
  reservation_id uuid,
  movie_id text,
  session_id text,
  seat_number text,
  status text,
  created_at timestamp,
  updated_at timestamp,
  PRIMARY KEY ((customer_name), reservation_id)
);

CREATE TABLE IF NOT EXISTS reservation_events (
  event_id uuid,
  reservation_id uuid,
  event_type text,
  movie_id text,
  session_id text,
  seat_number text,
  customer_name text,
  created_at timestamp,
  PRIMARY KEY (event_id)
);