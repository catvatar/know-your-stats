import React, { useState, useEffect, useRef } from "react";
import Stopwatch from "./Stopwatch";
import HowToUse from "./HowToUse";
import PopupWrapper from "../utils/components/PopupWrapper";

import { StopwatchResponse, StopwatchPrototype, fetchStopwatches, createStopwatch, renameStopwatch, deleteStopwatch } from "../utils/apis/stopwatches_api";

export default function Stopwatches(): React.JSX.Element {
    const [stopwatches, setStopwatches] = React.useState<StopwatchResponse[]>([]);

    const [isAddStopwatchPopupOpen, setIsAddStopwatchPopupOpen] = useState(false);
    const [newStopwatchProtorype, setNewStopwatchProtorype] = useState<StopwatchPrototype | null>(null);

    const [isRenameStopwatchPopupOpen, setIsRenameStopwatchPopupOpen] = useState(false);
    const [stopwatchToBeRenamed, setstopwatchToBeRenamed] = useState<number | null>(null);
    const [renameStopwatchName, setRenameStopwatchName] = useState("");
    
    const [stopwatchToBeDeleted, setstopwatchToBeDeleted] = useState<number | null>(null);
    const [isAreYouSurePopupOpen, setIsAreYouSurePopupOpen] = useState(false);

    const [error, setError] = useState<string | null>(null);
 
    const addStopwatchInputRef = useRef<HTMLInputElement>(null);
    const renameStopwatchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchStopwatches().then((stopwatches) => {
            stopwatches ? setStopwatches(stopwatches) : setError("Failed to fetch stopwatches");
        });
    }, []);

    useEffect(() => {
        if (isAddStopwatchPopupOpen && addStopwatchInputRef.current) {
            addStopwatchInputRef.current.focus();
        }
    }, [isAddStopwatchPopupOpen]);
    
    useEffect(() => {
        if (isRenameStopwatchPopupOpen && renameStopwatchInputRef.current) {
            renameStopwatchInputRef.current.focus();
        }
    }, [isRenameStopwatchPopupOpen]);

    const handleAddStopwatch = () => {
        newStopwatchProtorype && createStopwatch(newStopwatchProtorype).then(() => {
            fetchStopwatches().then(stopwatches => setStopwatches(stopwatches));
            setIsAddStopwatchPopupOpen(false);
            setNewStopwatchProtorype(null);
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
                <h2 className="text-3xl font-bold"><a href="/">Stopwatches</a></h2>
                <button onClick={() => setIsAddStopwatchPopupOpen(true)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700">Add Stopwatch</button>
            </div>
            <div>
                <ul className="space-y-4">
                    {stopwatches.length > 0 ? 
                    stopwatches.map(stopwatch => (
                        <li key={stopwatch.id} className="bg-gray-800 p-4 rounded">
                            <div className="flex justify-between group items-center mb-2">
                                <div className="group">
                                    <h3 className="text-xl font-semibold">{stopwatch.name}</h3>
                                    <span className="text-gray-400 text-sm hidden group-hover:block">{stopwatch.description}</span>
                                </div>
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
                error ? <h3>{error}</h3> : <HowToUse/>}
                </ul>
            </div>
            <PopupWrapper isOpen={isAddStopwatchPopupOpen}>
                <div className="bg-gray-800 p-4 rounded shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Add New Stopwatch</h3>
                    <input
                        ref={addStopwatchInputRef}
                        type="text"
                        value={newStopwatchProtorype?.name}
                        onChange={(e) => setNewStopwatchProtorype({name: e.target.value} as StopwatchPrototype)}
                        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                        placeholder="Stopwatch Name"
                    />
                    <input
                        type="text"
                        value={newStopwatchProtorype?.description || ""}
                        onChange={(e) => setNewStopwatchProtorype({...newStopwatchProtorype, description: e.target.value} as StopwatchPrototype)}
                        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                        placeholder="Stopwatch Description"
                    />
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsAddStopwatchPopupOpen(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Cancel</button>
                        <button onClick={handleAddStopwatch} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Add</button>
                    </div>
                </div>
            </PopupWrapper>
            <PopupWrapper isOpen={isRenameStopwatchPopupOpen}>
                <div className="bg-gray-800 p-4 rounded shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Rename Stopwatch</h3>
                    <input
                        ref={renameStopwatchInputRef}
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
                            }} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" data-testid='rename'>Rename</button>
                    </div>
                </div>
            </PopupWrapper>
            <PopupWrapper isOpen={isAreYouSurePopupOpen}>
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
            </PopupWrapper>
        </div>
    );
}