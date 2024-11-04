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

async function renameStopwatch(id: number, name: string) {
    fetch(`http://localhost:3001/api/stopwatches/${id}`, {
        "method": "PUT",
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

    const [isAddStopwatchPopupOpen, setIsAddStopwatchPopupOpen] = useState(false);
    const [newStopwatchName, setNewStopwatchName] = useState("");

    const [isRenameStopwatchPopupOpen, setIsRenameStopwatchPopupOpen] = useState(false);
    const [stopwatchToBeRenamed, setstopwatchToBeRenamed] = useState<number | null>(null);
    const [renameStopwatchName, setRenameStopwatchName] = useState("");
    
    const [stopwatchToBeDeleted, setstopwatchToBeDeleted] = useState<number | null>(null);
    const [isAreYouSurePopupOpen, setIsAreYouSurePopupOpen] = useState(false);
 
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchStopwatches().then(stopwatches => setStopwatches(stopwatches));
    }, []);

    useEffect(() => {
        if (isAddStopwatchPopupOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAddStopwatchPopupOpen]);

    const handleAddStopwatch = () => {
        createStopwatch(newStopwatchName).then(() => {
            fetchStopwatches().then(stopwatches => setStopwatches(stopwatches));
            setIsAddStopwatchPopupOpen(false);
            setNewStopwatchName("");
        });
    };

    const handleRenameStopwatch = (id: number, name: string) => {
        renameStopwatch(id, name).then(() => {
            fetchStopwatches().then(stopwatches => setStopwatches(stopwatches));
            setIsRenameStopwatchPopupOpen(false);
            setRenameStopwatchName("");
        });
    }

    const handleDeleteStopwatch = (id: number) => {
        deleteStopwatch(id).then(() => {
            fetchStopwatches().then(stopwatches => setStopwatches(stopwatches));
            setIsAreYouSurePopupOpen(false);
        });
    };
 
    return (
        <div className="p-4 bg-gray-900 text-white rounded shadow-md border border-gray-700 w-full max-w-md mx-auto">
            <div className="bg-gray-800 p-4 rounded-t mb-4 flex justify-between items-center">
                <h2 className="text-3xl font-bold">Stopwatches</h2>
                <button onClick={() => setIsAddStopwatchPopupOpen(true)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700">Add Stopwatch</button>
            </div>
            <div>
                <ul className="space-y-4">
                    {stopwatches.length > 0 ? 
                    stopwatches.map(stopwatch => (
                        <li key={stopwatch.id} className="bg-gray-800 p-4 rounded">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-semibold">{stopwatch.name}</h3>
                                <div className="flex justify-between gap-2">
                                    <button onClick={() => {
                                        setstopwatchToBeRenamed(stopwatch.id);
                                        setIsRenameStopwatchPopupOpen(true);
                                    }} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700">Rename</button>
                                    <button onClick={() => {
                                        setstopwatchToBeDeleted(stopwatch.id);
                                        setIsAreYouSurePopupOpen(true);
                                    }} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
                                </div>
                            </div>
                            <Stopwatch id={stopwatch.id}/>
                        </li> 
                    )):
                <h3>Create your first stopwatch by clicking the "Add Stopwatch" button</h3>}
                </ul>
            </div>
            {isAddStopwatchPopupOpen && (
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
                            <button onClick={() => setIsAddStopwatchPopupOpen(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Cancel</button>
                            <button onClick={handleAddStopwatch} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Add</button>
                        </div>
                    </div>
                </div>
            )}
            {isRenameStopwatchPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-4 rounded shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Rename Stopwatch</h3>
                        <input
                            ref={inputRef}
                            type="text"
                            value={renameStopwatchName}
                            onChange={(e) => setRenameStopwatchName(e.target.value)}
                            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                            placeholder="New Stopwatch Name"
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsRenameStopwatchPopupOpen(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Cancel</button>
                            <button onClick={()=>{
                                stopwatchToBeRenamed&&handleRenameStopwatch(stopwatchToBeRenamed, renameStopwatchName);
                                }} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Rename</button>
                        </div>
                    </div>
                </div>
            )}
            {isAreYouSurePopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 p-4 rounded shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this stopwatch?</h3>
                        <p>This will delete the stopwatch and ALL it's entries.</p>
                        <p className="font-semibold mb-4">This action is irreversible</p>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsAreYouSurePopupOpen(false)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">No</button>
                            <button onClick={() => {
                                stopwatchToBeDeleted&&handleDeleteStopwatch(stopwatchToBeDeleted);
                                }} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">I'm sure</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}