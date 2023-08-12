import React, { useCallback, useEffect, useRef } from 'react';

import uPlot from 'uplot';

import { optionsUpdateState, dataMatch } from 'uplot-wrappers-common';

export default function UplotReact({
    options,
    data,
    target,
    onDelete,
    onCreate,
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
    const propOptionsRef = useRef(options);
    const propTargetRef = useRef(target);
    const propDataRef = useRef(data);
    const onCreateRef = useRef(onCreate);
    const onDeleteRef = useRef(onDelete);

    useEffect(() => {
        onCreateRef.current = onCreate;
        onDeleteRef.current = onDelete;
    });

    const destroy = useCallback((chart: uPlot | null) => {
        if (chart) {
            onDeleteRef.current?.(chart);
            chart.destroy();
            chartRef.current = null;
        }
    }, []);
    const create = useCallback(() => {
        const newChart = new uPlot(
            propOptionsRef.current,
            propDataRef.current,
            propTargetRef.current || (targetRef.current as HTMLDivElement)
        );
        chartRef.current = newChart;
        onCreateRef.current?.(newChart);
    }, []);

    useEffect(() => {
        create();
        return () => {
            destroy(chartRef.current);
        };
    }, [create, destroy]);

    useEffect(() => {
        if (propOptionsRef.current !== options) {
            const optionsState = optionsUpdateState(propOptionsRef.current, options);
            propOptionsRef.current = options;
            if (!chartRef.current || optionsState === 'create') {
                destroy(chartRef.current);
                create();
            } else if (optionsState === 'update') {
                chartRef.current.setSize({
                    width: options.width,
                    height: options.height,
                });
            }
        }
    }, [options, create, destroy]);

    useEffect(() => {
        if (propDataRef.current !== data) {
            if (!chartRef.current) {
                propDataRef.current = data;
                create();
            } else if (!dataMatch(propDataRef.current, data)) {
                if (resetScales) {
                    chartRef.current.setData(data, true);
                } else {
                    chartRef.current.setData(data, false);
                    chartRef.current.redraw();
                }
            }
            propDataRef.current = data;
        }
    }, [data, resetScales, create]);

    useEffect(() => {
        if (propTargetRef.current !== target) {
            propTargetRef.current = target;
            create();
        }

        return () => destroy(chartRef.current);
    }, [target, create, destroy]);

    return target ? null : <div ref={targetRef}></div>;
}
