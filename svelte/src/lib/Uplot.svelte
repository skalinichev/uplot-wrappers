<script lang="ts">
    import 'uplot/dist/uPlot.min.css';
    import uPlot from 'uplot';
    import {onDestroy, onMount} from "svelte";

    export let options: uPlot.Options;
    export let data: uPlot.AlignedData;
    export let target: HTMLDivElement = null;
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
        if (chart) {
            destroy();
        }
        if (target instanceof HTMLElement) {
            chart = new uPlot(options, data, target || div);
            onCreate(chart);
        }
    };

    onMount(() => {
        create();
    });

    onDestroy(() => {
        destroy();
    });

    $: if (options || data || target) {
        create();
    }

    $: {
        if (!chart) {
            create();
        } else if (!resetScales) {
            chart.setData(data, false);
            chart.redraw();
        }
    }

</script>

{#if !target}
    <div bind:this={div}></div>
{/if}