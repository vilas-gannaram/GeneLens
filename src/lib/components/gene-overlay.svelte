<script lang="ts">
	import type { TGene } from '$lib/types';
	// import

	let {
		gene,
		symbol,
	}: {
		gene: TGene | null;
		symbol: string;
	} = $props();

	let isHovered = $state(false);

	const decorationColor = gene ? 'yellow' : 'red';
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	id="gene-inflow-root"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<span
		class="gene-symbol-trigger"
		style={`text-decoration-color: ${decorationColor};`}
	>
		{symbol}
	</span>

	{#if isHovered && gene}
		<div class="gene-popover">
			<h2 id="gene-symbol">
				{gene.symbol}
			</h2>

			{#if gene.name}
				<h3 id="gene-name">{gene.name}</h3>
			{/if}

			<ul>
				{#if gene.ensembl_gene_id}
					<li>
						<a
							href={`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${gene.ensembl_gene_id}`}
							target="_blank"
							rel="noopener noreferrer">{gene.ensembl_gene_id}</a
						>
					</li>
				{/if}

				{#if gene.hgnc_id}
					<li>
						<a
							href={`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${gene.hgnc_id.replace(
								'HGNC:',
								''
							)}`}
							target="_blank"
							rel="noopener noreferrer">{gene.hgnc_id}</a
						>
					</li>
				{/if}

				{#if gene.ucsc_id}
					<li>
						<a
							href={`https://genome.ucsc.edu/cgi-bin/hgTracks?position=${gene.ucsc_id}`}
							target="_blank"
							rel="noopener noreferrer">{gene.ucsc_id}</a
						>
					</li>
				{/if}
			</ul>
		</div>
	{/if}

	{#if isHovered && !gene}
		<div class="gene-popover gene-not-found" id="gene-overlay-root">
			Gene symbol **{symbol}** not found.
		</div>
	{/if}
</span>

<!-- 
<div
	id="gene-overlay-root"
	style="position:absolute;top: {rect.bottom +
		window.scrollY +
		5}px; left: {rect.left + window.scrollX}px;z-index:100;"
>
	<h2 id="gene-symbol">
		{gene.symbol}
	</h2>

	{#if gene.name}
		<h3 id="gene-name">{gene.name}</h3>
	{/if}

	<ul>
		{#if gene.ensembl_gene_id}
			<li>
				<a
					href={`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${gene.ensembl_gene_id}`}
					>{gene.ensembl_gene_id}</a
				>
			</li>
		{/if}

		{#if gene.hgnc_id}
			<li>
				<a
					href={`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${gene.hgnc_id.replace(
						'HGNC:',
						''
					)}`}>{gene.hgnc_id}</a
				>
			</li>
		{/if}

		{#if gene.ucsc_id}
			<li>
				<a
					href={`https://genome.ucsc.edu/cgi-bin/hgTracks?position=${gene.ucsc_id}`}
					>{gene.ucsc_id}</a
				>
			</li>
		{/if}
	</ul>
</div> -->
