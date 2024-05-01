<script lang="ts">
    import 'uplot/dist/uPlot.min.css';
    import type uPlot from 'uplot';
    import {onDestroy, onMount} from "svelte";
    // import {optionsUpdateState} from "uplot-wrappers-common";

    let uPlot: uPlot;
    export let options: uPlot.Options;
    export let data: uPlot.AlignedData;
    export let target: HTMLDivElement | null = null;
    export let onDelete: (chart: uPlot) => void = () => {};
    export let onCreate: (chart: uPlot) => void = () => {};
    export let resetScales:boolean = true;

    let chart: uPlot | null = null;
    let div: HTMLDivElement;

    const destroy = () => {
        if (chart) {
            chart.destroy();
            onDelete(chart);
            chart = null;
        }
    };

    const create = () => {
        if (uPlot && !chart) {
            chart = new uPlot(options, data, target || div);
            onCreate(chart);
        }
    };

    onMount(async () => {
        const uplotModule = await import('uplot');
        uPlot = uplotModule.default;
        create();
    });

    onDestroy(() => {
        destroy();
    });

    let prevOptions: uPlot.Options = {...options};


    // TODO: Remove redeclaration of optionsUpdateState when uplot-wrappers-common is fixed
    const optionsUpdateState = (_lhs: uPlot.Options, _rhs: uPlot.Options): string => {
        const {width: lhsWidth, height: lhsHeight, ...lhs} = _lhs;
        const {width: rhsWidth, height: rhsHeight, ...rhs} = _rhs;

        let state: string = 'keep';
        if (lhsHeight !== rhsHeight || lhsWidth !== rhsWidth) {
            state = 'update';
        }
        if (Object.keys(lhs).length !== Object.keys(rhs).length) {
            return 'create';
        }
        for (const k of Object.keys(lhs)) {
            if (!Object.is(lhs[k], rhs[k])) {
                state = 'create';
                break;
            }
        }
        return state;
    }


    $: {
        if (options) {
            const state = optionsUpdateState(prevOptions, options);
            prevOptions = {...options};
            if (state === 'create') {
                destroy();
                create();
            } else if (state === 'update' && chart) {
                chart.setSize({
                    width: options.width,
                    height: options.height,
                });
            }
        }
    }

    $: if (target) {
        destroy();
        create();
    }

    $: {
        if (!chart) {
            create();
        } else if (resetScales) {
            chart.setData(data, true);
        } else {
            chart.setData(data, false);
            chart.redraw();
        }
    }

</script>

{#if !target}
    <div bind:this={div}></div>
{/if}