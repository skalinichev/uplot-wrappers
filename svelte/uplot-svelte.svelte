<script lang="ts">
    import uPlot from 'uplot';
    import { onDestroy, onMount } from 'svelte';
    import { optionsUpdateState } from 'uplot-wrappers-common';

    export let options: uPlot.Options;
    export let data: uPlot.AlignedData;
    export let target: HTMLDivElement | null = null;
    export let onDelete: (chart: uPlot) => void = () => {};
    export let onCreate: (chart: uPlot) => void = () => {};
    export let resetScales = true;

    let chart: uPlot | null = null;
    let div: HTMLDivElement;

    const destroy = () => {
        if (chart) {
            onDelete(chart);
            chart.destroy();
            chart = null;
        }
    };

    const create = () => {
        if (!target && !div) {
            requestAnimationFrame(() => create());
            return;
        }
        if (!chart) {
            chart = new uPlot(options, data, target || div);
            onCreate(chart);
        }
    };

    onMount(async () => {
        create();
    });

    onDestroy(() => {
        destroy();
    });

    let prevOptions: uPlot.Options = { ...options };

    $: {
        if (options) {
            const state = optionsUpdateState(prevOptions, options);
            prevOptions = { ...options };
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
