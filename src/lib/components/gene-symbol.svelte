<script lang="ts">
	import type { TGene } from '$lib/types';

	let {
		gene,
		symbol,
	}: {
		gene: TGene | null;
		symbol: string;
	} = $props();

	let showPopup = $state(false);
	let popoverElement: HTMLDivElement | undefined = $state();
	let triggerElement: HTMLSpanElement | undefined = $state();

	// Position adjustment to prevent overflow
	$effect(() => {
		if (showPopup && popoverElement && triggerElement) {
			const rect = triggerElement.getBoundingClientRect();
			const popoverRect = popoverElement.getBoundingClientRect();

			// Reset position
			popoverElement.style.left = '50%';
			popoverElement.style.right = 'auto';
			popoverElement.style.transform = 'translateX(-50%)';

			// Check if overflows right edge
			if (rect.left + popoverRect.width / 2 > window.innerWidth) {
				popoverElement.style.left = 'auto';
				popoverElement.style.right = '0';
				popoverElement.style.transform = 'translateX(0)';
			}
			// Check if overflows left edge
			else if (rect.left - popoverRect.width / 2 < 0) {
				popoverElement.style.left = '0';
				popoverElement.style.right = 'auto';
				popoverElement.style.transform = 'translateX(0)';
			}
		}
	});

	function formatArray(arr: string[] | undefined): string {
		if (!arr || arr.length === 0) return '';
		return arr.join(', ');
	}
</script>

<span
	class="gene-lens-root"
	bind:this={triggerElement}
	onmouseenter={() => {
		showPopup = true;
	}}
	onmouseleave={() => {
		showPopup = false;
	}}
	style:text-decoration-color={gene
		? 'oklch(66.6% 0.179 58.318)'
		: 'oklch(50.5% 0.213 27.518)'}
	style="position: relative; padding-bottom: 2px; text-decoration: underline double; cursor: help;"
