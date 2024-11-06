import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatTime } from "./utils/time-formats";

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

type StopwatchEntry = {
    id: number;
    start_time: number;
    stop_time: number | null;
}

export default function EntriesBrowser() {
    const { id } = useParams();
    const [stopwatchName, setStopwatchName] = React.useState<string>("");
    const [entries, setEntries] = React.useState<StopwatchEntry[]>([]);
    
    useEffect(() => {
        const paramId =  id?parseInt(id):0;
        if (paramId === 0) {
            return;
        }
        fetchStopwatch(paramId)
            .then((stopwatch: { name: string }) => {
                setStopwatchName(stopwatch.name);
            });

        fetchStopwatchEntries(paramId)
            .then((entries: StopwatchEntry[]) => {
                setEntries(entries.map(entry => {
                    return {
                        ...entry,
                        start_time: Math.floor(entry.start_time),
                        stop_time: entry.stop_time?Math.floor(entry.stop_time):null
                    } as StopwatchEntry;
                }));
            });
    }, [id]);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <h1 className="text-4xl font-bold underline mb-8 text-center">
                Know your stats
            </h1>
            <h2 className="text-2xl font-bold mb-4 text-center">
                Entries for Stopwatch {stopwatchName}
            </h2>
            <ul className="flex flex-col items-center w-full justify-center">
                {entries.map(entry => (
                    <li key={entry.id} className="mb-4 p-4 border border-gray-700 rounded-lg bg-gray-800 w-3/4">
                        <p>Start time: {new Date(entry.start_time).toLocaleString()}</p>
                        <p>Duration: {entry.stop_time?formatTime(Math.floor((entry.stop_time - entry.start_time)/1000)):"Still running!"}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}