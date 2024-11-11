import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { formatTime } from "./utils/functions/time-formats";
import PopupWrapper from "./utils/components/PopupWrapper";

const fetchStopwatch = async (id: number) => {
    return await fetch(`http://localhost:3001/api/stopwatches/${id}`, {
        "method": "GET",
        "headers": {
            "user-agent": "vscode-restclient"
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.error(err);
    });
}

const fetchStopwatchEntries = async (id: number, limit: number | null = null) => {
    const apiURL: string = limit ? `http://localhost:3001/api/stopwatches/${id}/entries/${limit}` : `http://localhost:3001/api/stopwatches/${id}/entries`;
    return await fetch(apiURL, {
        "method": "GET",
        "headers": {
            "user-agent": "vscode-restclient"
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.error(err);
    });
}

const deleteStopwatchEntry = async (id: number) => {
    fetch(`http://localhost:3001/api/stopwatches/entries/${id}`, {
        "method": "DELETE",
        "headers": {
            "user-agent": "vscode-restclient"
        }
    })
    .then(response => {
        console.log(response);
    })
    .catch(err => {
        console.error(err);
    });
}

const updateStopwatchEntryWithNote = async (id: number, note: string) => {
    fetch(`http://localhost:3001/api/stopwatches/entries/${id}/note`, {
        "method": "PUT",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        "body": JSON.stringify({ note })
    })
    .catch(err => {
        console.error(err);
    });
}

type StopwatchEntry = {
    id: number;
    start_time: number;
    stop_time: number | null;
    note: string;
}

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
        const paramId =  id?parseInt(id):0;
        if (paramId === 0) {
            return;
        }
        fetchStopwatch(paramId)
            .then((stopwatch: { name: string }) => {
                setStopwatchName(stopwatch.name);
            })
            .catch(err => {
                setError(err);
            });

        fetchStopwatchEntries(paramId, limit)
            .then((entries: StopwatchEntry[]) => {
                setEntries(entries.map(entry => {
                    return {
                        ...entry,
                        start_time: Math.floor(entry.start_time),
                        stop_time: entry.stop_time?Math.floor(entry.stop_time):null
                    } as StopwatchEntry;
                }));
            })
            .catch(err => {
                setError(err);
            });
    }, [id]);

    useEffect(() => {
        if (isNotePopupOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isNotePopupOpen]);

    useEffect(() => {
        setEntryNoteContent(entries.find(entry => entry.id === entryToEdit)?.note || "");
    }, [entryToEdit]);

    const handleDelete = (id: number) => {
        deleteStopwatchEntry(id);
        setEntries(entries.filter(entry => entry.id !== id));
    }

    const handleNoteUpdate = (id: number, note: string) => {
        updateStopwatchEntryWithNote(id, note);
        setEntries(entries.map(entry => {
            if (entry.id === id) {
                return {
                    ...entry,
                    note
                };
            }
            return entry;
        }));
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <div className="p-4 bg-gray-900 text-white rounded shadow-md border border-gray-700 w-full max-w-md mx-auto">
                <h1 className="text-4xl font-bold underline mb-8 text-center">
                    <a href="/">Know your stats</a> / {stopwatchName}
                </h1>
                <h2 className="text-xl font-bold mb-4 text-center">
                    <a href={`/stopwatch/${id}/graph`}>Graph Data</a>
                </h2>
                <ul className="flex flex-col items-center w-full justify-center">
                    {entries.map((entry, index, entries) => {
                        const lastDate = new Date(entries[index-1]?.start_time).toLocaleDateString();
                        const date = new Date(entry.start_time).toLocaleDateString();
                        return (
                        <li key={entry.id} className="w-3/4">
                            {date != lastDate ? (<h3 className='text-xl font-bold pb-4'>Date: {date}</h3>):''}
                            <div className="mb-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
                                <div className="flex justify-between">
                                    <p>Start time: {new Date(entry.start_time).toLocaleTimeString()}</p>
                                    <button onClick={()=>{
                                        setIsNotePopupOpen(true);
                                        setEntryToEdit(entry.id);
                                        }} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700">Note</button>
                                    <button onClick={()=>{handleDelete(entry.id)}} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
                                </div>
                                <p>Duration: {entry.stop_time?formatTime(Math.floor((entry.stop_time - entry.start_time)/1000)):"Still running!"}</p>
                            </div>
                        </li>
                    )})}
                </ul>
            </div>
                <PopupWrapper isOpen={isNotePopupOpen}>
                    <div className="bg-gray-800 p-4 rounded shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Note for entry {entryToEdit}</h3>
                        <input
                            ref={inputRef}
                            type="text"
                            value={entryNoteContent}
                            onChange={(e) => setEntryNoteContent(e.target.value)}
                            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                            placeholder="Quick note for this entry"
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => {
                                setEntryToEdit(null);
                                setIsNotePopupOpen(false);
                                }} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Cancel</button>
                            <button onClick={()=>{
                                entryToEdit && handleNoteUpdate(entryToEdit,entryNoteContent)
                                setEntryToEdit(null);
                                setIsNotePopupOpen(false);
                                }} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Save</button>
                        </div>
                    </div>
                </PopupWrapper>
            {error && <p className="text-red-500 text-center mt-4">{error.toString()}</p>}
        </div>);
}