import React from 'react';
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LineSeriesPoint} from 'react-vis';


export function LineChart({ data, size}: { data: LineSeriesPoint[], size: [number, number]}): React.JSX.Element {
    const maxEntry = data.reduce((acc, curr) => curr.y > acc ? curr.y : acc, 0) + 1;
    const seriesDuration = data.length > 0 ? data[data.length - 1].x - data[0].x : 0;

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
        <XYPlot height={size[0]} width={size[1]} yDomain={[0,maxEntry]} className={'bg-gray-900 stroke-1 stroke-gray-50 fill-gray-50'}>
            <VerticalGridLines tickTotal={17}/>
            <HorizontalGridLines tickTotal={8} />
            <XAxis tickFormat={(t)=>formatDate(t, seriesDuration)} tickTotal={9} tickLabelAngle={-30}/>
            <YAxis />
            <LineSeries data={data} className='fill-none stroke-2' color={'red'}/>
        </XYPlot>
    );
}
