import Vue, {CreateElement, PropType, VNode} from 'vue';

import uPlot from 'uplot';

import {optionsUpdateState, dataMatch} from 'uplot-wrappers-common';

export default Vue.extend<
    {_chart: uPlot | null},
    {_destroy: () => void, _create: () => void},
    Record<string, never>,
    // eslint-disable-next-line
    {options: uPlot.Options, data: uPlot.AlignedData, target?: HTMLElement | ((self: uPlot, init: Function) => void)}
>({
    name: 'UplotVue',
    props: {
        options: {type: Object as PropType<uPlot.Options>, required: true},
        data: {type: Array as unknown as PropType<uPlot.AlignedData>, required: true},
        target: {
            validator(target) {
                return target == null || target instanceof HTMLElement || typeof target === 'function';
            },
            default: undefined,
            required: false
        }
    },
    data(): {_chart: uPlot | null} {
        // eslint-disable-next-line
        return {_chart: null};
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
    mounted() {
        this._create();
    },
    beforeDestroy() {
        this._destroy();
    },
    methods: {
        _destroy() {
            if (this._chart) {
                this.$emit('delete', this._chart);
                this._chart.destroy();
                this._chart = null;
            }
        },
        _create() {
            this._chart = new uPlot(this.$props.options, this.$props.data, this.$props.target || this.$refs.targetRef);
            this.$emit('create', this._chart);
        }
    },
    // eslint-disable-next-line
    render(h: CreateElement): VNode {
        return this.$props.target ? null as unknown as VNode : <div ref='targetRef'></div>;
    }
});
