document.addEventListener('dblclick', () => {
	const selection = document.getSelection();

	if (!selection || !selection.rangeCount) return;

	const text = selection.toString().trim();
	if (!text) return;

	chrome.runtime.sendMessage(
		{ type: 'FETCH_GENE', symbol: text },
		async (response) => {
			if (!response?.gene) {
				console.error('❌ Failed to load gene:', response?.error);
				return;
			}

			const gene = response.gene;
			const rect = selection.getRangeAt(0).getBoundingClientRect();

			// Load and parse template
			const htmlString = await fetch(
				chrome.runtime.getURL('templates/gene-popup.html')
			).then((res) => res.text());

			const template = document.createElement('template');
			template.innerHTML = htmlString;
			const node = template.content.cloneNode(true) as DocumentFragment;

			const popup = document.createElement('div');
			popup.className = 'gene-lens-popup';
			popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
			popup.style.left = `${rect.left + window.scrollX}px`;

			// Bind data
			// node.querySelector('.gl-symbol')!.textContent = gene.symbol ?? text;
			node.querySelector('.gl-name')!.textContent = gene.name ?? '';
			node.querySelector('.gl-description')!.textContent =
				'Instant lookup from Gene Lens extension. Hover for info.';

			// Add chip links
			const chipContainer = node.querySelector('#gl-chips')!;
			const addChip = (label: string, value: string, url: string) => {
				const a = document.createElement('a');
				a.href = url;
				a.target = '_blank';
				a.rel = 'noopener noreferrer';
				a.className = 'gl-chip';
				a.textContent = value;
				a.title = label;
				chipContainer.appendChild(a);
			};

			if (gene.ensembl_gene_id)
				addChip(
					'Ensembl',
					gene.ensembl_gene_id,
					`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${gene.ensembl_gene_id}`
				);
			if (gene.hgnc_id)
				addChip(
					'HGNC',
					gene.hgnc_id,
					`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${gene.hgnc_id.replace(
						'HGNC:',
						''
					)}`
				);
			if (gene.ucsc_id)
				addChip(
					'UCSC',
					gene.ucsc_id,
					`https://genome.ucsc.edu/cgi-bin/hgTracks?position=${gene.ucsc_id}`
				);

			// Add aliases
			const aliasContainer = node.querySelector('.gl-aliases')!;
			const aliasRaw = gene.alias_symbol;
			const aliases =
				typeof aliasRaw === 'string'
					? [aliasRaw]
					: Array.isArray(aliasRaw)
					? aliasRaw.slice(0, 5)
					: [];
			if (aliases.length) {
				const label = document.createElement('span');
				label.textContent = 'Aliases: ';
				label.style.fontWeight = '600';
				aliasContainer.appendChild(label);

				aliases.forEach((alias) => {
					const a = document.createElement('a');
					a.href = `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${alias}`;
					a.target = '_blank';
					a.textContent = alias;
					a.className = 'gl-alias-link';
					aliasContainer.appendChild(a);
				});
			}

			// Close button
			const closeBtn = node.querySelector('.gl-close') as HTMLButtonElement;
			closeBtn.addEventListener('click', () => popup.remove());

			popup.appendChild(node);
			document.body.appendChild(popup);
		}
	);
});
