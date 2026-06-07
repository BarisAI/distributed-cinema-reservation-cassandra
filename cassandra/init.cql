CREATE KEYSPACE IF NOT EXISTS cinema_reservation
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 3
};

USE cinema_reservation;