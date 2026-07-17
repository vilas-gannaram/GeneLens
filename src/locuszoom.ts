import { mount } from 'svelte';
import 'locuszoom/dist/locuszoom.css';
import LocusZoomPlot from '$lib/components/locuszoom-plot.svelte';

const target = document.getElementById('app');
const params = new URLSearchParams(location.search);

const symbol = params.get('symbol') ?? '';
const chr = params.get('chr') ?? '';
const start = Number(params.get('start'));
const end = Number(params.get('end'));

if (target && symbol && chr && Number.isFinite(start) && Number.isFinite(end)) {
	mount(LocusZoomPlot, { target, props: { symbol, chr, start, end } });
}
