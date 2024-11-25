import React from "react";
import { LineChart as MULineChart } from '@mui/x-charts/LineChart';
import { formatTime } from "../utils/functions/time-formats";

export function LineChart({
  data,
  size,
}: {
  data: {
    x: number;
    y: number;
  }[];
  size: [number, number];
}): React.JSX.Element {
  const maxEntry =
    data.reduce((acc, curr) => (curr.y > acc ? curr.y : acc), 0) + 1;
  const seriesDuration =
    data.length > 0 ? data[data.length - 1].x - data[0].x : 0;

  function formatDate(timestamp: number, duration: number): string {
    const date = new Date(timestamp);
    if (duration > 366 * 24 * 60 * 60 * 1000) {
      return date.toLocaleString();
    }
    if (duration > 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString();
    }
    return date.toLocaleTimeString();
  }

  return (
    <div className="stroke-white">
      <MULineChart
        xAxis={[
          {
            dataKey: 'x',
            valueFormatter: (t) => formatDate(t, seriesDuration),
          },
        ]}
        series={[{
          dataKey: 'y',
          valueFormatter: (t) => formatTime(t?t:0),
        }]}
        dataset={data}
        height={size[0]}
        width={size[1]}
      />
    </div>
  );
}

