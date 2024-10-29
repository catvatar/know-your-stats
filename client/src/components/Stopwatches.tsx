import Stopwatch from "./Stopwatch";

export default function Stopwatches() {
    const stopwatches = [
        { uid: '1', name: "Post" },
        { uid: '2', name: "Karmienie" },
        { uid: '3', name: "Spacer" },
    ];
    return <div className="p-4 bg-gray-900 text-white rounded shadow-md">
        <h2 className="text-3xl font-bold mb-4">Stopwatches</h2>
        <ul className="space-y-4">
            {stopwatches.map(stopwatch => (
                <li key={stopwatch.uid} className="bg-gray-800 p-4 rounded">
                    <h3 className="text-xl font-semibold mb-2">{stopwatch.name}</h3>
                    <Stopwatch uid={stopwatch.uid}/>
                </li>
            ))}
        </ul>
    </div>
}