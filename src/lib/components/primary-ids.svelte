<script lang="ts">
	import type { TGene } from '$lib/types';

	let { gene }: { gene: TGene } = $props();
</script>

{#if gene.ensembl_gene_id || gene.hgnc_id || gene.entrez_id || gene.ucsc_id}
	<div class="section">
		<h3 class="section-title">Primary IDs</h3>

		<ul class="list">
			{#if gene.hgnc_id}
				<li class="row">
					<span class="label">HGNC:</span>
					<a
						href={`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${gene.hgnc_id.replace(
							'HGNC:',
							'',
						)}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{gene.hgnc_id}
					</a>
				</li>
			{/if}

			{#if gene.ensembl_gene_id}
				<li class="row">
					<span class="label">Ensembl:</span>
					<a
						href={`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${gene.ensembl_gene_id}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{gene.ensembl_gene_id}
					</a>
				</li>
			{/if}

			{#if gene.entrez_id}
				<li class="row">
					<span class="label">Entrez:</span>
					<a
						href={`https://www.ncbi.nlm.nih.gov/gene/${gene.entrez_id}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{gene.entrez_id}
					</a>
				</li>
			{/if}

			{#if gene.ucsc_id}
				<li class="row">
					<span class="label">UCSC:</span>
					<a
						href={`https://genome.ucsc.edu/cgi-bin/hgTracks?position=${gene.ucsc_id}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{gene.ucsc_id}
					</a>
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

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	a {
		color: #2563eb;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
