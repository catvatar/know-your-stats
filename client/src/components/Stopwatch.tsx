import React, { useEffect, useState } from 'react'; 

export default function Stopwatch({id}: {id: number}) {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let intervalId: number;
        if (isRunning) {
            intervalId = window.setInterval(() => {
                setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
            }, 1000);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor(time / 60) % 60;
        const seconds = time % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return <div className="flex flex-col items-center p-4 bg-gray-800 text-white rounded shadow-md">
        <p className="text-2xl mb-4">{formatTime(elapsedTime)}</p> {/* Increased text size */}
        <div className="space-x-2">
            {!isRunning?
            <button onClick={handleStart} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Start</button>:
            <button onClick={handleStop} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Stop</button>
            }
        </div>
    </div>;
}