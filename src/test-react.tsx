import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import uPlot from 'uplot';
import UplotReact from 'uplot-wrappers';

let series = [{
    label: 'Date'
  }, {
    label: '',
    points: {show: false},
    stroke: 'blue',
    fill: 'blue'
  }
]

const root: HTMLElement = document.querySelector('#root')!;

let options = {width: 800, height: 600, series};
let data: uPlot.AlignedData = [[0, 1, 3, 4, 5], [10, 20, 10, 0, 30]];

class ClassApp extends React.Component<Record<string, never>, {updater: number}> {
    constructor(args: Record<string, never>) {
        super(args);
        this.state = {updater: 0};
        setInterval(() => {
            series = [...series];
            series[0] = {label: 'Date' + Math.random() * 10};
            options = {...options, series, width: options.width - 5};
            data = [...data];
            data[1][0] = Math.random() * 10;
            this.setState({updater: this.state.updater + Math.random()});
        }, 1000);
    }
    render(): React.ReactNode {
        return <UplotReact options={options} data={data} target={root} onDelete={() => console.log('Deleted2')} onCreate={() => console.log('Created2')}/>
    }
}

const App = () => {
    const [updater, setUpdater] = useState(0);
    setTimeout(() => {
        series = [...series];
        series[0] = {label: 'Date' + Math.random() * 10};
        options = {...options, series, width: options.width - 5};
        data = [...data];
        data[1][0] = Math.random() * 10;
        setUpdater(updater + Math.random());
    }, 1000);
    return <UplotReact options={options} data={data} target={root} onDelete={() => console.log('Deleted')} onCreate={() => console.log('Created')}/>
}

ReactDOM.render(
    <div>
        <App />,
        <ClassApp />
    </div>,
    root
);
