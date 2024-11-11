import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { formatTime } from "./utils/functions/time-formats";
import PopupWrapper from "./utils/components/PopupWrapper";

import { fetchStopwatch } from "./utils/apis/stopwatches_api";
import {
  fetchStopwatchEntries,
  deleteStopwatchEntry,
  updateStopwatchEntryWithNote,
} from "./utils/apis/stopwatch_entries_api";
import { StopwatchEntry } from "./utils/apis/types_api";

export default function EntriesBrowser() {
  const { id } = useParams();
  const [stopwatchName, setStopwatchName] = useState<string>("");
  const [entries, setEntries] = useState<StopwatchEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);

  const [isNotePopupOpen, setIsNotePopupOpen] = useState<boolean>(false);
  const [entryToEdit, setEntryToEdit] = useState<number | null>(null);
  const [entryNoteContent, setEntryNoteContent] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const paramId = id ? parseInt(id) : 0;
    if (paramId === 0) {
      return;
    }
    fetchStopwatch(paramId)
      .then((stopwatch: { name: string }) => {
        setStopwatchName(stopwatch.name);
      })
      .catch((err) => {
        setError(err);
      });

    fetchStopwatchEntries(paramId, limit)
      .then((entries: StopwatchEntry[]) => {
        setEntries(
          entries.map((entry) => {
            return {
              ...entry,
              start_time: Math.floor(entry.start_time),
              stop_time: entry.stop_time ? Math.floor(entry.stop_time) : null,
            } as StopwatchEntry;
          }),
        );
      })
      .catch((err) => {
        setError(err);
      });
  }, [id]);

  useEffect(() => {
    if (isNotePopupOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isNotePopupOpen]);

  useEffect(() => {
    setEntryNoteContent(
      entries.find((entry) => entry.id === entryToEdit)?.note || "",
    );
  }, [entryToEdit]);

  const handleDelete = (id: number) => {
    deleteStopwatchEntry(id);
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleNoteUpdate = (id: number, note: string) => {
    updateStopwatchEntryWithNote(id, note);
    setEntries(
      entries.map((entry) => {
        if (entry.id === id) {
          return {
            ...entry,
            note,
          };
        }
        return entry;
      }),
    );
  };

  return (
    <>
      <h2 className="mb-4 text-center text-xl font-bold">
        <a href={`/stopwatch/${id}/graph`}>Graph Data</a>
      </h2>
      <ul className="flex w-full flex-col items-center justify-center">
        {entries.map((entry, index, entries) => {
          const lastDate = new Date(
            entries[index - 1]?.start_time,
          ).toLocaleDateString();
          const date = new Date(entry.start_time).toLocaleDateString();
          return (
            <li key={entry.id} className="w-3/4">
              {date != lastDate ? (
                <h3 className="pb-4 text-xl font-bold">Date: {date}</h3>
              ) : (
                ""
              )}
              <div className="mb-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
                <div className="flex justify-between">
                  <p>
                    Start time:{" "}
                    {new Date(entry.start_time).toLocaleTimeString()}
                  </p>
                  <button
                    onClick={() => {
                      setIsNotePopupOpen(true);
                      setEntryToEdit(entry.id);
                    }}
                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-700"
                  >
                    Note
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(entry.id);
                    }}
                    className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
                <p>
                  Duration:{" "}
                  {entry.stop_time
                    ? formatTime(
                        Math.floor((entry.stop_time - entry.start_time) / 1000),
                      )
                    : "Still running!"}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <PopupWrapper isOpen={isNotePopupOpen}>
        <div className="rounded bg-gray-800 p-4 shadow-md">
          <h3 className="mb-4 text-xl font-semibold">
            Note for entry {entryToEdit}
          </h3>
          <input
            ref={inputRef}
            type="text"
            value={entryNoteContent}
            onChange={(e) => setEntryNoteContent(e.target.value)}
            className="mb-4 w-full rounded bg-gray-700 p-2 text-white"
            placeholder="Quick note for this entry"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setEntryToEdit(null);
                setIsNotePopupOpen(false);
              }}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                entryToEdit && handleNoteUpdate(entryToEdit, entryNoteContent);
                setEntryToEdit(null);
                setIsNotePopupOpen(false);
              }}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </div>
      </PopupWrapper>
      {error && (
        <p className="mt-4 text-center text-red-500">{error.toString()}</p>
      )}
    </>
  );
}
