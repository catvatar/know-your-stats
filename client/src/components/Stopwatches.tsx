import Stopwatch from "./Stopwatch";

export default function Stopwatches() {
    const stopwatches = [
        { id: '1', name: "Okno postu" },
        { id: '2', name: "Okno karmienia" },
        { id: '3', name: "Spacer" },
    ];
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