const healthTopics = [
  {
    id: 1,
    type: "symptom",
    title: "Fever",
    summary: "A temporary rise in body temperature. Rest, fluids, and monitoring can help, but persistent high fever needs medical care.",
    keywords: ["temperature", "flu", "infection", "chills"]
  },
  {
    id: 2,
    type: "symptom",
    title: "Headache",
    summary: "Common causes include stress, dehydration, vision strain, migraine, or infection. Sudden severe headache needs urgent help.",
    keywords: ["migraine", "pain", "stress", "dehydration"]
  },
  {
    id: 3,
    type: "medicine",
    title: "Paracetamol",
    summary: "Used for fever and mild pain. Always follow dosage instructions and avoid combining with other products containing acetaminophen.",
    keywords: ["acetaminophen", "pain relief", "fever"]
  },
  {
    id: 4,
    type: "medicine",
    title: "Ibuprofen",
    summary: "An anti-inflammatory pain reliever. It may not be suitable for some stomach, kidney, heart, or pregnancy-related conditions.",
    keywords: ["pain", "inflammation", "nsaid"]
  },
  {
    id: 5,
    type: "condition",
    title: "Diabetes",
    summary: "A chronic condition affecting blood sugar control. Care often includes diet, exercise, monitoring, and prescribed medication.",
    keywords: ["blood sugar", "insulin", "glucose"]
  },
  {
    id: 6,
    type: "condition",
    title: "Hypertension",
    summary: "High blood pressure can increase heart and stroke risk. Regular checks and lifestyle changes are important.",
    keywords: ["blood pressure", "heart", "stroke"]
  },
  {
    id: 7,
    type: "symptom",
    title: "Cough",
    summary: "Often linked to colds, allergies, asthma, or infection. Seek care for breathing trouble, chest pain, or blood in mucus.",
    keywords: ["cold", "allergy", "asthma", "throat"]
  },
  {
    id: 8,
    type: "condition",
    title: "Anxiety",
    summary: "Anxiety can cause worry, restlessness, fast heartbeat, and sleep issues. Professional support can help manage symptoms.",
    keywords: ["stress", "mental health", "panic", "sleep"]
  }
];

const medicineSalts = [
  {
    name: "Paracetamol",
    aliases: ["paracetamol", "acetaminophen"],
    use: "Commonly used for fever and mild pain relief."
  },
  {
    name: "Ibuprofen",
    aliases: ["ibuprofen"],
    use: "A non-steroidal anti-inflammatory medicine used for pain and swelling."
  },
  {
    name: "Caffeine",
    aliases: ["caffeine"],
    use: "Sometimes combined with pain medicines to improve headache relief."
  },
  {
    name: "Cetirizine",
    aliases: ["cetirizine", "cetirizine hydrochloride"],
    use: "An antihistamine used for allergy symptoms such as sneezing and itching."
  },
  {
    name: "Amoxicillin",
    aliases: ["amoxicillin", "amoxycillin"],
    use: "An antibiotic used for selected bacterial infections when prescribed."
  },
  {
    name: "Clavulanic Acid",
    aliases: ["clavulanic acid", "potassium clavulanate", "clavulanate"],
    use: "Often combined with amoxicillin to help treat certain bacterial infections."
  },
  {
    name: "Azithromycin",
    aliases: ["azithromycin"],
    use: "An antibiotic that should be taken only when prescribed."
  },
  {
    name: "Metformin",
    aliases: ["metformin", "metformin hydrochloride"],
    use: "Used for blood sugar control in type 2 diabetes."
  },
  {
    name: "Pantoprazole",
    aliases: ["pantoprazole", "pantoprazole sodium"],
    use: "Used to reduce stomach acid and manage reflux-related symptoms."
  },
  {
    name: "Domperidone",
    aliases: ["domperidone"],
    use: "Used for nausea or stomach motility problems when prescribed."
  }
];

const resultsGrid = document.querySelector("#resultsGrid");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const appointmentForm = document.querySelector("#appointmentForm");
const appointmentMessage = document.querySelector("#appointmentMessage");
const contactForm = document.querySelector("#contactForm");
const contactMessage = document.querySelector("#contactMessage");
const medicineImage = document.querySelector("#medicineImage");
const medicinePreview = document.querySelector("#medicinePreview");
const scannerPreview = document.querySelector("#scannerPreview");
const saltText = document.querySelector("#saltText");
const ocrSaltButton = document.querySelector("#ocrSaltButton");
const scanSaltButton = document.querySelector("#scanSaltButton");
const demoSaltButton = document.querySelector("#demoSaltButton");
const scannerStatus = document.querySelector("#scannerStatus");
const saltResults = document.querySelector("#saltResults");

let activeFilter = "all";
let currentSearch = "";

const storage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

