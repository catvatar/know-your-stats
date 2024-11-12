import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EntriesBrowser from "./EntriesBrowser";
import { fetchStopwatch } from "../utils/apis/stopwatches_api"; // Add this import

jest.mock("../utils/apis/stopwatches_api", () => ({
  fetchStopwatch: jest.fn((id) => {
    if (id === 1) {
      return Promise.resolve({ name: "Test Stopwatch" });
    }
    return Promise.reject(new Error("Stopwatch not found"));
  }),
}));

jest.mock("../utils/apis/stopwatch_entries_api", () => ({
  fetchStopwatchEntries: jest.fn((id, limit) => {
    if (id === 1) {
      return Promise.resolve([
        {
          id: 1,
          start_time: Date.now() - 5000,
          stop_time: Date.now() - 3000,
          note: "Test Note",
        },
      ]);
    }
    return Promise.reject(new Error("Entries not found"));
  }),
  deleteStopwatchEntry: jest.fn((id) => Promise.resolve()),
  updateStopwatchEntryWithNote: jest.fn((id, note) => Promise.resolve()),
}));

describe("EntriesBrowser Component", () => {
  let mockStopwatchEntries = [
    {
      id: 1,
      start_time: Date.now() - 5000,
      stop_time: Date.now() - 3000,
      note: "Test Note",
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      if (
        url === "http://localhost:3001/api/stopwatches/1" &&
        options.method === "GET"
      ) {
        return Promise.resolve({
          json: () => Promise.resolve({ name: "Test Stopwatch" }),
        });
      }
      if (
        url === "http://localhost:3001/api/stopwatches/1/entries?limit=10" &&
        options.method === "GET"
      ) {
        return Promise.resolve({
          json: () => Promise.resolve(mockStopwatchEntries),
        });
      }
      if (
        url === "http://localhost:3001/api/stopwatches/1/entries/1" &&
        options.method === "DELETE"
      ) {
        mockStopwatchEntries = mockStopwatchEntries.filter(
          (entry) => entry.id !== 1,
        );
        return Promise.resolve({
          json: () =>
            Promise.resolve({ message: "Entry deleted successfully!" }),
        });
      }
      if (
        url === "http://localhost:3001/api/stopwatches/1/entries/1" &&
        options.method === "PUT"
      ) {
        mockStopwatchEntries = mockStopwatchEntries.map((entry) => {
          if (entry.id === 1) {
            return {
              ...entry,
              note: JSON.parse(options.body as string).note,
            };
          }
          return entry;
        });
        return Promise.resolve({
          json: () =>
            Promise.resolve({ message: "Entry updated successfully!" }),
        });
      }
      return Promise.reject(new Error("Unknown API call"));
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders EntriesBrowser component", async () => {
    await act(async () => {
      render(<EntriesBrowser />);
    });
    expect(screen.getByText("Graph Data")).toBeInTheDocument();
  });

  test("fetches and displays stopwatch name and entries", async () => {
    await act(async () => {
      render(<EntriesBrowser />);
    });
    expect(screen.getByText("Test Stopwatch")).toBeInTheDocument();
    expect(screen.getByText("Test Note")).toBeInTheDocument();
  });

  test("handles fetch error gracefully", async () => {
    jest.mocked(fetchStopwatch).mockRejectedValueOnce(new Error("Fetch error"));
    await act(async () => {
      render(<EntriesBrowser />);
    });
    expect(screen.getByText("Error: Fetch error")).toBeInTheDocument();
  });

  test("deletes an entry", async () => {
    await act(async () => {
      render(<EntriesBrowser />);
    });
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.queryByText("Test Note")).not.toBeInTheDocument();
  });

  test("updates an entry note", async () => {
    await act(async () => {
      render(<EntriesBrowser />);
    });
    fireEvent.click(screen.getByText("Note"));
    fireEvent.change(screen.getByPlaceholderText("Quick note for this entry"), {
      target: { value: "Updated Note" },
    });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Updated Note")).toBeInTheDocument();
  });

  test("closes note popup without saving", async () => {
    await act(async () => {
      render(<EntriesBrowser />);
    });
    fireEvent.click(screen.getAllByText("Note")[0]);
    fireEvent.change(screen.getByPlaceholderText("Quick note for this entry"), {
      target: { value: "Updated Note" },
    });
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Updated Note")).not.toBeInTheDocument();
  });
});
