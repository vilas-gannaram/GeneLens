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
		border-bottom: 1px solid var(--sidebar-border);
		padding-bottom: 8px;
		margin-bottom: 12px;
	}

	.gene-title {
		font-size: 20px;
		font-weight: 700;
		color: var(--sidebar-foreground);
	}

	.gene-subtitle {
		margin-top: 4px;
		font-size: 13px;
		color: var(--muted-foreground);
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
		background: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
	}

	.status.other {
		background: var(--muted);
		color: var(--muted-foreground);
	}
</style>
