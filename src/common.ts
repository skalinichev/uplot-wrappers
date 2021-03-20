import uPlot from 'uplot';

type OptionsUpdateState = 'keep' | 'update' | 'create';

const stringify = (obj: Object) =>
    JSON.stringify(obj, (key, value) =>
        typeof value === 'function' ? value.toString() : value
    )

export const optionsUpdateState = (lhs: uPlot.Options, rhs: uPlot.Options): OptionsUpdateState => {
    let state: OptionsUpdateState = 'keep';
    for (const k of Object.keys(lhs)) {
        if (k === 'height' || k === 'width') {
            if (lhs[k] !== rhs[k]) {
                state = 'update';
            }
        }

        if (stringify(lhs[k]) !== stringify(rhs[k])) {
            state = 'create';
            break;
        }
    }
    return state;
}

export const dataMatch = (lhs: uPlot.AlignedData, rhs: uPlot.AlignedData) => {
    if (lhs.length !== rhs.length) {
        return false;
    }
    return lhs.every((lhsOneSeries, seriesIdx) => {
        const rhsOneSeries = rhs[seriesIdx];
        if (lhsOneSeries.length !== rhsOneSeries.length) {
            return false;
        }
        return lhsOneSeries.every((value, valueIdx) => value === rhsOneSeries[valueIdx]);
    });
}
