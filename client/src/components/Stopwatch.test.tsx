import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Stopwatch from './Stopwatch';

jest.mock('../utils/time-formats', () => ({
    formatTime: jest.fn((time: number): string => `${time} seconds`)
}));


describe('Stopwatch Component', () => {
    let mockStopwatchEntries: { id: number, start_time: number, stop_time: number | null }[] = [];
    beforeEach(() => {
        jest.useFakeTimers();
        global.fetch = jest.fn((url, options) => {
            if (url === 'http://localhost:3001/api/stopwatches/1/entries/1' && options.method === 'GET') {
                return Promise.resolve({
                    json: () => Promise.resolve(mockStopwatchEntries)
                });
            }
            if (url === 'http://localhost:3001/api/stopwatches/1/entries' && options.method === 'POST') {
                mockStopwatchEntries.push({ id: 1, start_time: Date.now(), stop_time: null });
                return Promise.resolve({
                    json: () => Promise.resolve({ message: "Stopwatch started successfully!" })
                });
            }
            if (url === 'http://localhost:3001/api/stopwatches/1/entries' && options.method === 'PUT') {
                mockStopwatchEntries[mockStopwatchEntries.length - 1].stop_time = Date.now();
                return Promise.resolve({
                    json: () => Promise.resolve({ message: "Stopwatch stopped successfully!" })
                });
            }
            return Promise.reject(new Error('Unknown API call'));
        }) as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    test('renders Stopwatch component', async () => {
        await act(async () => {
            render(<Stopwatch id={1} />);
        });
        expect(screen.getByText('Run the stopwatch by pressing the Start button')).toBeInTheDocument();
    });
    
    test('starts the stopwatch', async () => {
        await act(async () => {
            render(<Stopwatch id={1} />);
        });
        
        const startButton = screen.getByText('Start');
        expect(startButton).toBeInTheDocument();
        
        await act(async () => {
            fireEvent.click(startButton);
        });
        
        expect(screen.getByText('Stop')).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/stopwatches/1/entries', expect.any(Object));
        expect(screen.getByText('0 seconds')).toBeInTheDocument();
    });

    test('stops the stopwatch', async () => {
        console.log(mockStopwatchEntries);
        await act(async () => {
            render(<Stopwatch id={1} />);
        });
        
        const stopButton = screen.getByText('Stop');
        expect(stopButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(stopButton);
        });
        act(() => {
            jest.advanceTimersByTime(1010);
        });

        expect(screen.getByText('Start')).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/stopwatches/1/entries', expect.any(Object));
    });

    test('updates elapsed time while running', async () => {
        await act(async () => {
            render(<Stopwatch id={1} />);
        });
        const startButton = screen.getByText('Start');
        await act(async () => {
            fireEvent.click(startButton);
        });

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(screen.getByText('3 seconds')).toBeInTheDocument();
    });
});