import React, { useEffect, useRef } from 'react';

import uPlot from 'uplot';

import { optionsUpdateState, dataMatch } from 'uplot-wrappers-common';

export default function UplotReact({
    options,
    data,
    target,
    onDelete = () => {},
    onCreate = () => {},
    resetScales = true,
}: {
    options: uPlot.Options;
    data: uPlot.AlignedData;
    // eslint-disable-next-line
    target?: HTMLElement | ((self: uPlot, init: Function) => void);
    onDelete?: (chart: uPlot) => void;
    onCreate?: (chart: uPlot) => void;
    resetScales?: boolean;
}): JSX.Element | null {
    const chartRef = useRef<uPlot | null>(null);
    const targetRef = useRef<HTMLDivElement>(null);

    function destroy(chart: uPlot | null) {
        if (chart) {
            onDelete(chart);
            chart.destroy();
            chartRef.current = null;
        }
    }
    function create() {
        const newChart = new uPlot(options, data, target || (targetRef.current as HTMLDivElement));
        chartRef.current = newChart;
        onCreate(newChart);
    }
    // componentDidMount + componentWillUnmount
    useEffect(() => {
        create();
        return () => {
            destroy(chartRef.current);
        };
    }, []);
    // componentDidUpdate
    const prevProps = useRef({ options, data, target }).current;
    useEffect(() => {
        if (prevProps.options !== options) {
            const optionsState = optionsUpdateState(prevProps.options, options);
            if (!chartRef.current || optionsState === 'create') {
                destroy(chartRef.current);
                create();
            } else if (optionsState === 'update') {
                chartRef.current.setSize({ width: options.width, height: options.height });
            }
        }
        if (prevProps.data !== data) {
            if (!chartRef.current) {
                create();
            } else if (!dataMatch(prevProps.data, data)) {
                if (resetScales) {
                    chartRef.current.setData(data, true);
                } else {
                    chartRef.current.setData(data, false);
                    chartRef.current.redraw();
                }
            }
        }
        if (prevProps.target !== target) {
            destroy(chartRef.current);
            create();
        }

        return () => {
            prevProps.options = options;
            prevProps.data = data;
            prevProps.target = target;
        };
    }, [options, data, target, resetScales]);

    return target ? null : <div ref={targetRef}></div>;
}
