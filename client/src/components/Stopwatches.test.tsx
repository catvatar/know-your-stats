import React from 'react';

import {act, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Stopwatches from './Stopwatches';

jest.mock('./Stopwatch', () => ({ id }: { id: number }) => <div>Stopwatch</div>);


describe('Stopwatches Component', () => {
    let mockStopwatches: { id: number, name: string }[] = [{ id: 1, name: 'Stopwatch 1' }, { id: 2, name: 'Stopwatch 2' }];
    beforeEach(() => {
        global.fetch = jest.fn((url, options) => {
            if (url === 'http://localhost:3001/api/stopwatches' && options.method === 'GET') {
                return Promise.resolve({
                    json: () => Promise.resolve(mockStopwatches)
                });
            }
            if (url === 'http://localhost:3001/api/stopwatches' && options.method === 'POST') {
                mockStopwatches.push({ id: 3, name: JSON.parse(options.body as string).name });
                return Promise.resolve({
                    json: () => Promise.resolve({ message: "Stopwatch added successfully!", id: 3 })
                });
            }
            if (url === 'http://localhost:3001/api/stopwatches/1' && options.method === 'DELETE') {
                mockStopwatches = mockStopwatches.filter(stopwatch => stopwatch.id !== 1);
                return Promise.resolve({
                    json: () => Promise.resolve({ message: "Stopwatch deleted successfully!" })
                });
            }
            return Promise.reject(new Error('Unknown API call'));
        }) as jest.Mock;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('renders stopwatches',async () => {
        await act(() => {
            render(<Stopwatches />);
        });
        expect(screen.getByText('Stopwatch 1')).toBeInTheDocument();
        expect(screen.getByText('Stopwatch 2')).toBeInTheDocument();
    });

    // test('opens and closes the add stopwatch popup', () => {
    //     render(<Stopwatches />);
    //     expect(screen.queryByPlaceholderText('Stopwatch Name')).not.toBeInTheDocument();
    //     fireEvent.click(screen.getByText('Add Stopwatch'));
    //     expect(screen.getByPlaceholderText('Stopwatch Name')).toBeInTheDocument();
    //     fireEvent.click(screen.getByText('Cancel'));
    //     expect(screen.queryByPlaceholderText('Stopwatch Name')).not.toBeInTheDocument();
    // });

    // test('adds a new stopwatch', async () => {
    //     render(<Stopwatches />);
    //     fireEvent.click(screen.getByText('Add Stopwatch'));
    //     fireEvent.change(screen.getByPlaceholderText('Stopwatch Name'), { target: { value: 'Stopwatch 3' } });
    //     fireEvent.click(screen.getByText('Add'));
    //     await waitFor(() => {
    //         expect(screen.getByText('Stopwatch 3')).toBeInTheDocument();
    //     });
    // });

    // test('deletes a stopwatch', async () => {
    //     render(<Stopwatches />);
    //     await waitFor(() => {
    //         expect(screen.getByText('Stopwatch 1')).toBeInTheDocument();
    //     });
    //     fireEvent.click(screen.getAllByText('Delete')[0]);
    //     await waitFor(() => {
    //         expect(screen.queryByText('Stopwatch 1')).not.toBeInTheDocument();
    //     });
    // });

    // test('adds a new stopwatch', async () => {
    //     render(<Stopwatches />);
    //     fireEvent.click(screen.getByText('Add Stopwatch'));
    //     fireEvent.change(screen.getByPlaceholderText('Stopwatch Name'), { target: { value: 'Stopwatch 3' } });
    //     fireEvent.click(screen.getByText('Add'));
    //     await waitFor(() => {
    //         expect(screen.getByText('Stopwatch 3')).toBeInTheDocument();
    //     });
    // });

    // test('deletes a stopwatch', async () => {
    //     render(<Stopwatches />);
    //     await waitFor(() => {
    //         expect(screen.getByText('Stopwatch 1')).toBeInTheDocument();
    //     });
    //     fireEvent.click(screen.getAllByText('Delete')[0]);
    //     await waitFor(() => {
    //         expect(screen.queryByText('Stopwatch 1')).not.toBeInTheDocument();
    //     });
    // });
});
