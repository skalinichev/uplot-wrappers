import Vue, {CreateElement, VNode} from 'vue';

import uPlot from 'uplot';
import uPlotVue from 'uplot-wrappers';

const App = Vue.extend<{options: uPlot.Options, data: uPlot.AlignedData, target: HTMLElement}, {}, {}, {}>({
    components: {uplotvue: uPlotVue},
    name: 'uPlotVueTest',
    data() {
        console.log(this);
        return {
            // @ts-ignore
            options: {title: 'Chart', width: 400, height: 300,
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
    methods: {
        onCreateFromTemplate() {
            console.log('Created from template');
        },
        onDeleteFromTemplate() {
            console.log('Deleted from template');
        }
    },
    render(h: CreateElement): VNode {
        // @ts-ignore
        return (<div ref='root'>
            <uPlotVue
                ref='root'
                options={this.options}
                data={this.data}
                target={this.target}
                onDelete={() => console.log('Deleted from render')}
                onCreate={() => console.log('Created from render')}
            />
        </div>) as unknown as VNode;
    },
    mounted() {
        this.target = document.querySelector('#chart')/* this.$refs.root */ as HTMLElement;
        setInterval(() => {
            const series = [...this.options.series];
            const rand = Math.round(Math.random() * 10);
            // series[0] = {label: 'Date ' + rand};
            const options = {
                ...this.options,
                title: (this.$refs.root as any).id ? 'Rendered from template' : 'Rendered from function',
                series/* ,
                width: this.options.width - (15 * rand > 5 ? -1 : 1) */
            };
            const data: uPlot.AlignedData = [...this.data];
            data[1] = [...data[1]];
            data[1][rand % (data[1].length - 1)] = rand * 3;
            this.data = data;
            this.options = options;
        }, 2000);
    }
});

// Render from template
// @ts-ignore
new App({el: '#root', render: null});
// Render from render function
new App({el: '#root'});
