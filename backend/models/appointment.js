const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    date: {
      type: String,
      required: true
    },

    reason: {
      type: String
    },

    report: {
      type: String
    }
  },
  {
    collection: "appointments",
    timestamps: true
  }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
