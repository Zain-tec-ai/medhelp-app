const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    drugCode: {
      type: Number,
      required: true,
      unique: true
    },

    genericName: {
      type: String,
      required: true
    },

    unitSize: {
      type: String
    },

    mrp: {
      type: Number
    },

    groupName: {
      type: String
    }
  },
  {
    collection: "medicine",
    timestamps: true
  }
);

module.exports = mongoose.model("Medicine", MedicineSchema);
