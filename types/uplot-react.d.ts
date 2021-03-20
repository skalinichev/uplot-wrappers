import React from 'react';
import uPlot from 'uplot';

export default function UplotReact({ options, data, target, onDelete, onCreate }: {
    options: uPlot.Options;
    data: uPlot.AlignedData;
    target: HTMLElement;
    onDelete?: (chart: uPlot) => void;
    onCreate?: (chart: uPlot) => void;
}): React.ReactNode;
