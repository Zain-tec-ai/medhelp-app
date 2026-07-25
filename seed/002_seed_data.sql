-- seed/002_seed_data.sql
-- Sample data to test the medicine-db schema.
-- Run after migrations/001_create_schema.sql.

-- Sample users: one patient, one doctor, one staff
INSERT INTO users (email, password_hash, role)
VALUES
  ('patient1@example.com', '<bcrypt-or-argon2-hash-placeholder>', 'patient'),
  ('dr.singh@example.com', '<bcrypt-or-argon2-hash-placeholder>', 'doctor'),
  ('admin@medhelp.local', '<bcrypt-or-argon2-hash-placeholder>', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Profiles
INSERT INTO user_profiles (user_id, full_name, phone, dob, gender)
SELECT id, 'Aman Kumar', '+91-98XXXXXXXX', '1990-05-10', 'male'
FROM users WHERE email = 'patient1@example.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_profiles (user_id, full_name, phone)
SELECT id, 'Dr. Rajesh Singh', '+91-99XXXXXXXX'
FROM users WHERE email = 'dr.singh@example.com'
ON CONFLICT (user_id) DO NOTHING;

-- Doctor record (doctor-specific info). Only create if user exists and not already a doctor record.
INSERT INTO doctors (user_id, medical_license, bio, clinic_name)
SELECT u.id, 'MD-12345', 'General physician with 10+ years experience', 'Sunrise Clinic'
FROM users u
WHERE u.email = 'dr.singh@example.com'
  AND NOT EXISTS (SELECT 1 FROM doctors d WHERE d.user_id = u.id);

-- Specialties
INSERT INTO specialties (name) VALUES
  ('General Practice'),
  ('Cardiology'),
  ('Dermatology')
ON CONFLICT (name) DO NOTHING;

-- Map doctor to specialties (General Practice)
INSERT INTO doctor_specialties (doctor_id, specialty_id)
SELECT d.user_id, s.id
FROM doctors d, specialties s
WHERE d.user_id = (SELECT id FROM users WHERE email='dr.singh@example.com')
  AND s.name = 'General Practice'
ON CONFLICT DO NOTHING;

-- Medications
INSERT INTO medications (name, rxnorm_code) VALUES
  ('Paracetamol', NULL),
  ('Amoxicillin', NULL),
  ('Atorvastatin', NULL)
ON CONFLICT DO NOTHING;

-- Appointment between patient1 and dr.singh
INSERT INTO appointments (patient_id, doctor_id, scheduled_at, duration_minutes, status, reason, location, created_by)
VALUES (
  (SELECT id FROM users WHERE email='patient1@example.com'),
  (SELECT id FROM users WHERE email='dr.singh@example.com'),
  now() + INTERVAL '3 days',
  30,
  'scheduled',
  'General checkup',
  'Sunrise Clinic',
  (SELECT id FROM users WHERE email='patient1@example.com')
)
ON CONFLICT DO NOTHING;

-- Medical record sample
INSERT INTO medical_records (patient_id, doctor_id, record_type, title, description, data)
VALUES (
  (SELECT id FROM users WHERE email='patient1@example.com'),
  (SELECT id FROM users WHERE email='dr.singh@example.com'),
  'consultation',
  'Initial visit - fever',
  'Patient reported fever and sore throat for 2 days.',
  jsonb_build_object('temperature_c', 38.2, 'bp', '120/80', 'notes', 'Recommend rest and fluids')
)
ON CONFLICT DO NOTHING;

-- Prescription
INSERT INTO prescriptions (patient_id, prescribed_by, notes)
VALUES (
  (SELECT id FROM users WHERE email='patient1@example.com'),
  (SELECT id FROM users WHERE email='dr.singh@example.com'),
  'Prescribed rest, paracetamol as needed for fever'
)
RETURNING id INTO TEMP TABLE tmp_prescription_id;

-- Insert prescription_items (use last inserted prescription)
INSERT INTO prescription_items (prescription_id, medication_id, dosage, frequency, duration, instructions)
SELECT p.id, m.id, '500 mg', 'every 6 hours as needed', '3 days', 'Take with water'
FROM prescriptions p, medications m
WHERE p.patient_id = (SELECT id FROM users WHERE email='patient1@example.com')
  AND m.name = 'Paracetamol'
LIMIT 1;

-- Conversation + messages
INSERT INTO conversations (patient_id, doctor_id, last_message_at)
VALUES (
  (SELECT id FROM users WHERE email='patient1@example.com'),
  (SELECT id FROM users WHERE email='dr.singh@example.com'),
  now()
)
ON CONFLICT DO NOTHING;

INSERT INTO messages (conversation_id, sender_id, content, is_read)
VALUES (
  (SELECT id FROM conversations WHERE patient_id = (SELECT id FROM users WHERE email='patient1@example.com') LIMIT 1),
  (SELECT id FROM users WHERE email='patient1@example.com'),
  'Hello doctor, I have a fever since 2 days.',
  FALSE
)
ON CONFLICT DO NOTHING;

-- Sample audit log entry
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata)
VALUES (
  (SELECT id FROM users WHERE email='dr.singh@example.com'),
  'viewed_record',
  'medical_record',
  (SELECT id FROM medical_records WHERE patient_id = (SELECT id FROM users WHERE email='patient1@example.com') LIMIT 1),
  jsonb_build_object('reason','follow-up','ip','127.0.0.1')
)
ON CONFLICT DO NOTHING;
