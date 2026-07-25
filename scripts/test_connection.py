#!/usr/bin/env python3
"""
scripts/test_connection.py

Quick script to test connectivity to the Postgres database using environment vars.
Usage:
  pip install psycopg2-binary python-dotenv
  python scripts/test_connection.py
"""

import os
import sys

try:
    import psycopg2
except ImportError:
    print("Missing dependency: install with `pip install psycopg2-binary`")
    sys.exit(1)

from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()  # loads .env in repo root if present

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "medhelp")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

DSN = f"host={DB_HOST} port={DB_PORT} dbname={DB_NAME} user={DB_USER} password={DB_PASSWORD}"

def main():
    try:
        conn = psycopg2.connect(DSN)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT version() AS pg_version, current_database() AS db;")
        row = cur.fetchone()
        print("Connected to:", row['db'])
        print("Postgres version:", row['pg_version'])
        cur.close()
        conn.close()
        print("Connection test succeeded.")
    except Exception as e:
        print("Connection test failed:", str(e))
        sys.exit(2)

if __name__ == "__main__":
    main()
