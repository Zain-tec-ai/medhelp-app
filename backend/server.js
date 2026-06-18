const multer = require("multer");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.use("/uploads", express.static("backend/uploads"));

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
  reason: String,
  report: String
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
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.json({
      success: true,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
