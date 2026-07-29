const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    drugCode: {
      type: Number,
      unique: true,
    },
    genericName: String,
    unitSize: String,
    mrp: Number,
    groupName: String,
  },
  {
    collection: "medicine",
  }
);

module.exports = mongoose.model("Medicine", MedicineSchema);
