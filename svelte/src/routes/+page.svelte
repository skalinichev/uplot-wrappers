<script lang="ts">
    import {UplotSvelte} from "$lib";

    let data = [[1, 2, 3, 4, 5], [1, 3, 2, 5, 4]];

    let options = {
        width: 600,
        height: 300,
        scales: {x: {time: false}},
        series: [{label: "x"}, {label: "y", stroke: "red"}],
    };

    let flag: boolean = true;
    let log:HTMLParagraphElement;

    /**
     * Callback when the uplot is created
     * @param uplot
     */
    let onCreate = (uplot: any) => {
        log.innerText = log.innerText + " Created";
    };

    /**
     * Callback when the uplot is deleted
     * @param uplot
     */
    let onDelete = (uplot: any) => {
        log.innerText = log.innerText + " Deleted";
    };
</script>

<div style="display: flex; flex-direction: column; align-items: start; gap: 10px">
    <div style="display: flex; gap: 10px;">
        <button on:click={() => data[1][0]+=1}>Update Data</button>
        <button on:click={() => {
    let newData0 = [...data[0], data[0][data[0].length - 1] + 1];
    let newData1 = [...data[1], Math.random() * 10];
    data = [newData0, newData1]; }}>Add Data</button>
        <button on:click={() => data = [[1, 2, 3, 4, 5], [1, 3, 2, 5, 4]]}>Reset Data</button>
    </div>
    <div style="display: flex; gap: 10px;">
        <button on:click={() => options = {...options, series: options.series.map((series, index) => index === 1 ? {...series, stroke: "green"} : series)}}>Update options</button>
        <button on:click={() => options = {...options, series: options.series.map((series, index) => index === 1 ? {...series, stroke: "red"} : series)}}>Reset options</button>
        <button on:click={() => options = {...options, width: 400}}>Update Width</button>
        <button on:click={() => options = {...options, width: 600}}>Reset Width</button>
    </div>
    <button on:click={() => flag = !flag}>Toggle</button>
</div>
<p bind:this={log}>Log: </p>

{#if flag}
    <UplotSvelte {data} {options} resetScales={true} {onCreate} {onDelete}/>
{/if}

