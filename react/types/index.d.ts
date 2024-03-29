import React from 'react';
import uPlot from 'uplot';

export default function ({
    options,
    data,
    target,
    onDelete,
    onCreate,
    resetScales,
}: {
    options: uPlot.Options;
    data: uPlot.AlignedData;
    target?: HTMLElement | ((self: uPlot, init: Function) => void);
    onDelete?: (chart: uPlot) => void;
    onCreate?: (chart: uPlot) => void;
    resetScales?: boolean;
}): JSX.Element | null;
