# medicine-db

This folder contains a standalone migration + seed + test script for a MedHelp-style PostgreSQL database.

Files:
- migrations/001_create_schema.sql — full DB schema (Postgres)
- seed/002_seed_data.sql — sample test data
- scripts/test_connection.py — simple Python script to verify DB connectivity
- .env.example — template for DB credentials
- .gitignore — repo ignores
- README.md — this file

Quick start (local Postgres)
1. Copy .env.example:
   cp .env.example .env
   Edit .env and set DB connection variables.

2. Create the database (replace values as needed):
   psql -h $DB_HOST -U $DB_USER -c "CREATE DATABASE ${DB_NAME};"

3. Apply schema:
   psql "host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER password=$DB_PASSWORD" \
     -f migrations/001_create_schema.sql

4. Seed sample data (optional):
   psql "host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER password=$DB_PASSWORD" \
     -f seed/002_seed_data.sql

5. Test connection:
   pip install psycopg2-binary python-dotenv
   python scripts/test_connection.py

Notes and next steps
- Password hashes in seed are placeholders. Integrate your auth flow (bcrypt/argon2) to create real hashes.
- Store sensitive files (images/PDFs) in secure object storage (S3) and keep only references (signed URLs).
- For PHI compliance:
  - Encrypt backups and DB storage.
  - Consider application-layer field encryption where required.
  - Implement thorough audit logging and access controls (Row Level Security or application RBAC).
- To commit these files to your repo:
  - Create a branch, add files, commit and push:
    git checkout -b medicine-db
    git add migrations/001_create_schema.sql seed/002_seed_data.sql scripts/test_connection.py .env.example .gitignore README.md
    git commit -m "Add medicine-db migration, seed, and tests"
    git push --set-upstream origin medicine-db

If you want, I can:
- Commit these files directly to the medicine-db-schema branch in the repo for you.
- Convert the schema to a Prisma schema and generate migrations.
- Create a Node/Express example for basic CRUD on appointments and records.

Tell me which of the above you'd like me to do next.
