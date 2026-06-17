
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MedHelp Backend Running");
});

app.post("/appointment", (req, res) => {
  res.json({
    success: true,
    message: "Appointment request received"
  });
});

app.post("/contact", (req, res) => {
  res.json({
    success: true,
    message: "Contact message received"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
