CREATE DATABASE IF NOT EXISTS medhelp;
USE medhelp;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor', 'admin') NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE health_topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('symptom', 'medicine', 'condition') NOT NULL,
  title VARCHAR(140) NOT NULL,
  summary TEXT NOT NULL,
  keywords VARCHAR(255),
  reviewed_by VARCHAR(120),
  reviewed_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saved_topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_saved_topic (user_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES health_topics(id) ON DELETE CASCADE
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  department VARCHAR(80) NOT NULL,
  preferred_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('new', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'closed') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicine_salts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  salt_name VARCHAR(140) NOT NULL UNIQUE,
  aliases VARCHAR(255),
  common_use TEXT NOT NULL,
  safety_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE salt_scans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  image_url VARCHAR(255),
  detected_text TEXT,
  matched_salts TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO health_topics (type, title, summary, keywords, reviewed_by, reviewed_at) VALUES
('symptom', 'Fever', 'A temporary rise in body temperature. Rest, fluids, and monitoring can help, but persistent high fever needs medical care.', 'temperature, flu, infection, chills', 'Clinical Review Team', '2026-06-01'),
('symptom', 'Headache', 'Common causes include stress, dehydration, vision strain, migraine, or infection. Sudden severe headache needs urgent help.', 'migraine, pain, stress, dehydration', 'Clinical Review Team', '2026-06-01'),
('medicine', 'Paracetamol', 'Used for fever and mild pain. Always follow dosage instructions and avoid combining with other products containing acetaminophen.', 'acetaminophen, pain relief, fever', 'Pharmacy Review Team', '2026-06-01'),
('medicine', 'Ibuprofen', 'An anti-inflammatory pain reliever. It may not be suitable for some stomach, kidney, heart, or pregnancy-related conditions.', 'pain, inflammation, nsaid', 'Pharmacy Review Team', '2026-06-01'),
('condition', 'Diabetes', 'A chronic condition affecting blood sugar control. Care often includes diet, exercise, monitoring, and prescribed medication.', 'blood sugar, insulin, glucose', 'Clinical Review Team', '2026-06-01'),
('condition', 'Hypertension', 'High blood pressure can increase heart and stroke risk. Regular checks and lifestyle changes are important.', 'blood pressure, heart, stroke', 'Clinical Review Team', '2026-06-01');

INSERT INTO medicine_salts (salt_name, aliases, common_use, safety_note) VALUES
('Paracetamol', 'acetaminophen', 'Commonly used for fever and mild pain relief.', 'Avoid duplicate dosing with other products containing paracetamol or acetaminophen.'),
('Ibuprofen', 'nsaid', 'A non-steroidal anti-inflammatory medicine used for pain and swelling.', 'May not be suitable for some stomach, kidney, heart, or pregnancy-related conditions.'),
('Caffeine', '', 'Sometimes combined with pain medicines to improve headache relief.', 'Can worsen sleep problems, anxiety, or palpitations in some people.'),
('Cetirizine', 'cetirizine hydrochloride', 'An antihistamine used for allergy symptoms such as sneezing and itching.', 'May cause drowsiness in some people.'),
('Amoxicillin', 'amoxycillin', 'An antibiotic used for selected bacterial infections when prescribed.', 'Use antibiotics only with medical advice.'),
('Clavulanic Acid', 'potassium clavulanate, clavulanate', 'Often combined with amoxicillin to help treat certain bacterial infections.', 'Use only as prescribed.'),
('Azithromycin', '', 'An antibiotic that should be taken only when prescribed.', 'Use antibiotics only with medical advice.'),
('Metformin', 'metformin hydrochloride', 'Used for blood sugar control in type 2 diabetes.', 'Follow prescribed dose and monitoring advice.'),
('Pantoprazole', 'pantoprazole sodium', 'Used to reduce stomach acid and manage reflux-related symptoms.', 'Long-term use should be reviewed by a clinician.'),
('Domperidone', '', 'Used for nausea or stomach motility problems when prescribed.', 'May not be suitable for people with some heart rhythm risks.');

INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('Demo Patient', 'patient@example.com', '+15551234567', 'replace_with_real_hash', 'patient'),
('Demo Admin', 'admin@example.com', '+15559876543', 'replace_with_real_hash', 'admin');

INSERT INTO appointments (user_id, full_name, phone, department, preferred_date, reason, status) VALUES
(1, 'Demo Patient', '+15551234567', 'General Medicine', '2026-06-20', 'Follow-up for fever and cough', 'new');