function renderTopics() {
  const savedTopics = storage.get("savedTopics");
  const query = currentSearch.trim().toLowerCase();

  const filtered = healthTopics.filter((topic) => {
    const matchesFilter = activeFilter === "all" || topic.type === activeFilter;
    const searchable = [topic.title, topic.summary, topic.type, ...topic.keywords].join(" ").toLowerCase();
    return matchesFilter && (!query || searchable.includes(query));
  });

  if (!filtered.length) {
    resultsGrid.innerHTML = '<p class="muted">No results found. Try a different symptom, medicine, or condition.</p>';
    return;
  }

  resultsGrid.innerHTML = filtered.map((topic) => {
    const isSaved = savedTopics.includes(topic.id);
    return `
      <article class="result-card">
        <span class="tag">${topic.type}</span>
        <h3>${topic.title}</h3>
        <p>${topic.summary}</p>
        <button class="save-btn ${isSaved ? "saved" : ""}" type="button" data-id="${topic.id}">
          ${isSaved ? "Saved" : "Save Topic"}
        </button>
      </article>
    `;
  }).join("");
}

function saveTopic(topicId) {
  const savedTopics = storage.get("savedTopics");
  const exists = savedTopics.includes(topicId);
  const nextSaved = exists
    ? savedTopics.filter((id) => id !== topicId)
    : [...savedTopics, topicId];

  storage.set("savedTopics", nextSaved);
  renderTopics();
}

function findSaltsFromText(text) {
  const normalized = text.toLowerCase();
  return medicineSalts.filter((salt) => {
    return salt.aliases.some((alias) => normalized.includes(alias));
  });
}

function renderSaltResults(matches) {
  if (!saltText.value.trim()) {
    saltResults.innerHTML = '<div class="salt-empty">Add detected label text first, then tap Find Salts.</div>';
    return;
  }

  if (!matches.length) {
    saltResults.innerHTML = '<div class="salt-empty">No known salts found. Try clearer label text or add this salt to the database.</div>';
    return;
  }

  saltResults.innerHTML = matches.map((salt) => `
    <article class="salt-card">
      <strong>${salt.name}</strong>
      <p>${salt.use}</p>
    </article>
  `).join("");
}

function saveSaltScan(matches) {
  const scans = storage.get("saltScans");
  scans.push({
    id: Date.now(),
    detectedText: saltText.value.trim(),
    salts: matches.map((salt) => salt.name),
    createdAt: new Date().toISOString()
  });
  storage.set("saltScans", scans);
}

async function readMedicineImage() {
  const file = medicineImage.files[0];

  if (!file) {
    scannerStatus.textContent = "Upload or capture a medicine label image first.";
    return;
  }

  if (!window.Tesseract) {
    scannerStatus.textContent = "Auto OCR is unavailable right now. You can still type or paste the label text.";
    return;
  }

  ocrSaltButton.disabled = true;
  scannerStatus.textContent = "Reading label image...";

  try {
    const result = await Tesseract.recognize(file, "eng", {
      logger(progress) {
        if (progress.status === "recognizing text") {
          const percent = Math.round(progress.progress * 100);
          scannerStatus.textContent = `Reading label image... ${percent}%`;
        }
      }
    });

    saltText.value = result.data.text.trim();
    scannerStatus.textContent = saltText.value
      ? "Text detected. Review it, then check the matched salts below."
      : "No readable text found. Try a clearer photo or type the composition manually.";

    const matches = findSaltsFromText(saltText.value);
    renderSaltResults(matches);
    if (matches.length) saveSaltScan(matches);
  } catch (error) {
    scannerStatus.textContent = "Could not read the image. Try demo text or type the composition manually.";
  } finally {
    ocrSaltButton.disabled = false;
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentSearch = searchInput.value;
  document.querySelector("#library").scrollIntoView({ behavior: "smooth" });
  renderTopics();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderTopics();
  });
});

resultsGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".save-btn");
  if (!button) return;
  saveTopic(Number(button.dataset.id));
});

medicineImage.addEventListener("change", () => {
  const file = medicineImage.files[0];
  if (!file) return;

  medicinePreview.src = URL.createObjectURL(file);
  medicinePreview.hidden = false;
  scannerPreview.querySelector("span").hidden = true;

  if (!saltText.value.trim()) {
    saltText.placeholder = "Type or paste OCR text from the medicine label, then tap Find Salts.";
  }

  scannerStatus.textContent = "Image ready. Use Auto Read Image or type the composition text.";
});

ocrSaltButton.addEventListener("click", readMedicineImage);

scanSaltButton.addEventListener("click", () => {
  const matches = findSaltsFromText(saltText.value);
  renderSaltResults(matches);
  if (matches.length) saveSaltScan(matches);
  scannerStatus.textContent = matches.length
    ? `${matches.length} salt match${matches.length === 1 ? "" : "es"} found.`
    : "No matches found from the current label text.";
});

demoSaltButton.addEventListener("click", () => {
  saltText.value = "Composition: Each tablet contains Paracetamol 500 mg, Caffeine 30 mg and Cetirizine Hydrochloride 5 mg.";
  const matches = findSaltsFromText(saltText.value);
  renderSaltResults(matches);
  scannerStatus.textContent = "Demo text loaded and scanned.";
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
});

appointmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(appointmentForm));

  try {
    const response = await fetch("https://medhelp-app.onrender.com/appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    appointmentForm.reset();
    appointmentMessage.textContent = result.message;
  } catch (error) {
    appointmentMessage.textContent = "Could not submit appointment request.";
  }
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(contactForm));

  try {
    const response = await fetch("https://medhelp-app.onrender.com/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    contactForm.reset();
    contactMessage.textContent = result.message;
  } catch (error) {
    contactMessage.textContent = "Could not send message.";
  }
});
renderTopics();
