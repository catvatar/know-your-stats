
export type StopwatchResponse = {
    id: number;
    name: string;
    description: string;
}

export type StopwatchPrototype = {
    name: string;
    description: string;
}


export async function fetchStopwatches() : Promise<StopwatchResponse[]> {
    return await fetch("http://localhost:3001/api/stopwatches", {
        "method": "GET",
        "headers": {
            "user-agent": "vscode-restclient"
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        return err;
    });
}

export async function createStopwatch(stopwatch: StopwatchPrototype) {
    fetch("http://localhost:3001/api/stopwatches", {
        "method": "POST",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        body: JSON.stringify(stopwatch)
    })
    .catch(err => {
        return err;
    });
}

export async function renameStopwatch(id: number, name: string) {
    fetch(`http://localhost:3001/api/stopwatches/${id}`, {
        "method": "PUT",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        body: JSON.stringify({ name })
    })
    .catch(err => {
        return err;
    });
}

export async function deleteStopwatch(id: number) {
    fetch(`http://localhost:3001/api/stopwatches/${id}`, {
        "method": "DELETE",
        "headers": {
            "user-agent": "vscode-restclient"
        }
    })
    .catch(err => {
        return err;
    });
}
