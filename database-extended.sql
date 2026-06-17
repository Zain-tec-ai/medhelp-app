-- Extended MedHelp Database with more health topics and medicines
-- Run after initial database.sql setup

USE medhelp;

-- Add more health topics
INSERT INTO health_topics (type, title, summary, keywords, reviewed_by, reviewed_at) VALUES
('symptom', 'Nausea', 'Feeling sick or queasy. Can be caused by food, motion, medication, or medical conditions. Stay hydrated and rest when possible.', 'vomit, motion sickness, stomach, queasy', 'Clinical Review Team', '2026-06-15'),
('symptom', 'Cough', 'Often linked to colds, allergies, asthma, or infection. Seek care for breathing trouble, chest pain, or blood in mucus.', 'cold, allergy, asthma, throat, bronchitis', 'Clinical Review Team', '2026-06-15'),
('symptom', 'Sore Throat', 'Throat inflammation can be viral or bacterial. Most recover in 7-10 days with rest and fluids. Consult a doctor if persistent.', 'throat pain, strep, pharyngitis, tonsillitis, swallow', 'Clinical Review Team', '2026-06-15'),
('symptom', 'Body Aches', 'Muscle or joint pain from exercise, illness, or strain. Usually improves with rest, hydration, and over-the-counter pain relief.', 'muscle pain, soreness, joints, myalgia', 'Clinical Review Team', '2026-06-15'),
('symptom', 'Fatigue', 'Persistent tiredness can signal infection, anemia, thyroid issues, or sleep problems. Seek medical advice if severe or prolonged.', 'tired, weakness, exhaustion, energy, sleep', 'Clinical Review Team', '2026-06-15'),
('symptom', 'Dizziness', 'Feeling lightheaded or off-balance. Can stem from low blood pressure, dehydration, inner ear issues, or anxiety. Rest and hydrate.', 'vertigo, lightheaded, balance, spinning, giddy', 'Clinical Review Team', '2026-06-15'),
('symptom', 'Chill', 'Feeling cold with or without fever. Often signals infection or illness. Monitor temperature and stay warm.', 'cold, shivering, fever, chills, clammy', 'Clinical Review Team', '2026-06-15'),
('symptom', 'Abdominal Pain', 'Stomach or belly discomfort can have many causes. Seek urgent care for severe pain, persistent vomiting, or blood.', 'stomach pain, cramp, belly ache, abdomen, bowel', 'Clinical Review Team', '2026-06-15'),
('symptom', 'Chest Discomfort', 'Chest pain or tightness demands urgent medical attention. Call emergency services if accompanied by shortness of breath or sweating.', 'chest pain, palpitation, heart, breath, angina', 'Cardiologist Review', '2026-06-15'),
('symptom', 'Rash', 'Skin irritation or reaction to allergen, infection, or irritant. Avoid scratching and consult a doctor if spreading or severe.', 'skin irritation, hives, eczema, dermatitis, itching', 'Dermatology Team', '2026-06-15'),

('medicine', 'Amoxicillin', 'An antibiotic used to treat bacterial infections like ear infections, strep throat, and urinary tract infections. Take as prescribed.', 'antibiotic, bacterial, infection, penicillin', 'Pharmacy Review', '2026-06-15'),
('medicine', 'Metformin', 'Used to manage type 2 diabetes by controlling blood sugar levels. Often the first medication prescribed for diabetes.', 'diabetes, blood sugar, glucose, type 2', 'Endocrinology', '2026-06-15'),
('medicine', 'Lisinopril', 'An ACE inhibitor used to treat high blood pressure and heart failure. Helps prevent stroke and heart attack.', 'hypertension, blood pressure, ACE, heart', 'Cardiology', '2026-06-15'),
('medicine', 'Omeprazole', 'Reduces stomach acid to treat acid reflux, heartburn, and ulcers. Often used long-term under medical supervision.', 'reflux, heartburn, acid, ulcer, GERD, PPI', 'Gastroenterology', '2026-06-15'),
('medicine', 'Atorvastatin', 'A statin that lowers cholesterol and reduces heart disease risk. Part of cardiovascular health management.', 'cholesterol, statin, heart disease, lipid', 'Cardiology', '2026-06-15'),
('medicine', 'Levothyroxine', 'Thyroid hormone replacement for hypothyroidism. Maintains healthy metabolism and energy levels.', 'thyroid, hypothyroidism, hormone, TSH', 'Endocrinology', '2026-06-15'),
('medicine', 'Aspirin', 'Used for pain relief, fever reduction, and blood thinning. Low-dose aspirin is used for heart attack prevention in some patients.', 'pain, fever, blood thinner, anti-inflammatory', 'Pharmacy Review', '2026-06-15'),
('medicine', 'Diphenhydramine', 'An antihistamine used for allergies, itching, and sleep aid. May cause drowsiness in some people.', 'allergy, antihistamine, sleep, itching, hives', 'Pharmacy Review', '2026-06-15'),
('medicine', 'Loratadine', 'A non-drowsy antihistamine for allergies and hives. Safe for long-term use without significant drowsiness.', 'allergy, antihistamine, hives, seasonal', 'Pharmacy Review', '2026-06-15'),
('medicine', 'Ibuprofen', 'A non-steroidal anti-inflammatory used for pain, fever, and inflammation. Not suitable for some heart or stomach conditions.', 'pain, inflammation, fever, NSAID, arthritis', 'Pharmacy Review', '2026-06-15'),

