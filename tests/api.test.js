const request = require("supertest");
const { app } = require("../server");
const Marker = require("../models/markerSchema")
const mongoose = require("mongoose");
require("dotenv").config()

const newMarker = {
  address: "Berlin, Germany",
  lat: 52.52000659999999,
  lng: 13.404953999999975
};
const editedMarker = {
  address: "Frankfurt, Germany",
  lat: 52.52000659999998,
  lng: 13.404953999999978
};

var newId;

beforeAll(async () => {
 await Marker.deleteMany({})
});

//Custom type-checking without third party libraries
expect.extend({
  toBeType(received, argument) {
    const initialType = typeof received;
    const type =
      initialType === "object"
        ? Array.isArray(received)
          ? "array"
          : initialType
        : initialType;
    return type === argument
      ? {
          message: () => `expected ${received} to be type ${argument}`,
          pass: true
        }
      : {
          message: () => `expected ${received} to be type ${argument}`,
          pass: false
        };
  }
});

post = (url, body) => {
  const httpRequest = request(app).post(url);
  httpRequest.set("Accept", "application/json");
  httpRequest.set("Origin",process.env.WHITE_LIST_LOCAL)
  httpRequest.send(body);
  return httpRequest;
};

httpDelete = url => {
  const httpRequest = request(app).delete(url);
  httpRequest.set("Origin",process.env.WHITE_LIST_LOCAL)
  return httpRequest;
};

put = (url, body) => {
  const httpRequest = request(app).put(url);
  httpRequest.set("Accept", "application/json");
  httpRequest.set("Origin",process.env.WHITE_LIST_LOCAL)
  httpRequest.send(body);
  return httpRequest;
};

get = url => {
  const httpRequest = request(app).get(url);
  httpRequest.set("Accept", "application/json");
  httpRequest.set("Origin",process.env.WHITE_LIST_LOCAL)
  return httpRequest;
};