>
	{symbol}

	{#if showPopup && gene}
		<div
			bind:this={popoverElement}
			style="border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); z-index: 10000;"
			class="px-4 py-3 absolute top-full left-1/2 text-base min-w-75 max-w-125 -translate-x-1/2 mt-2 bg-white border rounded-lg text-neutral-900 not-italic font-normal"
		>
			<!-- Header -->
			<div class="border-b border-gray-200 pb-2 mb-3">
				<h2 class="text-xl font-bold text-gray-900">{gene.symbol}</h2>
				{#if gene.name}
					<p class="mt-1 text-sm text-gray-700">{gene.name}</p>
				{/if}
				{#if gene.status}
					<span
						class="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded {gene.status ===
						'Approved'
							? 'bg-green-100 text-green-800'
							: 'bg-gray-100 text-gray-800'}"
					>
						{gene.status}
					</span>
				{/if}
			</div>

			<!-- Basic Info -->
			<div class="space-y-2 mb-3 text-sm">
				{#if gene.locus_type}
					<div>
						<span class="font-semibold text-gray-600">Type:</span>
						<span class="ml-1">{gene.locus_type}</span>
					</div>
				{/if}
				{#if gene.location}
					<div>
						<span class="font-semibold text-gray-600">Location:</span>
						<span class="ml-1">{gene.location}</span>
					</div>
				{/if}
			</div>

			<!-- Primary IDs -->
			{#if gene.ensembl_gene_id || gene.hgnc_id || gene.entrez_id || gene.ucsc_id}
				<div class="mb-3">
					<h3 class="text-sm font-semibold text-gray-700 mb-1.5">
						Primary IDs
					</h3>
					<ul class="space-y-1 text-sm">
						{#if gene.hgnc_id}
							<li class="flex items-start">
								<span class="font-medium text-gray-600 min-w-[80px]">HGNC:</span
								>

								<a
									class="text-blue-600 hover:underline"
									href={`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${gene.hgnc_id.replace('HGNC:', '')}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									{gene.hgnc_id}
								</a>
							</li>
						{/if}
						{#if gene.ensembl_gene_id}
							<li class="flex items-start">
								<span class="font-medium text-gray-600 min-w-[80px]"
									>Ensembl:</span
								>
								<a
									class="text-blue-600 hover:underline"
									href={`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${gene.ensembl_gene_id}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									{gene.ensembl_gene_id}
								</a>
							</li>
						{/if}
						{#if gene.entrez_id}
							<li class="flex items-start">
								<span class="font-medium text-gray-600 min-w-[80px]"
									>Entrez:</span
								>
								<a
									class="text-blue-600 hover:underline"
									href={`https://www.ncbi.nlm.nih.gov/gene/${gene.entrez_id}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									{gene.entrez_id}
								</a>
							</li>
						{/if}
						{#if gene.ucsc_id}
							<li class="flex items-start">
								<span class="font-medium text-gray-600 min-w-[80px]">UCSC:</span
								>
								<a
									class="text-blue-600 hover:underline"
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

			<!-- Additional IDs -->
			{#if gene.uniprot_ids || gene.omim_id || gene.refseq_accession}
				<div class="mb-3">
					<h3 class="text-sm font-semibold text-gray-700 mb-1.5">
						Additional Resources
					</h3>
					<ul class="space-y-1 text-sm">
						{#if gene.uniprot_ids && gene.uniprot_ids.length > 0}
							<li class="flex items-start">
								<span class="font-medium text-gray-600 min-w-[80px]"
									>UniProt:</span
								>
								<div class="flex flex-wrap gap-1">
									{#each gene.uniprot_ids as uniprot}
										<a
											class="text-blue-600 hover:underline"
											href={`https://www.uniprot.org/uniprotkb/${uniprot}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											{uniprot}
										</a>
									{/each}
								</div>
							</li>
						{/if}
						{#if gene.omim_id && gene.omim_id.length > 0}
							<li class="flex items-start">
								<span class="font-medium text-gray-600 min-w-[80px]">OMIM:</span
								>
								<div class="flex flex-wrap gap-1">
									{#each gene.omim_id as omim}
										<a
											class="text-blue-600 hover:underline"
											href={`https://www.omim.org/entry/${omim}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											{omim}
										</a>
									{/each}
								</div>
							</li>
						{/if}
						{#if gene.refseq_accession && gene.refseq_accession.length > 0}
							<li class="flex items-start">
								<span class="font-medium text-gray-600 min-w-[80px]"
									>RefSeq:</span
								>
								<span class="text-gray-800"
									>{formatArray(gene.refseq_accession)}</span
								>
							</li>
						{/if}
					</ul>
				</div>
			{/if}

			<!-- Aliases -->
			{#if gene.alias_symbol || gene.prev_symbol}
				<div class="mb-3">
					<h3 class="text-sm font-semibold text-gray-700 mb-1.5">
						Aliases & Previous
					</h3>
					<div class="space-y-1 text-sm">
						{#if gene.alias_symbol}
							<div>
								<span class="font-medium text-gray-600">Aliases:</span>
								<span class="ml-1 text-gray-800">
									{Array.isArray(gene.alias_symbol)
										? gene.alias_symbol.join(', ')
										: gene.alias_symbol}
								</span>
							</div>
						{/if}
						{#if gene.prev_symbol && gene.prev_symbol.length > 0}
							<div>
								<span class="font-medium text-gray-600">Previous:</span>
								<span class="ml-1 text-gray-800"
									>{formatArray(gene.prev_symbol)}</span
								>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Gene Groups -->
			{#if gene.gene_group && gene.gene_group.length > 0}
				<div>
					<h3 class="text-sm font-semibold text-gray-700 mb-1.5">
						Gene Groups
					</h3>
					<div class="flex flex-wrap gap-1">
						{#each gene.gene_group as group}
							<span
								class="inline-block px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
							>
								{group}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	{#if showPopup && !gene}
		<div
			bind:this={popoverElement}
			style="border: 1px solid #fca5a5; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); z-index: 10000;"
			class="px-4 py-3 absolute top-full left-1/2 text-base min-w-[250px] -translate-x-1/2 mt-2 bg-red-50 border rounded-lg text-red-800 not-italic"
		>
			<p class="font-semibold">Gene not found</p>
			<p class="text-sm mt-1">
				Symbol <strong>{symbol}</strong> is not in our database.
			</p>
		</div>
	{/if}
</span>
