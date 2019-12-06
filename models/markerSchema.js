const mongoose = require("mongoose");

var Marker = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("marker", Marker);
