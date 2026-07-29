const express = require("express");
const router = express.Router();

const Medicine = require("../models/Medicine");

// Search Medicines
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const medicines = await Medicine.find({
      genericName: {
        $regex: query,
        $options: "i"
      }
    }).limit(20);

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get All Medicines
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find().limit(100);

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get Medicine by ID
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.status(200).json({
      success: true,
      data: medicine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
