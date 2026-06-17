const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const appointments = [];
const contacts = [];

app.get("/", (req, res) => {
  res.send("MedHelp Backend Running");
});

app.post("/appointment", (req, res) => {
  appointments.push(req.body);
  res.json({
    success: true,
    message: "Appointment request received"
  });
});

app.post("/contact", (req, res) => {
  contacts.push(req.body);
  res.json({
    success: true,
    message: "Contact message received"
  });
});

app.get("/appointments", (req, res) => {
  res.json(appointments);
});

app.get("/contacts", (req, res) => {
  res.json(contacts);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
