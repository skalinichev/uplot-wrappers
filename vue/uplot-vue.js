import Vue, { defineComponent, createVNode } from 'vue';

import uPlot from 'uplot';

import { optionsUpdateState, dataMatch } from 'uplot-wrappers-common';

export default (defineComponent ? defineComponent : (v) => v)({
    name: 'UplotVue',
    props: {
        options: { type: Object, required: true },
        data: { type: Array, required: true },
        target: {
            validator(target) {
                return target == null || target instanceof HTMLElement || typeof target === 'function';
            },
            default: undefined,
            required: false,
        },
        resetScales: {
            type: Boolean,
            required: false,
            default: true,
        },
        class: {
            type: String,
            required: false,
        },
    },
    data() {
        // eslint-disable-next-line
        return { _chart: null };
    },
    watch: {
        options(options, prevOptions) {
            const optionsState = optionsUpdateState(prevOptions, options);
            if (!this._chart || optionsState === 'create') {
                this._destroy();
                this._create();
            } else if (optionsState === 'update') {
                this._chart.setSize({ width: options.width, height: options.height });
            }
        },
        target() {
            this._destroy();
            this._create();
        },
        data(data, prevData) {
            if (!this._chart) {
                this._create();
            } else if (!dataMatch(prevData, data)) {
                if (this.$props.resetScales) {
                    this._chart.setData(data);
                } else {
                    this._chart.setData(data, false);
                    this._chart.redraw();
                }
            }
        },
    },
    mounted() {
        this._create();
    },
    beforeUnmount() {
        this._destroy();
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
        },
    },
    render(h) {
        return this.$props.target
            ? null
            : (createVNode ? createVNode : h)('div', {
                  ref: 'targetRef',
                  class: this.$props.class,
              });
    },
});
