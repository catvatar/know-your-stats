import React from "react";

import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Stopwatches from "./Stopwatches";

jest.mock("./Stopwatch", () => ({ id }: { id: number }) => (
  <div>Stopwatch</div>
));
jest.mock("./HowToUse", () => ({}) => <div>No Stopwatches Rendered</div>);

describe("Stopwatches Component", () => {
  let mockStopwatches: { id: number; name: string }[] = [];
  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      if (
        url === "http://localhost:3001/api/stopwatches" &&
        options.method === "GET"
      ) {
        return Promise.resolve({
          json: () => Promise.resolve(mockStopwatches),
        });
      }
      if (
        url === "http://localhost:3001/api/stopwatches" &&
        options.method === "POST"
      ) {
        mockStopwatches.push({
          id: 3,
          name: JSON.parse(options.body as string).name,
        });
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              message: "Stopwatch added successfully!",
              id: 3,
            }),
        });
      }
      if (
        url === "http://localhost:3001/api/stopwatches/1" &&
        options.method === "DELETE"
      ) {
        mockStopwatches = mockStopwatches.filter(
          (stopwatch) => stopwatch.id !== 1,
        );
        return Promise.resolve({
          json: () =>
            Promise.resolve({ message: "Stopwatch deleted successfully!" }),
        });
      }
      if (
        url === "http://localhost:3001/api/stopwatches/1" &&
        options.method === "PUT"
      ) {
        mockStopwatches = mockStopwatches.map((stopwatch) => {
          if (stopwatch.id === 1) {
            return {
              ...stopwatch,
              name: JSON.parse(options.body as string).name,
            };
          }
          return stopwatch;
        });
        return Promise.resolve({
          json: () =>
            Promise.resolve({ message: "Stopwatch deleted successfully!" }),
        });
      }
      return Promise.reject(new Error("Unknown API call"));
    }) as jest.Mock;
    mockStopwatches = [
      { id: 1, name: "Stopwatch 1" },
      { id: 2, name: "Stopwatch 2" },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders stopwatches", async () => {
    await act(() => {
      render(<Stopwatches />);
    });

    expect(screen.getByText("Stopwatch 1")).toBeInTheDocument();
    expect(screen.getByText("Stopwatch 2")).toBeInTheDocument();
  });

  test("opens and closes the add stopwatch popup", async () => {
    await act(() => {
      render(<Stopwatches />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Add Stopwatch"));
    });

    expect(screen.getByPlaceholderText("Stopwatch Name")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("Cancel"));
    });

    expect(screen.queryByText("Stopwatch Name")).not.toBeInTheDocument();
  });

  test("adds a new stopwatch", async () => {
    await act(() => {
      render(<Stopwatches />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Add Stopwatch"));
    });

    expect(screen.getByPlaceholderText("Stopwatch Name")).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Stopwatch Name"), {
        target: { value: "Stopwatch 3" },
      });
      fireEvent.click(screen.getByText("Add"));
    });

    expect(screen.getByText("Stopwatch 3")).toBeInTheDocument();
  });

  test("opens and closes the delete stopwatch popup", async () => {
    await act(() => {
      render(<Stopwatches />);
    });

    await act(async () => {
      fireEvent.click(screen.getAllByText("Delete")[0]);
    });

    expect(
      screen.getByText("Are you sure you want to delete this stopwatch?"),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("No"));
    });

    expect(
      screen.queryByText("Are you sure you want to delete this stopwatch?"),
    ).not.toBeInTheDocument();
  });

  test("deletes a stopwatch", async () => {
    await act(() => {
      render(<Stopwatches />);
    });

    expect(screen.getByText("Stopwatch 1")).toBeInTheDocument();
    expect(screen.getByText("Stopwatch 2")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getAllByText("Delete")[0]);
    });

    expect(
      screen.getByText("Are you sure you want to delete this stopwatch?"),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(`I'm sure`));
    });

    expect(screen.queryByText("Stopwatch 1")).not.toBeInTheDocument();
    expect(screen.getByText("Stopwatch 2")).toBeInTheDocument();
  });

  test("opens and closes the rename stopwatch popup", async () => {
    await act(() => {
      render(<Stopwatches />);
    });

    await act(async () => {
      fireEvent.click(screen.getAllByText("Rename")[0]);
    });

    expect(
      screen.getByPlaceholderText("New Stopwatch Name"),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("Cancel"));
    });

    expect(
      screen.queryByPlaceholderText("New Stopwatch Name"),
    ).not.toBeInTheDocument();
  });

  test("rename stopwatch", async () => {
    await act(() => {
      render(<Stopwatches />);
    });

    expect(screen.getByText("Stopwatch 1")).toBeInTheDocument();
    expect(screen.getByText("Stopwatch 2")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getAllByText("Rename")[0]);
    });

    expect(
      screen.getByPlaceholderText("New Stopwatch Name"),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("New Stopwatch Name"), {
        target: { value: "Stopwatch 3" },
      });
      fireEvent.click(screen.getByText("Submit"));
    });

    expect(screen.getByText("Stopwatch 2")).toBeInTheDocument();
    expect(screen.getByText("Stopwatch 3")).toBeInTheDocument();
    expect(screen.queryByText("Stopwatch 1")).not.toBeInTheDocument();
  });

  test("renders stopwatches with no stopwatches", async () => {
    mockStopwatches = [];

    await act(() => {
      render(<Stopwatches />);
    });

    expect(screen.getByText("No Stopwatches Rendered")).toBeInTheDocument();
  });

  test("fails safe without database", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Failed to fetch stopwatches")),
    );

    await act(() => {
      render(<Stopwatches />);
    });

    expect(screen.getByText("Stopwatches")).toBeInTheDocument();
  });
});
