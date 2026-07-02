#!/bin/bash
# Stop PostgreSQL

DB_DIR="$(cd "$(dirname "$0")" && pwd)/db"
pg_ctl -D "$DB_DIR/data" stop
echo "PostgreSQL stopped"
