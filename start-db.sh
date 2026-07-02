#!/bin/bash
# Start PostgreSQL using project db directory

DB_DIR="$(cd "$(dirname "$0")" && pwd)/db"
pg_ctl -D "$DB_DIR/data" -l "$DB_DIR/postgres.log" start
echo "PostgreSQL started (logs: $DB_DIR/postgres.log)"
