// types_api.ts
export type Stopwatch = {
  id: number;
  name: string;
  description: string;
};

export type StopwatchEntry = {
  id: number;
  start_time: number;
  stop_time: number | null;
  note: string;
};

export type StopwatchPrototype = {
  name: string;
  description: string;
};
