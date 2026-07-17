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
</style>
