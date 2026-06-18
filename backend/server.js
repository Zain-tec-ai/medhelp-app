const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Frontend serve karo
app.use(express.static(path.join(__dirname, "../")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Appointment Schema
const AppointmentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  department: String,
  date: String,
  reason: String
});

// Contact Schema
const ContactSchema = new mongoose.Schema({
  email: String,
  message: String
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
const Contact = mongoose.model("Contact", ContactSchema);

// Appointment API
app.post("/appointment", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment saved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Contact API
app.post("/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    res.json({
      success: true,
      message: "Contact saved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
