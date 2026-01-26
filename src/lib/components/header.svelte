<script lang="ts">
	import type { TGene } from '$lib/types';

	let { gene }: { gene: TGene } = $props();
</script>

<div class="gene-header">
	<h2 class="gene-title">{gene.symbol}</h2>

	{#if gene.name}
		<p class="gene-subtitle">{gene.name}</p>
	{/if}

	{#if gene.status}
		<span class="status {gene.status === 'Approved' ? 'approved' : 'other'}">
			{gene.status}
		</span>
	{/if}
</div>

<style>
	.gene-header {
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 8px;
		margin-bottom: 12px;
	}

	.gene-title {
		font-size: 20px;
		font-weight: 700;
		color: #111827;
	}

	.gene-subtitle {
		margin-top: 4px;
		font-size: 13px;
		color: #374151;
	}

	.status {
		display: inline-block;
		margin-top: 4px;
		padding: 2px 8px;
		font-size: 11px;
		font-weight: 500;
		border-radius: 999px;
	}

	.status.approved {
		background: #dcfce7;
		color: #166534;
	}

	.status.other {
		background: #f3f4f6;
		color: #374151;
	}
</style>
