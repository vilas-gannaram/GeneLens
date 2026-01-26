<script lang="ts">
	import type { TGene } from '$lib/types';

	let { gene }: { gene: TGene } = $props();

	function formatArray(arr: string[] | undefined) {
		if (!arr || arr.length === 0) return '';
		return arr.join(', ');
	}
</script>

{#if gene.alias_symbol || gene.prev_symbol}
	<div class="section">
		<h3 class="section-title">Aliases & Previous</h3>

		{#if gene.alias_symbol}
			<div class="row">
				<span class="label">Aliases:</span>
				<span>
					{Array.isArray(gene.alias_symbol)
						? gene.alias_symbol.join(', ')
						: gene.alias_symbol}
				</span>
			</div>
		{/if}

		{#if gene.prev_symbol?.length}
			<div class="row">
				<span class="label">Previous:</span>
				<span>{formatArray(gene.prev_symbol)}</span>
			</div>
		{/if}
	</div>
{/if}

<style>
	.section {
		margin-bottom: 12px;
	}

	.section-title {
		font-size: 13px;
		font-weight: 600;
		color: #374151;
		margin-bottom: 6px;
	}

	.row {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		margin-bottom: 4px;
	}

	.label {
		min-width: 80px;
		font-weight: 500;
		color: #4b5563;
	}
</style>
