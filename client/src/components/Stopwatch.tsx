import React, { useEffect, useReducer, useState } from "react";

import { formatTime } from "../utils/functions/time-formats";

import {
  fetchStopwatchEntries,
  startStopwatch,
  stopStopwatch,
} from "../utils/apis/stopwatch_entries_api";

import { StopwatchEntry } from "../utils/apis/types_api";
import Button from "../utils/components/Button";

interface StopwatchState {
  stopwatchEntry: StopwatchEntry | null;
  isRunning: boolean;
  elapsedTime: number;
}

const initialStopwatchState: StopwatchState = {
  stopwatchEntry: null,
  isRunning: false,
  elapsedTime: 0,
};

function stopwatchReducer(
  state: StopwatchState,
  update: StopwatchEntry,
): StopwatchState {
  const calculateStateFromEntry = (stopwatchEntry: StopwatchEntry) => {
    const isRunning = stopwatchEntry.stop_time === null;
    const elapsedTime = isRunning
      ? Date.now() - stopwatchEntry.start_time
      : (stopwatchEntry.stop_time as number) - stopwatchEntry.start_time;
    return {
      isRunning,
      elapsedTime,
    };
  };
  const newState = calculateStateFromEntry(update);
  return {
    stopwatchEntry: update,
    ...newState,
  };
}

export default function Stopwatch({ id }: { id: number }) {
  const [stopwatchState, stopwatchDispatchAction] = useReducer(
    stopwatchReducer,
    initialStopwatchState,
  );
  const [fakeTime, setFakeTime] = useState(0);
  const [fakeIntervalId, setFakeIntervalId] = useState<NodeJS.Timeout>();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStopwatchEntries(id, 1)
      .then((entries: StopwatchEntry[]) => {
        if (entries.length > 0) {
          stopwatchDispatchAction(entries[0]);
        }
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stopwatchState.isRunning) {
        setFakeTime((prev) => prev + 1000);
      }
    }, 1000);
    setFakeIntervalId(interval);
    return () => clearInterval(interval);
  }, [stopwatchState.isRunning]);

  const handleStart = () => {
    const newEntry: StopwatchEntry = {
      id: id,
      start_time: Date.now(),
      stop_time: null,
      note: "",
    };
    stopwatchDispatchAction(newEntry);
    startStopwatch(id).then(() => {
      setFakeTime(0);
    });
  };

  const handleStop = () => {
    clearInterval(fakeIntervalId);
    const updatedEntry: StopwatchEntry = {
      ...stopwatchState.stopwatchEntry!,
      stop_time: Date.now(),
    };
    stopwatchDispatchAction(updatedEntry);
    stopStopwatch(id).then(() => {
      setFakeTime(0);
    });
  };

  return (
    <div className="flex flex-col items-center rounded bg-gray-800 p-4 text-white shadow-md">
      {stopwatchState.elapsedTime + fakeTime > 0 ||
      stopwatchState.stopwatchEntry ? (
        <p className="text-center text-2xl">
          {formatTime(
            Math.floor((stopwatchState.elapsedTime + fakeTime) / 1000),
          )}
        </p>
      ) : (
        <p className="text-center text-2xl">
          Run the stopwatch by pressing the Start button
        </p>
      )}
      {!stopwatchState.isRunning ? (
        <Button onClick={handleStart} type="submit">
          Start
        </Button>
      ) : (
        <Button onClick={handleStop} type="reset">
          Stop
        </Button>
      )}
      <div className="flex w-full items-end justify-end">
        <a
          href={`/stopwatch/${id}`}
          className="text-3xl text-white hover:text-gray-400"
        >
          {"Entries >"}
        </a>
      </div>
      {error && <div className="pt-4 text-red-500">{error.toString()}</div>}
    </div>
  );
}
