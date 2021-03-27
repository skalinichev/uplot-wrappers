import React, {useEffect, useMemo, useState} from 'react';
import ReactDOM, {unstable_batchedUpdates} from 'react-dom';

import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';

import UPlotReact from './uplot-react';

const root: HTMLElement = document.querySelector('#root')!;

class ClassApp extends React.Component<
    Record<string, never>,
    {options: uPlot.Options, data: uPlot.AlignedData}
> {
    constructor(args: Record<string, never>) {
        super(args);
        this.state = {
            options: {title: 'Chart', width: 400, height: 300, series: [{
                label: 'Date'
            }, {
                label: '',
                points: {show: false},
                stroke: 'blue',
                fill: 'blue'
            }],
                scales: {x: {time: false}}
            },
            data: [new Array(100000).fill(0).map((_, i) => i), new Array(100000).fill(0).map((_, i) => i % 1000)]
        };
        setInterval(() => {
            const options = {
                ...this.state.options,
                title: 'Rendered with class'
            };
            const data: uPlot.AlignedData = [
                [...this.state.data[0], this.state.data[0].length],
                [...this.state.data[1], this.state.data[0].length % 1000]
            ];
            this.setState({data, options});
        }, 100);
    }
    render(): React.ReactNode {
        return (<UPlotReact
            key="class-key"
            options={this.state.options}
            data={this.state.data}
            // Let the uplot-react wrapper create the DOM node itself
            // target={root}
            onDelete={(/* chart: uPlot */) => console.log('Deleted from class')}
            onCreate={(/* chart: uPlot */) => console.log('Created from class')}
        />);
    }
}

const HooksApp = () => {
    const [options, setOptions] = useState<uPlot.Options>(
        {title: 'Chart', width: 400, height: 300, series: [{
            label: 'Date'
        }, {
            label: '',
            points: {show: false},
            stroke: 'blue',
            fill: 'blue'
        }],
        scales: {x: {time: false}}
    });
    const initialState = useMemo<uPlot.AlignedData>(() =>
        ([new Array(100000).fill(0).map((_, i) => i), new Array(100000).fill(0).map((_, i) => i % 1000)])
    , []);
    const [data, setData] = useState<uPlot.AlignedData>(initialState);
    useEffect(() => {

    }, []);
    setTimeout(() => {
        const newOptions = {
            ...options,
            title: 'Rendered with hooks'
        };
        const newData: uPlot.AlignedData = [
            [...data[0], data[0].length],
            [...data[1], data[0].length % 1000]
        ];

        unstable_batchedUpdates(() => {
            setData(newData);
            setOptions(newOptions);
        });
    }, 100);
    return (<UPlotReact
        key="hooks-key"
        options={options}
        data={data}
        target={root}
        onDelete={(/* chart: uPlot */) => console.log('Deleted from hooks')}
        onCreate={(/* chart: uPlot */) => console.log('Created from hooks')}
    />);
}

ReactDOM.render(
    <React.Fragment>
        <HooksApp />
        <ClassApp />
    </React.Fragment>,
    root
);
