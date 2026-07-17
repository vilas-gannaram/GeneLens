<script lang="ts">
	import type { TGene } from '$lib/types';

	let { gene }: { gene: TGene } = $props();
</script>

{#if gene.gene_group?.length}
	<div class="section">
		<h3 class="section-title">Gene Groups</h3>
		<div class="chip-group">
			{#each gene.gene_group as group}
				<span class="chip">{group}</span>
			{/each}
		</div>
	</div>
{/if}

<style>
	.section {
		margin-bottom: 12px;
	}

	.section-title {
		font-size: 13px;
		font-weight: 600;
		color: var(--sidebar-foreground);
		margin-bottom: 6px;
	}

	.chip-group {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.chip {
		padding: 2px 8px;
		font-size: 11px;
		background: var(--sidebar-accent);
		color: var(--sidebar-accent-foreground);
		border-radius: 999px;
	}
</style>
