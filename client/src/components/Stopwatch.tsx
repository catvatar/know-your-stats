import React, { useEffect, useReducer, useState } from 'react'; 

import { formatTime } from '../utils/time-formats';



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

const startStopwatch = async (id: number) => {
    fetch(`http://localhost:3001/api/stopwatches/${id}/entries`, {
        "method": "POST",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        body: JSON.stringify({ start_time: Date.now() })
    })
    .then(response => {
        console.log(response);
    })
    .catch(err => {
        console.error(err);
    });
}

const stopStopwatch = async (id: number) => {
    fetch(`http://localhost:3001/api/stopwatches/${id}/entries`, {
        "method": "PUT",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        body: JSON.stringify({ stop_time: Date.now() })
    })
    .then(response => {
        console.log(response);
    })
    .catch(err => {
        console.error(err);
    });
}

type StopwatchEntry = {
    id: number;
    start_time: number;
    stop_time: number | null;
}

interface StopwatchState {
    stopwatchEntry: StopwatchEntry | null;
    isRunning: boolean;
    elapsedTime: number;
}

const initialStopwatchState: StopwatchState = {
    stopwatchEntry: null,
    isRunning: false,
    elapsedTime: 0
};

function stopwatchReducer(state: StopwatchState, update: StopwatchEntry): StopwatchState {
    const calculateStateFromEntry = (stopwatchEntry: StopwatchEntry) => {
        const isRunning = stopwatchEntry.stop_time === null;
        const elapsedTime = isRunning ? Date.now() - stopwatchEntry.start_time : stopwatchEntry.stop_time as number - stopwatchEntry.start_time;
        return {
            isRunning,
            elapsedTime
        };
    };
    const newState = calculateStateFromEntry(update);
    return {
        ...state,
        ...newState,
        stopwatchEntry: update
    };
}

export default function Stopwatch({id}: {id: number}) {
    const [stopwatchState, stopwatchDispatchAction] = useReducer(stopwatchReducer,initialStopwatchState);
    const [fakeTime, setFakeTime] = useState(0);
    const [fakeIntervalId, setFakeIntervalId] = useState<NodeJS.Timeout>();

    useEffect(() => {
        fetchStopwatchEntries(id, 1).then((entries: StopwatchEntry[]) => {
            console.trace(entries);
            if(entries.length > 0) {
                stopwatchDispatchAction(entries[0]);
            }
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if(stopwatchState.isRunning) {
                setFakeTime((prev) => prev + 1000);
            }
        }, 1000);
        setFakeIntervalId(interval);
        return () => clearInterval(interval);
    }, [stopwatchState.isRunning]);

    const handleStart = () => {
        startStopwatch(id).then(() => {
            fetchStopwatchEntries(id, 1).then((entries: StopwatchEntry[]) => {
                if(entries.length > 0) {
                    stopwatchDispatchAction(entries[0]);
                }
            });
        });
    }

    const handleStop = () => {
        clearInterval(fakeIntervalId);
        stopStopwatch(id).then(() => {
            fetchStopwatchEntries(id, 1).then((entries: StopwatchEntry[]) => {
                if(entries.length > 0) {
                    stopwatchDispatchAction(entries[0]);
                    setFakeTime(0);
                }
            });
        });
    }
    
    return <div className="flex flex-col items-center p-4 bg-gray-800 text-white rounded shadow-md">
        {stopwatchState&&<p className='text-2xl mb-4'>Last elapsed time</p>}
        <p className="text-2xl mb-4">{stopwatchState.elapsedTime > 0 ? formatTime(Math.floor((stopwatchState.elapsedTime + fakeTime)/1000))  : "Run the stopwatch by pressing the Start button"}</p>
        <div className="space-x-2">
            {!stopwatchState.isRunning?
            <button onClick={handleStart} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Start</button>:
            <button onClick={handleStop} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Stop</button>
            }
        </div>
    </div>;
}