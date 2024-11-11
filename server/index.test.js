const request = require("supertest");
const express = require("express");
const app = require("./index"); // Adjust the path if necessary

let server;

beforeAll((done) => {
  server = app.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("Stopwatches API", () => {
  it("should get all stopwatches", async () => {
    const res = await request(app).get("/api/stopwatches");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should add a new stopwatch", async () => {
    const res = await request(app)
      .post("/api/stopwatches")
      .send({ name: "New Stopwatch" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Stopwatch added successfully!");
    expect(res.body).toHaveProperty("id");
  });

  it("should update a stopwatch", async () => {
    const res = await request(app)
      .put("/api/stopwatches/1")
      .send({ name: "Updated Stopwatch" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Stopwatch updated successfully!",
    );
  });

  it("should delete a stopwatch", async () => {
    const res = await request(app).delete("/api/stopwatches/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "Stopwatch deleted successfully!",
    );
  });

  it("should get all entries for a stopwatch", async () => {
    const res = await request(app).get("/api/stopwatches/1/entries");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should add a new stopwatch entry", async () => {
    const res = await request(app)
      .post("/api/stopwatches/1/entries")
      .send({ start_time: new Date().toISOString() });
    expect(res.statusCode).toEqual(200);
  });
});
