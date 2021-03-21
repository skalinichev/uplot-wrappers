import Vue from 'vue';
import uPlot from 'uplot';

export default class extends Vue {
    props: {options: uPlot.Options, data: uPlot.AlignedData, target: HTMLElement}
}
