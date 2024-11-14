import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LineChart } from "./LineChart";
import { formatTime } from "../utils/functions/time-formats";

import { fetchStopwatch } from "../utils/apis/stopwatches_api";

import { fetchStopwatchEntries } from "../utils/apis/stopwatch_entries_api";

type StopwatchEntry = {
  id: number;
  start_time: number;
  stop_time: number | null;
};

export default function GraphView() {
  const { id } = useParams();
  const [stopwatchName, setStopwatchName] = React.useState<string>("");
  const [entries, setEntries] = React.useState<StopwatchEntry[]>([]);

  useEffect(() => {
    const paramId = id ? parseInt(id) : 0;
    if (paramId === 0) {
      return;
    }
    fetchStopwatch(paramId).then((stopwatch: { name: string }) => {
      setStopwatchName(stopwatch.name);
    });

    fetchStopwatchEntries(paramId).then((entries: StopwatchEntry[]) => {
      setEntries(
        entries.map((entry) => {
          return {
            ...entry,
            start_time: Math.floor(entry.start_time),
            stop_time: entry.stop_time ? Math.floor(entry.stop_time) : null,
          } as StopwatchEntry;
        }),
      );
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto w-full max-w-md rounded border border-gray-700 bg-gray-900 p-4 text-white shadow-md">
        <h1 className="mb-8 text-center text-4xl font-bold underline">
          <a href="/">Know your stats</a> /{" "}
          <a href={`/stopwatch/${id}`}>{stopwatchName}</a> / Graph
        </h1>
        <h2 className="mb-4 text-center text-2xl font-bold">{stopwatchName}</h2>
        <div className="flex w-full flex-col items-center justify-center pb-4">
          <LineChart
            data={entries.map((entry) => {
              return {
                x: entry.start_time,
                y: entry.stop_time
                  ? Math.floor((entry.stop_time - entry.start_time) / 1000)
                  : 0,
              };
            })}
            size={[600, 1200]}
          />
        </div>
        <p>{`Total duration: ${formatTime(Math.floor(entries.reduce((acc, entry) => acc + (entry.stop_time ? entry.stop_time - entry.start_time : 0), 0) / 1000))}`}</p>
        <p>{`Avrage duration: ${formatTime(Math.floor(entries.reduce((acc, entry) => acc + (entry.stop_time ? entry.stop_time - entry.start_time : 0), 0) / entries.length / 1000))}`}</p>
        <p>{`Longest duration: ${formatTime(Math.floor(entries.reduce((acc, entry) => Math.max(acc, entry.stop_time ? entry.stop_time - entry.start_time : 0), 0) / 1000))}`}</p>
        <p>{`Shortest duration: ${formatTime(Math.floor(entries.reduce((acc, entry) => Math.min(acc, entry.stop_time ? entry.stop_time - entry.start_time : 0), Infinity) / 1000))}`}</p>
        <p>{`Number of entries: ${entries.length}`}</p>
      </div>
    </div>
  );
}
