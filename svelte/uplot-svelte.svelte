<script>
    import uPlot from 'uplot';
    import { onDestroy, onMount } from 'svelte';

    export let options;
    export let data;
    export let target = null;
    export let onDelete;
    export let onCreate;
    export let resetScales = true;
    let className;
    export { className as class };

    let chart = null;
    let div = null;

    const optionsUpdateState = (_lhs, _rhs) => {
        const { width: lhsWidth, height: lhsHeight, ...lhs } = _lhs;
        const { width: rhsWidth, height: rhsHeight, ...rhs } = _rhs;

        let state = 'keep';
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
    };

    const destroy = () => {
        if (chart) {
            onDelete(chart);
            chart.destroy();
            chart = null;
        }
    };

    const create = () => {
        if (!target && !div) {
            typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame(() => create());
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

    let prevOptions = { ...options };

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
    <div bind:this={div} class={className}></div>
{/if}
