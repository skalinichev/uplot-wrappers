import React from 'react';
import uPlot from 'uplot';

export default function ({
    options,
    data,
    target,
    onDelete,
    onCreate,
    resetScales,
    className
}: {
    options: uPlot.Options;
    data: uPlot.AlignedData;
    target?: HTMLElement;
    onDelete?: (chart: uPlot) => void;
    onCreate?: (chart: uPlot) => void;
    resetScales?: boolean;
    className?: string;
}): JSX.Element | null;
