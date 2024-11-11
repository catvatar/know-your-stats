export async function fetchStopwatchEntries(id: number, limit: number | null = null) {
    const apiURL: string = limit ? `http://localhost:3001/api/stopwatches/${id}/entries/${limit}` : `http://localhost:3001/api/stopwatches/${id}/entries`;
    return await fetch(apiURL, {
        "method": "GET",
        "headers": {
            "user-agent": "vscode-restclient"
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        return err.json();
    });
}

export async function startStopwatch(id: number) {
    fetch(`http://localhost:3001/api/stopwatches/${id}/entries`, {
        "method": "POST",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        body: JSON.stringify({ start_time: Date.now() })
    }).then(response => {
        return response.json();
    })
    .catch(err => {
        return err.json();
    });
}

export async function stopStopwatch(id: number) {
    fetch(`http://localhost:3001/api/stopwatches/${id}/entries`, {
        "method": "PUT",
        "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
        },
        body: JSON.stringify({ stop_time: Date.now() })
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        return err.json();
    });
}
