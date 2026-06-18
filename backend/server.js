const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://zain_dev:zain0008@cluster0.gwr98ko.mongodb.net/medhelp?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const AppointmentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  department: String,
  date: String,
  reason: String
});

const ContactSchema = new mongoose.Schema({
  email: String,
  message: String
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
const Contact = mongoose.model("Contact", ContactSchema);

app.get("/", (req, res) => {
  res.send("MedHelp Backend Running");
});

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
