import Vue, {VNode, CreateElement} from 'vue';

import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';

import UplotVue from './uplot-vue';

const App = Vue.extend<
    {options: uPlot.Options, data: uPlot.AlignedData, target: HTMLElement},
    {onCreateFromTemplate: (chart: uPlot) => void, onDeleteFromTemplate: (chart: uPlot) => void},
    Record<string, never>, Record<string, never>
>({
    name: 'UplotVueExample',
    components: {uplotvue: UplotVue},
    // @ts-ignore
    data() {
        return {
            options: {
                title: 'Chart', width: 400, height: 300,
                series: [{
                    label: 'Date'
                }, {
                    label: '',
                    points: {show: false},
                    stroke: 'blue',
                    fill: 'blue'
                }],
                scales: {x: {time: false}}
            },
            target: null as unknown as HTMLElement
        };
    },
    beforeMount() {
        // Initialize data inside mounted hook, to prevent Vue from adding watchers, otherwise performance becomes unbearable
        this.data = [new Array(100000).fill(0).map((_, i) => i), new Array(100000).fill(0).map((_, i) => i % 1000)];
    },
    mounted() {
        this.target = this.$refs.root as HTMLElement;
        setInterval(() => {
            const options = {
                ...this.options,
                title: (this.$refs.root as HTMLElement).id ? 'Rendered with template' : 'Rendered with function'
            };
            const data: uPlot.AlignedData = [
                [...this.data[0], this.data[0].length],
                [...this.data[1], this.data[0].length % 1000]
            ];
            this.data = data;
            // Since we disabled reactivity for data above
            this.$forceUpdate();
            this.options = options;
        }, 100);
    },
    methods: {
        onCreateFromTemplate(/* chart: uPlot */) {
            console.log('Created from template');
        },
        onDeleteFromTemplate(/* chart: uPlot */) {
            console.log('Deleted from template');
        }
    },
    // eslint-disable-next-line
    render(h: CreateElement): VNode {
        return (<div ref='root'>
            <UplotVue
                // @ts-ignore
                key="render-key"
                options={this.options}
                data={this.data}
                // Let the uplot-vue wrapper create the DOM node itself
                // target={this.target}
                onDelete={(/* chart: uPlot */) => console.log('Deleted from render function')}
                onCreate={(/* chart: uPlot */) => console.log('Created from render function')}
            />
        </div>);
    }
});

// Render from template
// @ts-ignore
new App({el: '#template-root', render: null});
// Render from render function
new App({el: '#function-root'});