('condition', 'Type 2 Diabetes', 'A chronic metabolic disorder affecting blood sugar control. Managed through diet, exercise, medication, and regular monitoring.', 'blood sugar, glucose, insulin, diabetes, pancreas', 'Endocrinology', '2026-06-15'),
('condition', 'Hypertension', 'High blood pressure that increases risk of heart disease and stroke. Often asymptomatic but requires monitoring and treatment.', 'blood pressure, heart, stroke, cardiovascular', 'Cardiology', '2026-06-15'),
('condition', 'COPD', 'Chronic obstructive pulmonary disease affecting breathing. Progressive lung disease linked to smoking.', 'lung, breathing, emphysema, chronic, respiratory', 'Pulmonology', '2026-06-15'),
('condition', 'Asthma', 'Chronic airway inflammation causing breathing difficulty. Managed with inhalers and avoiding triggers.', 'breathing, airways, inflammation, inhaler, wheezing', 'Pulmonology', '2026-06-15'),
('condition', 'Anxiety Disorder', 'Excessive worry and nervousness affecting daily life. Treatable with therapy, medication, and lifestyle changes.', 'anxiety, panic, stress, mental health, worry', 'Mental Health', '2026-06-15'),
('condition', 'Depression', 'Persistent low mood and loss of interest affecting functioning. Professional support and treatment can help significantly.', 'depression, mood, mental health, sadness, treatment', 'Mental Health', '2026-06-15'),
('condition', 'Arthritis', 'Joint inflammation causing pain and stiffness. Many types; management includes exercise, medication, and therapy.', 'joint, pain, inflammation, stiffness, rheumatoid', 'Rheumatology', '2026-06-15'),
('condition', 'Allergies', 'Immune system reaction to harmless substances like pollen or pet dander. Managed through avoidance and medication.', 'allergy, immune, pollen, reaction, antihistamine', 'Allergy', '2026-06-15'),
('condition', 'Gastroesophageal Reflux', 'Stomach acid backing up into the esophagus causing heartburn. Managed with lifestyle changes and medication.', 'reflux, heartburn, acid, GERD, esophagus', 'Gastroenterology', '2026-06-15'),
('condition', 'Migraine Headaches', 'Severe headaches often with nausea and sensitivity to light. Triggers include stress, foods, and hormonal changes.', 'headache, pain, migraine, nausea, light sensitivity', 'Neurology', '2026-06-15');

-- Add more medicine salts
INSERT INTO medicine_salts (salt_name, aliases, common_use, safety_note) VALUES
('Lisinopril', 'enalapril, ACE inhibitor', 'Used to treat high blood pressure and heart failure.', 'May cause cough, dizziness, or low blood pressure. Avoid in pregnancy.'),
('Omeprazole', 'proton pump inhibitor, PPI', 'Reduces stomach acid for reflux and ulcers.', 'Long-term use may affect B12 absorption. Take as directed.'),
('Atorvastatin', 'statin, lipid-lowering', 'Lowers cholesterol and reduces cardiovascular risk.', 'May cause muscle pain. Monitor liver function. Avoid with certain foods.'),
('Levothyroxine', 'thyroid hormone, T4', 'Replaces thyroid hormone in hypothyroidism.', 'Take on empty stomach. Avoid with iron or calcium supplements.'),
('Aspirin', 'acetylsalicylic acid, salicylate', 'Pain relief and blood thinning.', 'Not suitable for some stomach conditions or bleeding disorders. Use lowest effective dose.'),
('Diphenhydramine', 'antihistamine, H1 blocker', 'Allergy relief and sleep aid.', 'Causes drowsiness. Avoid driving or operating machinery.'),
('Loratadine', 'non-drowsy antihistamine', 'Seasonal and year-round allergy relief.', 'Generally well-tolerated. Safe for long-term use.'),
('Albuterol', 'salbutamol, beta-2 agonist', 'Relieves acute asthma and breathing symptoms.', 'Use as prescribed. Overuse indicates need for better control medication.'),
('Metoprolol', 'beta-blocker, bisoprolol', 'Treats high blood pressure and heart conditions.', 'Do not stop suddenly. May cause fatigue or dizziness initially.'),
('Sertraline', 'SSRI, antidepressant', 'Treats depression, anxiety, and OCD.', 'May take 4-6 weeks for full effect. Can affect sleep initially.');

-- Add health education content
INSERT INTO health_topics (type, title, summary, keywords, reviewed_by, reviewed_at) VALUES
('condition', 'Common Cold', 'A viral infection of the upper respiratory tract. Usually resolves in 7-10 days with rest and fluids.', 'cold, virus, respiratory, symptoms, recovery', 'Clinical Review Team', '2026-06-15'),
('condition', 'Flu', 'Influenza virus causing fever, body aches, and fatigue. More severe than cold. Vaccine available annually.', 'flu, influenza, vaccine, virus, fever', 'Infectious Disease', '2026-06-15'),
('symptom', 'Joint Pain', 'Pain in joints from arthritis, injury, or inflammation. Management includes rest, ice, compression, and elevation (RICE).', 'joint, arthritis, pain, stiffness, inflammation', 'Rheumatology', '2026-06-15'),
('symptom', 'Sleep Problems', 'Difficulty falling or staying asleep. Can affect health and daily functioning. Consider sleep hygiene and professional help.', 'insomnia, sleep, tired, rest, fatigue', 'Sleep Medicine', '2026-06-15'),
('symptom', 'High Fever', 'Fever above 103°F (39.4°C) requires medical attention. Can indicate serious infection or other conditions.', 'fever, temperature, high, infection, dangerous', 'Clinical Review Team', '2026-06-15');
