import React from "react";
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

export default function Stopwatches(): React.JSX.Element {
    const [stopwatches, setStopwatches] = React.useState<Stopwatch[]>([]);
    React.useEffect(() => {
        fetchStopwatches().then(stopwatches => setStopwatches(stopwatches));
    }, []);
 
    return <div className="p-4 bg-gray-900 text-white rounded shadow-md">
        <h2 className="text-3xl font-bold mb-4">Stopwatches</h2>
        <ul className="space-y-4">
            {stopwatches.map(stopwatch => (
                <li key={stopwatch.id} className="bg-gray-800 p-4 rounded">
                    <h3 className="text-xl font-semibold mb-2">{stopwatch.name}</h3>
                    <Stopwatch id={stopwatch.id}/>
                </li> 
            ))}
        </ul>
    </div>
}