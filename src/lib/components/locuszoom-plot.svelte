<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-expect-error no type declarations available for this package
	import LocusZoom from 'locuszoom';

	const REGION_PADDING = 100_000;
	const GENOME_BUILD = 'GRCh38';
	const API_BASE = 'https://portaldev.sph.umich.edu/api/v1/';
	const CONSTRAINT_URL = 'https://gnomad.broadinstitute.org/api/';

	let {
		symbol,
		chr,
		start,
		end,
	}: {
		symbol: string;
		chr: string;
		start: number;
		end: number;
	} = $props();

	let containerEl: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!containerEl) return;

		const rect = containerEl.getBoundingClientRect();

		const data_sources = new LocusZoom.DataSources()
			.add('gene', [
				'GeneLZ',
				{ url: `${API_BASE}annotation/genes/`, build: GENOME_BUILD },
			])
			.add('constraint', ['GeneConstraintLZ', { url: CONSTRAINT_URL }]);

		// Highlight the searched-for gene against its neighbors: LocusZoom's
		// "match" mechanism flags each row's lz_is_match field by comparing
		// plot.state.lz_match_value against the data layer's `receive` field.
		const genes_panel = LocusZoom.Layouts.get('panel', 'genes');
		const genes_layer = genes_panel.data_layers[0];
		genes_layer.match = { receive: 'gene_name' };
		const match_color = [
			{
				field: 'lz_is_match',
				scale_function: 'if',
				parameters: { field_value: true, then: '#2563eb' },
			},
			{
				field: 'lz_is_match',
				scale_function: 'if',
				parameters: { field_value: false, then: '#9CA3AF' },
			},
			'#363696',
		];
		genes_layer.color = match_color;
		genes_layer.stroke = match_color;

		const layout = {
			state: {
				genome_build: GENOME_BUILD,
				chr,
				start: Math.max(0, start - REGION_PADDING),
				end: end + REGION_PADDING,
				lz_match_value: symbol,
			},
			width: rect.width || 900,
			responsive_resize: true,
			min_region_scale: 20_000,
			max_region_scale: 1_000_000,
			toolbar: LocusZoom.Layouts.get('toolbar', 'standard_plot'),
			panels: [genes_panel],
		};

		LocusZoom.populate(containerEl, data_sources, layout);
	});
</script>

<div class="page">
	<h1 class="title">{symbol} <span class="region">chr{chr}:{start.toLocaleString()}-{end.toLocaleString()}</span></h1>
	<div id="lz-plot" bind:this={containerEl} class="plot-container"></div>
</div>

<style>
	.page {
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		padding: 16px;
	}

	.title {
		font-size: 18px;
		font-weight: 700;
		margin-bottom: 12px;
	}

	.region {
		font-weight: 400;
		font-size: 13px;
		color: #6b7280;
	}

	.plot-container {
		width: 100%;
		min-height: 400px;
	}
</style>
