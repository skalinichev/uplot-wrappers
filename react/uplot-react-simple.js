import React from 'react';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';

const data = [
    [0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3, 4, 5],
];

const options = {
    width: 400,
    height: 300,
    scales: {
        x: {
            time: false,
            range: [-0.5, 5.5],
        },
        y: {},
    },
    axes: [{}],
    series: [
        {},
        {
            stroke: 'blue',
        },
    ],
};

const Chart = () => <UplotReact options={options} data={data} onCreate={(chart) => {}} onDelete={(chart) => {}} />;

function MuPlotChartJSExample() {
    return (
        <div>
            <Chart />
        </div>
    );
}

export default MuPlotChartJSExample;
