import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EntriesBrowser from "./EntriesBrowser";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: 1 }),
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
          json: () =>
            Promise.resolve({
              id: 1,
              name: "Test Stopwatch",
              description: "Test Description",
            }),
        });
      }
      if (
        url === "http://localhost:3001/api/stopwatches/1/entries/10" &&
        options.method === "GET"
      ) {
        return Promise.resolve({
          json: () => Promise.resolve(mockStopwatchEntries),
        });
      }
      if (
        url === "http://localhost:3001/api/stopwatches/entries/1" &&
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
      if (
        url === "http://localhost:3001/api/stopwatches/entries/1/note" &&
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
    mockStopwatchEntries = [
      {
        id: 1,
        start_time: Date.now() - 5000,
        stop_time: Date.now() - 3000,
        note: "Test Note",
      },
    ];
    jest.clearAllMocks();
  });

  test("renders EntriesBrowser component", async () => {
    await act(async () => {
      render(<EntriesBrowser />);
    });
    expect(screen.getByText(`Graph "Test Stopwatch" Data`)).toBeInTheDocument();
  });

  test("fetches and displays stopwatch name and entries", async () => {
    await act(async () => {
      render(<EntriesBrowser />);
    });
    expect(screen.getByText(`Graph "Test Stopwatch" Data`)).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
  });

  test("handles fetch error gracefully", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Fetch error"));
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
    expect(screen.getByDisplayValue("Test Note")).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Quick note for this entry"), {
      target: { value: "Updated Note" },
    });
    fireEvent.click(screen.getByText("Save"));
    fireEvent.click(screen.getByText("Note"));
    expect(screen.getByDisplayValue("Updated Note")).toBeInTheDocument();
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
