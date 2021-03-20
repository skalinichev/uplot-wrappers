import Vue from 'vue';
import uPlot from 'uplot';

declare module 'uplot-vue' {
    export default class extends Vue {
        props: {options: uPlot.Options, data: uPlot.AlignedData, target: HTMLElement}
    }
}
