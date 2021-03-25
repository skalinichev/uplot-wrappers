import Vue, {VNode, CreateElement} from 'vue';

import uPlot from 'uplot';

import UplotVue from './uplot-vue';

const App = Vue.extend<
    {options: uPlot.Options, data: uPlot.AlignedData, target: HTMLElement},
    {onCreateFromTemplate: (chart: uPlot) => void, onDeleteFromTemplate: (chart: uPlot) => void},
    Record<string, never>, Record<string, never>
>({
    name: 'UplotVueExample',
    components: {uplotvue: UplotVue},
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
            data: [[0, 1, 3, 4, 5], [10, 20, 10, 0, 30]],
            target: null as unknown as HTMLElement
        };
    },
    mounted() {
        this.target = document.querySelector('#chart')/* this.$refs.root */ as HTMLElement;
        setInterval(() => {
            const rand = Math.round(Math.random() * 10);
            const options = {
                ...this.options,
                title: (this.$refs.root as HTMLElement).id ? 'Rendered with template' : 'Rendered with function'
            };
            const data: uPlot.AlignedData = [...this.data];
            data[1] = [...data[1]];
            data[1][rand % (data[1].length - 1)] = rand * 3;
            this.data = data;
            this.options = options;
        }, 2000);
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
                target={this.target}
                onDelete={(/* chart: uPlot */) => console.log('Deleted from render function')}
                onCreate={(/* chart: uPlot */) => console.log('Created from render function')}
            />
        </div>);
    }
});

// Render from template
// @ts-ignore
new App({el: '#root', render: null});
// Render from render function
new App({el: '#root'});
