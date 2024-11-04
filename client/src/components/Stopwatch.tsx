import React, { useEffect, useState } from 'react'; 

import { formatTime } from '../utils/time-formats';

type StopwatchEntry = {
    id: number;
    start_time: number;
    stop_time: number | null;
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

export default function Stopwatch({id}: {id: number}) {
    const [lastStopwatchEntry, setLastStopwatchEntry] = useState<StopwatchEntry | null>(null);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    const fetchAndUpdateState = async () => {
        fetchStopwatchEntries(id, 1).then((entries: StopwatchEntry[]) => {
            if (entries.length == 0) {
                setLastStopwatchEntry(null);
                return;
            }
            setLastStopwatchEntry(entries[0]);
            setIsRunning(entries[0].stop_time === null);
            setElapsedTime(entries[0].stop_time ? entries[0].stop_time - entries[0].start_time : Date.now() - entries[0].start_time);
        });
    }
    
    useEffect(() => {
        fetchAndUpdateState().then(() => {
            console.log("Fetched");
        });
    }, [isRunning]);

    
    const handleStart = () => {
        startStopwatch(id).then(() => {
            fetchAndUpdateState().then(() => {
                console.log("Fetched");
            });
        });
        console.log("Start");
    };

    const handleStop = () => {
        console.log("Stop");
        // setIsRunning(false);
    };


    return <div className="flex flex-col items-center p-4 bg-gray-800 text-white rounded shadow-md">
        <p className="text-2xl mb-4">{lastStopwatchEntry ? formatTime(elapsedTime || 0) : "Run the stopwatch by pressing the Start button"}</p>
        <div className="space-x-2">
            {!isRunning?
            <button onClick={handleStart} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Start</button>:
            <button onClick={handleStop} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Stop</button>
            }
        </div>
    </div>;
}