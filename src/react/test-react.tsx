import React, {useState} from 'react';
import ReactDOM, {unstable_batchedUpdates} from 'react-dom';

import uPlot from 'uplot';
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
            data: [[0, 1, 3, 4, 5], [10, 20, 10, 0, 30]]
        };
        setInterval(() => {
            const rand = Math.round(Math.random() * 10);
            const options = {
                ...this.state.options,
                title: 'Rendered with class'
            };
            const data: uPlot.AlignedData = [...this.state.data];
            data[1] = [...data[1]];
            data[1][rand % (data[1].length - 1)] = rand * 3;
            this.setState({data, options});
        }, 2000);
    }
    render(): React.ReactNode {
        return (<UPlotReact
            options={this.state.options}
            data={this.state.data}
            target={root}
            onDelete={() => console.log('Deleted from class')}
            onCreate={() => console.log('Created form class')}
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
    const [data, setData] = useState<uPlot.AlignedData>([[0, 1, 3, 4, 5], [10, 20, 10, 0, 30]]);
    setTimeout(() => {
        const rand = Math.round(Math.random() * 10);
        const newOptions = {
            ...options,
            title: 'Rendered with hooks'
        };
        const newData: uPlot.AlignedData = [...data];
        newData[1] = [...newData[1]];
        newData[1][rand % (newData[1].length - 1)] = rand * 3;
        unstable_batchedUpdates(() => {
            setData(newData);
            setOptions(newOptions);
        });
    }, 2000);
    return (<UPlotReact
        options={options}
        data={data}
        target={root}
        onDelete={() => console.log('Deleted from hooks')}
        onCreate={() => console.log('Created from hooks')}
    />);
}

ReactDOM.render(
    <div>
        <HooksApp />,
        <ClassApp />
    </div>,
    root
);
