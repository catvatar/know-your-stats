import { StopwatchPrototype, Stopwatch } from './types_api';

export async function fetchStopwatches() : Promise<Stopwatch[] | Error> {
    return await fetch("http://localhost:3001/api/stopwatches", {
        "method": "GET",
        "headers": {
            "user-agent": "vscode-restclient"
        }
    }).then(response => {
        return response;
    }).catch(err => {
        return err;
    });
}

export async function createStopwatch(stopwatch: StopwatchPrototype) : Promise<Stopwatch | Error> {
    return await fetch("http://localhost:3001/api/stopwatches", {
        "method": "POST",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        body: JSON.stringify(stopwatch)
    })
    .then(response => {
        return response; 
    })
    .catch(err => {
        return err;
    });
}

export async function renameStopwatch(id: number, name: string) : Promise<Stopwatch | Error> {
    return fetch(`http://localhost:3001/api/stopwatches/${id}`, {
        "method": "PUT",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        body: JSON.stringify({ name })
    })
    .then(response => {
        return response;
    })
    .catch(err => {
        return err;
    });
}

export async function deleteStopwatch(id: number) {
    return fetch(`http://localhost:3001/api/stopwatches/${id}`, {
        "method": "DELETE",
        "headers": {
            "user-agent": "vscode-restclient"
        }
    })
    .then(response => {
        return null;
    })
    .catch(err => {
        throw err;
    });
}

export async function editStopwatchDescription(id: number, newDescription: string) : Promise<Stopwatch> {
    return fetch(`http://localhost:3001/api/stopwatches/${id}/description`, {
        "method": "PUT",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        body: JSON.stringify({ newDescription })
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        throw err;
    })
}