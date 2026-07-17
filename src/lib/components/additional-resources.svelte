<script lang="ts">
	import type { TGene } from '$lib/types';

	let { gene }: { gene: TGene } = $props();

	function formatArray(arr: string[] | undefined) {
		if (!arr || arr.length === 0) return '';
		return arr.join(', ');
	}
</script>

{#if gene.uniprot_ids || gene.omim_id || gene.refseq_accession}
	<div class="section">
		<h3 class="section-title">Additional Resources</h3>

		<ul class="list">
			{#if gene.uniprot_ids?.length}
				<li class="row">
					<span class="label">UniProt:</span>
					<div class="chip-group">
						{#each gene.uniprot_ids as id}
							<a
								href={`https://www.uniprot.org/uniprotkb/${id}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								{id}
							</a>
						{/each}
					</div>
				</li>
			{/if}

			{#if gene.omim_id?.length}
				<li class="row">
					<span class="label">OMIM:</span>
					<div class="chip-group">
						{#each gene.omim_id as id}
							<a
								href={`https://www.omim.org/entry/${id}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								{id}
							</a>
						{/each}
					</div>
				</li>
			{/if}

			{#if gene.refseq_accession?.length}
				<li class="row">
					<span class="label">RefSeq:</span>
					<span>{formatArray(gene.refseq_accession)}</span>
				</li>
			{/if}
		</ul>
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

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.chip-group {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	a {
		color: var(--sidebar-primary);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
