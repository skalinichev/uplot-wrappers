import Vue, {PropType} from 'vue';

import uPlot from 'uplot';

import {optionsUpdateState, dataMatch} from './common';

export default Vue.extend<
    {_chart: uPlot | null}, {_destroy: () => void, _create: () => void}, {}, {options: uPlot.Options, data: uPlot.AlignedData, target: HTMLElement}
>({
    render() {
        return null as any;
    },
    name: 'uPlotVue',
    methods: {
        _destroy() {
            if (this._chart) {
                this.$emit('delete', this._chart);
                this._chart.destroy();
                this._chart = null;
            }
        },
        _create() {
            this._chart = new uPlot(this.$props.options, this.$props.data, this.$props.target);
            this.$emit('create', this._chart);
        }
    },
    props: {
        options: {type: Object as PropType<uPlot.Options>},
        data: {type: Array as unknown as PropType<uPlot.AlignedData>},
        target: {type: HTMLElement}
    },
    mounted() {
        this._create();
    },
    watch: {
        options(prevOptions: uPlot.Options, options: uPlot.Options) {
            const optionsState = optionsUpdateState(prevOptions, options);
            if (!this._chart || optionsState === 'create') {
                this._destroy();
                this._create();
            } else if (optionsState === 'update') {
                this._chart.setSize({width: options.width, height: options.height});
            }
        },
        target() {
            this._destroy();
            this._create();
        },
        data(prevData: uPlot.AlignedData, data: uPlot.AlignedData) {
            if (!this._chart) {
                this._create();
            } else if (!dataMatch(prevData, data)) {
                this._chart.setData(data);
            }
        }
    },
    data(): {_chart: uPlot | null} {
        // eslint-disable-next-line
        return {_chart: null};
    },
    beforeDestroy() {
        this._destroy();
    }
});
