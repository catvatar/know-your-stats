import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LineChart } from "./components/LineChart";
import { formatTime } from "./utils/functions/time-formats";

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

export default function GraphView() {
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
            <div className="p-4 bg-gray-900 text-white rounded shadow-md border border-gray-700 w-full max-w-md mx-auto">
                <h1 className="text-4xl font-bold underline mb-8 text-center">
                    <a href="/">Know your stats</a> / <a href={`/stopwatch/${id}`}>{stopwatchName}</a> / Graph
                </h1>
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {stopwatchName}
                </h2>
                <div className="flex flex-col items-center w-full justify-center pb-4">
                    <LineChart data={entries.map(entry => {
                        return {
                            x: entry.start_time,
                            y: entry.stop_time?Math.floor((entry.stop_time - entry.start_time)/1000):0
                        }
                    })} size={[600,1200]}/>
                </div>
                <p>{`Total duration: ${formatTime(Math.floor(entries.reduce((acc, entry) => acc + (entry.stop_time?entry.stop_time - entry.start_time:0), 0)/1000))}`}</p>
                <p>{`Avrage duration: ${formatTime(Math.floor(entries.reduce((acc, entry) => acc + (entry.stop_time?entry.stop_time - entry.start_time:0), 0)/entries.length/1000))}`}</p>
                <p>{`Longest duration: ${formatTime(Math.floor(entries.reduce((acc, entry) => Math.max(acc, entry.stop_time?entry.stop_time - entry.start_time:0), 0)/1000))}`}</p>
                <p>{`Shortest duration: ${formatTime(Math.floor(entries.reduce((acc, entry) => Math.min(acc, entry.stop_time?entry.stop_time - entry.start_time:0), Infinity)/1000))}`}</p>
                <p>{`Number of entries: ${entries.length}`}</p>
            </div>
        </div>);
}