import {useEffect, useRef, useState} from 'react';

import uPlot from 'uplot';

export default function UplotReact({options, data, target, onDelete = () => {}, onCreate = () => {}}: {
    options: uPlot.Options,
    data: uPlot.AlignedData,
    target: HTMLElement,
    onDelete?: (chart: uPlot) => void
    onCreate?: (chart: uPlot) => void
}) {
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
            const oldOptions = prevProps.options;
            const newOptions = options;
            const canUpdate = Object.keys(oldOptions).every(k => {
                if (k === 'height' || k === 'width') {
                    return true;
                }
                const stringify = (obj: any) =>
                    JSON.stringify(obj, (key, value) =>
                        typeof value === 'function' ? value.toString() : value
                    )

                return stringify(oldOptions[k]) === stringify(newOptions[k]);
            });
            if (canUpdate && chart) {
                if (oldOptions.height !== newOptions.height || oldOptions.width !== newOptions.width) {
                    chart.setSize({width: newOptions.width, height: newOptions.height});
                }
            } else {
                destroy(chart);
                create();
            }
        }
        if (prevProps.data !== data) {
            const newData = data;
            const oldData = prevProps.data;

            const dataMatch = (lhs: (number | null)[], rhs: (number | null)[]) => {
                if (lhs.length !== rhs.length) {
                    return false;
                }
                return lhs.every((value, idx) => value === rhs[idx]);
            }
            if (!chart) {
                create();
            } else if (oldData.length !== newData.length || !oldData.every((d, idx) => dataMatch(d, newData[idx]))) {
                chart.setData(newData);
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
    }, [options, data, target]
    );
    return null;
}
