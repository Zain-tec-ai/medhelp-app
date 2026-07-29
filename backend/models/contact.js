const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    collection: "contacts",
    timestamps: true
  }
);

module.exports = mongoose.model("Contact", ContactSchema);
