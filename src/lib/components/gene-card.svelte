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
</script>

{#if gene}
	<div class="gene-card">
		<Header {gene} />
		<BasicInfo {gene} />
		<PrimaryIds {gene} />
		<AdditionalResources {gene} />
		<Aliases {gene} />
		<GeneGroups {gene} />
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
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

		padding: 12px 16px;
		color: #111827;
		font-size: 14px;
	}

	.gene-card.error {
		background: #fef2f2;
		border-color: #fca5a5;
		color: #7f1d1d;
	}

	.error-title {
		font-weight: 600;
	}

	.error-text {
		margin-top: 4px;
		font-size: 13px;
	}
</style>
