import React, { useState, useEffect, useRef } from "react";
import Stopwatch from "./Stopwatch";

type Stopwatch = {
    id: number;
    name: string;
}

async function fetchStopwatches() : Promise<Stopwatch[]> {
    return await fetch("http://localhost:3001/api/stopwatches", {
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

async function createStopwatch(name: string) {
    fetch("http://localhost:3001/api/stopwatches", {
        "method": "POST",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        body: JSON.stringify({ name })
    })
    .then(response => {
        console.log(response);
    })
    .catch(err => {
        console.error(err);
    });
}

async function deleteStopwatch(id: number) {
    fetch(`http://localhost:3001/api/stopwatches/${id}`, {
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

export default function Stopwatches(): React.JSX.Element {
    const [stopwatches, setStopwatches] = React.useState<Stopwatch[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newStopwatchName, setNewStopwatchName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        fetchStopwatches().then(stopwatches => setStopwatches(stopwatches));
    }, []);

    useEffect(() => {
        if (isPopupOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isPopupOpen]);

    const handleAddStopwatch = () => {
        createStopwatch(newStopwatchName).then(() => {
            fetchStopwatches().then(stopwatches => setStopwatches(stopwatches));
            setIsPopupOpen(false);
            setNewStopwatchName("");
        });
    };

    const handleDeleteStopwatch = (id: number) => {
        deleteStopwatch(id).then(() => {
            fetchStopwatches().then(stopwatches => setStopwatches(stopwatches));
        });
    };
 
    return (
        <div className="p-4 bg-gray-900 text-white rounded shadow-md border border-gray-700 w-full max-w-md mx-auto">
            <div className="bg-gray-800 p-4 rounded-t mb-4 flex justify-between items-center">
                <h2 className="text-3xl font-bold">Stopwatches</h2>
                <button onClick={() => setIsPopupOpen(true)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700">Add Stopwatch</button>
            </div>
            <div>
                <ul className="space-y-4">
                    {stopwatches.map(stopwatch => (
                        <li key={stopwatch.id} className="bg-gray-800 p-4 rounded">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-semibold">{stopwatch.name}</h3>
                                <button onClick={() => handleDeleteStopwatch(stopwatch.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
                            </div>
                            <Stopwatch id={stopwatch.id}/>
                        </li> 
                    ))}
                </ul>
            </div>
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-4 rounded shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Add New Stopwatch</h3>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newStopwatchName}
                            onChange={(e) => setNewStopwatchName(e.target.value)}
                            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                            placeholder="Stopwatch Name"
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsPopupOpen(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Cancel</button>
                            <button onClick={handleAddStopwatch} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}