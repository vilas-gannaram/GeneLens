<script lang="ts">
	import type { TGene } from '$lib/types';

	import Header from './header.svelte';
	import BasicInfo from './basic-info.svelte';
	import PrimaryIds from './primary-ids.svelte';
	import Aliases from './aliases.svelte';
	import AdditionalResources from './additional-resources.svelte';
	import GeneGroups from './gene-groups.svelte';

	let {
		gene,
		symbol,
	}: {
		gene: TGene | null;
		symbol: string;
	} = $props();

	function openLocusZoom() {
		if (!gene?.chromosome || gene.start == null || gene.end == null) return;

		const url = chrome.runtime.getURL(
			`locuszoom.html?symbol=${encodeURIComponent(gene.symbol)}&chr=${encodeURIComponent(
				gene.chromosome,
			)}&start=${gene.start}&end=${gene.end}`,
		);

		chrome.windows.create({ url, type: 'popup', width: 960, height: 680 });
	}
</script>

{#if gene}
	<div class="gene-card">
		<Header {gene} />
		<BasicInfo {gene} />
		<Aliases {gene} />
		<GeneGroups {gene} />
		<PrimaryIds {gene} />
		<AdditionalResources {gene} />

		{#if gene.chromosome && gene.start != null && gene.end != null}
			<button type="button" class="locuszoom-button" onclick={openLocusZoom}>
				Open LocusZoom
			</button>
		{/if}
	</div>
{:else}
	<div class="gene-card error">
		<p class="error-title">Gene not found</p>
		<p class="error-text">
			Symbol <strong>{symbol}</strong> is not in our database.
		</p>
	</div>
{/if}

<style>
	.gene-card {
		font-size: 14px;
	}

	.gene-card.error {
		color: var(--destructive);
	}

	.error-title {
		font-weight: 600;
	}

	.error-text {
		margin-top: 4px;
		font-size: 13px;
		color: var(--sidebar-foreground);
	}

	.locuszoom-button {
		margin-top: 4px;
		padding: 6px 12px;
		border: 1px solid var(--sidebar-border);
		border-radius: var(--radius);
		background: var(--sidebar);
		color: var(--sidebar-primary);
		font-size: 13px;
		cursor: pointer;
	}

	.locuszoom-button:hover {
		background: var(--sidebar-accent);
	}
</style>