describe("Markers route", () => {
  test("POST - /markers should return 400 on invalid or missing field in the newMarker object", async () => {
    const wrongNewMarker = Object.assign(
      {},
      { lat: newMarker.lat, address: newMarker.address }
    ); //missing lng
    let response = await post("/markers", wrongNewMarker)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toEqual({
      error: expect.toBeType("string"),
      status: expect.toBeType("string"),
      success: expect.toBeType("boolean")
    });
    expect(response.body.error).toEqual(
      expect.stringContaining("marker validation failed")
    );
    expect(response.body.status).toBe("Couldn't create new resource");
    expect(response.body.success).toBe(false);
  });
  test("POST - /markers should create a newMarker", async () => {
    let response = await post("/markers", newMarker)
      .expect("Content-Type", /json/)
      .expect(201);
    expect(response.body).toEqual({
      error: expect.toBeType("string"),
      status: expect.toBeType("string"),
      success: expect.toBeType("boolean"),
      newMarker: {
        _id: expect.toBeType("string"),
        lat: expect.toBeType("number"),
        lng: expect.toBeType("number"),
        address: expect.toBeType("string"),
        createdAt: expect.toBeType("string"),
        updatedAt: expect.toBeType("string"),
        __v: expect.toBeType("number")
      }
    });
    expect(response.body.error).toBe("");
    expect(response.body.status).toBe("New marker added to the db");
    expect(response.body.success).toBe(true);
    expect(response.body.newMarker).toEqual(
      expect.objectContaining({
        address: newMarker.address,
        lat: newMarker.lat,
        lng: newMarker.lng
      })
    );
    newId = response.body.newMarker._id;
  });

  test("PUT - /markers/:markersId should return 500 on a invalid ObjectId", async () => {
    let response = await put(`/markers/notavalidobjectid`, editedMarker)
      .expect("Content-Type", /json/)
      .expect(500);
    expect(response.body).toEqual({
      error: expect.toBeType("string"),
      status: expect.toBeType("string"),
      success: expect.toBeType("boolean")
    });
    expect(response.body.error).toEqual(
      expect.stringContaining("Cast to ObjectId failed")
    );
    expect(response.body.status).toEqual(
      expect.stringContaining("Couldn't update item with id")
    );
    expect(response.body.success).toBe(false);
  });

  test("PUT - /markers/:markersId should return 400 if markerId is correct but some field of the req are missing", async () => {
    const wrongEditedMarker = Object.assign(
      {},
      { lat: editedMarker.lat, address: editedMarker.address }
    ); //missing lng
    let response = await put(`/markers/${newId}`, wrongEditedMarker)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toEqual({
      error: expect.toBeType("string"),
      status: expect.toBeType("string"),
      success: expect.toBeType("boolean")
    });
    expect(response.body.error).toBe(
      "Some field missing or spelled incorrectly, to update an object you need address, lat and lng"
    );
    expect(response.body.status).toEqual(
      expect.stringContaining("Couldn't update item with id")
    );
    expect(response.body.success).toBe(false);
  });

  test("PUT - /markers/:markersId should return 404 if markerId is a valid ObjectId but is not found", async () => {
    let response = await put(`/markers/5de436bab0afa01bc0abcf2a`, editedMarker)
      .expect("Content-Type", /json/)
      .expect(404);
    expect(response.body).toEqual({
      error: expect.toBeType("string"),
      status: expect.toBeType("string"),
      success: expect.toBeType("boolean")
    });
    expect(response.body.error).toBe(
      "Not found. Check if the markerId is correct and if the marker exists"
    );
    expect(response.body.status).toEqual(
      expect.stringContaining("Couldn't update item with id")
    );
    expect(response.body.success).toBe(false);
  });

  test("PUT - /markers/:markersId should update a Marker", async () => {
    let response = await put(`/markers/${newId}`, editedMarker)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toEqual({
      error: expect.toBeType("string"),
      status: expect.toBeType("string"),
      success: expect.toBeType("boolean"),
      newMarker: {
        _id: expect.toBeType("string"),
        lat: expect.toBeType("number"),
        lng: expect.toBeType("number"),
        address: expect.toBeType("string"),
        createdAt: expect.toBeType("string"),
        updatedAt: expect.toBeType("string"),
        __v: expect.toBeType("number")
      }
    });
    expect(response.body.error).toBe("");
    expect(response.body.status).toBe("Successfully updated");
    expect(response.body.success).toBe(true);
    expect(response.body.newMarker._id).toBe(newId);
    expect(response.body.newMarker.lat).toBe(editedMarker.lat);
    expect(response.body.newMarker.lng).toBe(editedMarker.lng);
    expect(response.body.newMarker.address).toBe(editedMarker.address);
  });

  test("DELETE - /markers/:markersId should return 500 on a invalid ObjectId", async () => {
    let response = await httpDelete(`/markers/124124`)
      .expect("Content-Type", /json/)
      .expect(500);
    expect(response.body).toEqual({
      error: expect.toBeType("string"),
      status: expect.toBeType("string"),
      success: expect.toBeType("boolean")
    });
    expect(response.body.error).toEqual(
      expect.stringContaining("Cast to ObjectId failed")
    );
    expect(response.body.status).toEqual(
      expect.stringContaining("Couldn't delete item with id")
    );
    expect(response.body.success).toBe(false);
  });

  test("DELETE - /markers/:markersId should return 404 if markerId is a valid ObjectId but is not found", async () => {
    let response = await httpDelete(`/markers/5de436bab0afa01bc0abcf2a`)
      .expect("Content-Type", /json/)
      .expect(404);
    expect(response.body).toEqual({
      error: expect.toBeType("string"),
      status: expect.toBeType("string"),
      success: expect.toBeType("boolean")
    });
    expect(response.body.error).toBe(
      "Not found. Check if the markerId is correct and if the marker exists"
    );
    expect(response.body.status).toEqual(
      expect.stringContaining("Couldn't delete item with id")
    );
    expect(response.body.success).toBe(false);
  });

  test("DELETE - /markers/:markersId should delete Marker", async () => {
    let response = await httpDelete(`/markers/${newId}`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toEqual({
      error: expect.toBeType("string"),
      status: expect.toBeType("string"),
      success: expect.toBeType("boolean"),
      deletedMarkerId: expect.toBeType("string")
    });
    expect(response.body.error).toBe("");
    expect(response.body.status).toBe("Successfully deleted");
    expect(response.body.success).toBe(true);
    expect(response.body.deletedMarkerId).toBe(newId);
  });
});
