import { StopwatchEntry } from "./types_api";

export async function fetchStopwatchEntries(
  id: number,
  limit: number | null = null,
): Promise<StopwatchEntry[]> {
  const apiURL: string = limit
    ? `http://localhost:3001/api/stopwatches/${id}/entries/${limit}`
    : `http://localhost:3001/api/stopwatches/${id}/entries`;
  return await fetch(apiURL, {
    method: "GET",
    headers: {
      "user-agent": "vscode-restclient",
    },
    credentials: "include", // Include credentials to send session cookie
  }).then((response) => {
    return response.json();
  });
}

export async function startStopwatch(id: number): Promise<StopwatchEntry> {
  return fetch(`http://localhost:3001/api/stopwatches/${id}/entries`, {
    method: "POST",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
    credentials: "include", // Include credentials to send session cookie
    body: JSON.stringify({ start_time: Date.now() }),
  }).then((response) => {
    return response.json();
  });
}

export async function stopStopwatch(id: number): Promise<StopwatchEntry> {
  return fetch(`http://localhost:3001/api/stopwatches/${id}/entries`, {
    method: "PUT",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
    credentials: "include", // Include credentials to send session cookie
    body: JSON.stringify({ stop_time: Date.now() }),
  }).then((response) => {
    return response.json();
  });
}

export async function deleteStopwatchEntry(id: number): Promise<void> {
  return fetch(`http://localhost:3001/api/stopwatches/entries/${id}`, {
    method: "DELETE",
    headers: {
      "user-agent": "vscode-restclient",
    },
    credentials: "include", // Include credentials to send session cookie
  }).then(() => {
    return;
  });
}

export async function updateStopwatchEntryWithNote(
  id: number,
  note: string,
): Promise<StopwatchEntry> {
  return fetch(`http://localhost:3001/api/stopwatches/entries/${id}/note`, {
    method: "PUT",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
    credentials: "include", // Include credentials to send session cookie
    body: JSON.stringify({ note }),
  }).then((response) => {
    return response.json();
  });
}
