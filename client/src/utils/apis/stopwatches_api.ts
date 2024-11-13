import { StopwatchPrototype, Stopwatch } from "./types_api";

export async function fetchStopwatches(): Promise<Stopwatch[]> {
  return await fetch("http://localhost:3001/api/stopwatches", {
    method: "GET",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
    credentials: "include", // Include credentials to send session cookie
  }).then((response) => {
    return response.json();
  });
}

export async function fetchStopwatch(id: number): Promise<Stopwatch> {
  return await fetch(`http://localhost:3001/api/stopwatches/${id}`, {
    method: "GET",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
    credentials: "include", // Include credentials to send session cookie
  }).then((response) => {
    return response.json();
  });
}

export async function createStopwatch(
  stopwatch: StopwatchPrototype,
): Promise<Stopwatch> {
  return await fetch("http://localhost:3001/api/stopwatches", {
    method: "POST",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
    credentials: "include", // Include credentials to send session cookie
    body: JSON.stringify(stopwatch),
  }).then((response) => {
    return response.json();
  });
}

export async function renameStopwatch(
  id: number,
  name: string,
): Promise<Stopwatch> {
  return fetch(`http://localhost:3001/api/stopwatches/${id}`, {
    method: "PUT",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
    body: JSON.stringify({ name }),
  }).then((response) => {
    return response.json();
  });
}

export async function deleteStopwatch(id: number): Promise<void> {
  return fetch(`http://localhost:3001/api/stopwatches/${id}`, {
    method: "DELETE",
    headers: {
      "user-agent": "vscode-restclient",
    },
  }).then(() => {
    return;
  });
}

export async function editStopwatchDescription(
  id: number,
  newDescription: string,
): Promise<Stopwatch> {
  return fetch(`http://localhost:3001/api/stopwatches/${id}/description`, {
    method: "PUT",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
    body: JSON.stringify({ newDescription }),
  }).then((response) => {
    return response.json();
  });
}
