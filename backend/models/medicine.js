const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    drugCode: {
      type: Number,
      required: true,
      unique: true,
    },
    genericName: {
      type: String,
      required: true,
    },
    unitSize: String,
    mrp: Number,
    groupName: String,
  },
  {
    collection: "medicine",
    timestamps: true,
  }
);

module.exports = mongoose.model("Medicine", MedicineSchema);
