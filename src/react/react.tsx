import {useEffect, useRef, useState} from 'react';

import uPlot from 'uplot';

import {optionsUpdateState, dataMatch} from '../common';

export default function UplotReact({options, data, target, onDelete = () => {}, onCreate = () => {}}: {
    options: uPlot.Options,
    data: uPlot.AlignedData,
    // eslint-disable-next-line
    target?: HTMLElement | ((self: uPlot, init: Function) => void),
    onDelete?: (chart: uPlot) => void
    onCreate?: (chart: uPlot) => void
}): JSX.Element | null {
    const [chart, setChart] = useState<uPlot | null>(null);

    function destroy(chart: uPlot | null) {
        if (chart) {
            onDelete(chart);
            chart.destroy();
            setChart(null);
        }
    }
    function create() {
        const newChart = new uPlot(options, data, target)
        setChart(newChart);
        onCreate(newChart);
    }
    // componentDidMount + componentWillUnmount
    useEffect(() => {
        create();
        return () => {
            destroy(chart);
        }
    }, []);
    // componentDidUpdate
    const prevProps = useRef({options, data, target}).current;
    useEffect(() => {
        if (prevProps.options !== options) {
            const optionsState = optionsUpdateState(prevProps.options, options);
            if (!chart || optionsState === 'create') {
                destroy(chart);
                create();
            } else if (optionsState === 'update') {
                chart.setSize({width: options.width, height: options.height});
            }
        }
        if (prevProps.data !== data) {
            if (!chart) {
                create();
            } else if (!dataMatch(prevProps.data, data)) {
                chart.setData(data);
            }
        }
        if (prevProps.target !== target) {
            destroy(chart);
            create();
        }

        return () => {
            prevProps.options = options;
            prevProps.data = data;
            prevProps.target = target;
        };
    }, [options, data, target]);

    return null;
}
