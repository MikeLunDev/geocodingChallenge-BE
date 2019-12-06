const express = require("express");
const Marker = require("../models/markerSchema");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await Marker.find({}));
});

router.post("/", async (req, res) => {
  try {
    var newMarker = await Marker.create(req.body);
    res.status(201).send({
      error: "",
      status: "New marker added to the db",
      success: true,
      newMarker
    });
  } catch (err) {
    res.status(400).send({
      error: err.message,
      status: "Couldn't create new resource",
      success: false
    });
  }
});

router.delete("/:markerId", async (req, res) => {
  try {
    let marker = await Marker.findByIdAndDelete(req.params.markerId);
    marker != null
      ? res.status(200).send({
          error: "",
          status: "Successfully deleted",
          success: true,
          deletedMarkerId: marker._id
        })
      : res.status(404).send({
          error:
            "Not found. Check if the markerId is correct and if the marker exists",
          status: "Couldn't delete item with id " + req.params.markerId,
          success: false
        });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      status: `Couldn't delete item with id ${req.params.markerId}, internal error.`,
      success: false
    });
  }
});

router.put("/:markerId", async (req, res) => {
  const { address, lat, lng } = req.body;
  if (address != undefined && lat != undefined && lng != undefined) {
    try {
      let marker = await Marker.findByIdAndUpdate(
        req.params.markerId,
        { address, lat, lng },
        {
          new: true
        }
      );
      marker != null
        ? res.status(200).send({
            error: "",
            status: "Successfully updated",
            success: true,
            newMarker: marker
          })
        : res.status(404).send({
            error:
              "Not found. Check if the markerId is correct and if the marker exists",
            status: `Couldn't update item with id ${req.params.markerId}, internal error`,
            success: false
          });
    } catch (err) {
      res.status(500).send({
        error: err.message,
        status: `Couldn't update item with id ${req.params.markerId}, internal error.`,
        success: false
      });
    }
  } else
    res.status(400).send({
      error:
        "Some field missing or spelled incorrectly, to update an object you need address, lat and lng",
      status: `Couldn't update item with id ${req.params.markerId}.`,
      success: false
    });
});

module.exports = router;
