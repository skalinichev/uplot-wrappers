import Vue, {PropType} from 'vue';

import uPlot from 'uplot';

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
  computed: {},
  props: {
    options: {type: Object as PropType<uPlot.Options>},
    data: {type: Array as unknown as PropType<uPlot.AlignedData>},
    target: {type: HTMLElement}
  },
  mounted() {
    this._create();
  },
  watch: {
    options(oldOptions: uPlot.Options, newOptions: uPlot.Options) {
      const canUpdate = Object.keys(oldOptions).every(k => {
        if (k === 'height' || k === 'width') {
          return true;
        }
        const stringify = (obj: any) =>
          JSON.stringify(obj, (key, value) =>
            typeof value === 'function' ? value.toString() : value
          )

        return stringify(oldOptions[k]) === stringify(newOptions[k]);
      });
      if (canUpdate && this._chart) {
        if (oldOptions.height !== newOptions.height || oldOptions.width !== newOptions.width) {
          this._chart.setSize({width: newOptions.width, height: newOptions.height});
        }
      } else {
        this._destroy();
        this._create();
      }
    },
    target(/*oldTarget: HTMLElement, newTarget: HTMLElement*/) {
      this._destroy();
      this._create();
    },
    data(oldData: uPlot.AlignedData, newData: uPlot.AlignedData) {
      const dataMatch = (lhs: (number | null)[], rhs: (number | null)[]) => {
        if (lhs.length !== rhs.length) {
          return false;
        }
        return lhs.every((value, idx) => value === rhs[idx]);
      }
      if (!this._chart) {
        this._create();
      } else if (oldData.length !== newData.length || !oldData.every((data, idx) => dataMatch(data, newData[idx]))) {
        this._chart.setData(newData);
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
