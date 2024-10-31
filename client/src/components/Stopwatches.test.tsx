import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Stopwatches from './Stopwatches';

jest.mock('./Stopwatch', () => ({ id }: { id: number }) => <div>Stopwatch {id}</div>);

describe('Stopwatches Component', () => {
    beforeEach(() => {
        global.fetch = jest.fn((url, options) => {
            if (url === 'http://localhost:3001/api/stopwatches' && options.method === 'GET') {
                return Promise.resolve({
                    json: () => Promise.resolve([{ id: 1, name: 'Stopwatch 1' }, { id: 2, name: 'Stopwatch 2' }])
                });
            }
            if (url === 'http://localhost:3001/api/stopwatches' && options.method === 'POST') {
                return Promise.resolve({
                    json: () => Promise.resolve({ id: 3, name: 'Stopwatch 3' })
                });
            }
            if (url === 'http://localhost:3001/api/stopwatches/1' && options.method === 'DELETE') {
                return Promise.resolve({
                    json: () => Promise.resolve({})
                });
            }
            return Promise.reject(new Error('Unknown API call'));
        }) as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders stopwatches', async () => {
        render(<Stopwatches />);
        await waitFor(() => {
            expect(screen.getByText('Stopwatch 1')).toBeInTheDocument();
            expect(screen.getByText('Stopwatch 2')).toBeInTheDocument();
        });
    });

    test('opens and closes the add stopwatch popup', () => {
        render(<Stopwatches />);
        fireEvent.click(screen.getByText('Add Stopwatch'));
        expect(screen.getByPlaceholderText('Stopwatch Name')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByPlaceholderText('Stopwatch Name')).not.toBeInTheDocument();
    });

    test('adds a new stopwatch', async () => {
        render(<Stopwatches />);
        fireEvent.click(screen.getByText('Add Stopwatch'));
        fireEvent.change(screen.getByPlaceholderText('Stopwatch Name'), { target: { value: 'Stopwatch 3' } });
        fireEvent.click(screen.getByText('Add'));
        await waitFor(() => {
            expect(screen.getByText('Stopwatch 3')).toBeInTheDocument();
        });
    });

    test('deletes a stopwatch', async () => {
        render(<Stopwatches />);
        await waitFor(() => {
            expect(screen.getByText('Stopwatch 1')).toBeInTheDocument();
        });
        fireEvent.click(screen.getAllByText('Delete')[0]);
        await waitFor(() => {
            expect(screen.queryByText('Stopwatch 1')).not.toBeInTheDocument();
        });
    });
});
