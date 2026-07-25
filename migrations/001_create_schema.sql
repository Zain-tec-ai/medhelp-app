-- migrations/001_create_schema.sql
-- PostgreSQL schema for MedHelp (medicine-db)
-- Run as the DB superuser or a user with CREATE EXTENSION privileges.

-- Enable extension for UUID generation and cryptographic helpers
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop-order-safe checks are intentionally omitted; this is a "create" migration
-- Use ALTER/ADD migrations for subsequent changes.

-- Users table: patients, doctors, staff
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- bcrypt/argon2 hash; NULL for OAuth-only accounts
  role TEXT NOT NULL CHECK (role IN ('patient','doctor','staff','admin')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional 1:1 profile data (keeps users table small)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT,
  dob DATE,
  gender TEXT,
  phone TEXT,
  address TEXT,
  emergency_contact JSONB, -- {name,phone,relation}
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Specialties for doctors (e.g., Cardiology)
CREATE TABLE IF NOT EXISTS specialties (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Doctor-specific info (only present for users with role='doctor')
CREATE TABLE IF NOT EXISTS doctors (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  medical_license TEXT UNIQUE,
  bio TEXT,
  practice_address TEXT,
  clinic_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Many-to-many: doctor <-> specialty
CREATE TABLE IF NOT EXISTS doctor_specialties (
  doctor_id UUID REFERENCES doctors(user_id) ON DELETE CASCADE,
  specialty_id INT REFERENCES specialties(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, specialty_id)
);

-- Appointments (patient <> doctor)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT,
  status TEXT NOT NULL CHECK (status IN ('scheduled','confirmed','completed','cancelled','no_show')),
  reason TEXT,
  location TEXT,
  created_by UUID REFERENCES users(id),
  cancelled_by UUID REFERENCES users(id),
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conversations and messages for patient-doctor chat
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT,
  attachments JSONB, -- [{url, filename, type}]
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Medical records (consultations, labs, imaging)
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id),
  record_type TEXT, -- 'consultation','lab','imaging','vitals'
  title TEXT,
  description TEXT,
  data JSONB, -- structured data for labs/vitals
  file_urls JSONB, -- [{url, filename, meta}]
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Medications catalog
CREATE TABLE IF NOT EXISTS medications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rxnorm_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prescriptions + items
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prescribed_by UUID REFERENCES users(id), -- doctor
  notes TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
  medication_id INT REFERENCES medications(id),
  dosage TEXT,
  frequency TEXT,
  duration TEXT,
  instructions TEXT
);

-- Reviews (patients review doctors)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit logs: track access to PHI and actions (important for compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments (patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records (patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions (patient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_patient_doctor ON conversations (patient_id, doctor_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at);

-- Trigger helpers to keep updated_at columns fresh
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers for tables that have updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'users_set_updated_at' AND c.relname = 'users'
  ) THEN
    CREATE TRIGGER users_set_updated_at
      BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'user_profiles_set_updated_at' AND c.relname = 'user_profiles'
  ) THEN
    CREATE TRIGGER user_profiles_set_updated_at
      BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'doctors_set_updated_at' AND c.relname = 'doctors'
  ) THEN
    CREATE TRIGGER doctors_set_updated_at
      BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'medical_records_set_updated_at' AND c.relname = 'medical_records'
  ) THEN
    CREATE TRIGGER medical_records_set_updated_at
      BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
  END IF;
END;
$$;
