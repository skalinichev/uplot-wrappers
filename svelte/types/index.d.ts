import { SvelteComponent } from "svelte";
import type uPlot from 'uplot';

declare const __propDef: {
    props: {
        options: uPlot.Options;
        data: uPlot.AlignedData;
        target?: HTMLDivElement | null | undefined;
        onDelete?: ((chart: uPlot) => void) | undefined;
        onCreate?: ((chart: uPlot) => void) | undefined;
        resetScales?: boolean | undefined;
        class?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type UplotSvelteProps = typeof __propDef.props;
export type UplotSvelteEvents = typeof __propDef.events;
export type UplotSvelteSlots = typeof __propDef.slots;
export default class UplotSvelte extends SvelteComponent<UplotSvelteProps, UplotSvelteEvents, UplotSvelteSlots> {
}
export {};
