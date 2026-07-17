<script lang="ts">
	import type { TGene } from '$lib/types';

	let { gene }: { gene: TGene } = $props();
</script>

{#if gene.locus_type || gene.location}
	<div class="section">
		{#if gene.locus_type}
			<div class="row">
				<span class="label">Type:</span>
				<span>{gene.locus_type}</span>
			</div>
		{/if}

		{#if gene.location}
			<div class="row">
				<span class="label">Location:</span>
				<span>{gene.location}</span>
			</div>
		{/if}
	</div>
{/if}

<style>
	.section {
		margin-bottom: 12px;
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
		color: var(--muted-foreground);
	}
</style>
