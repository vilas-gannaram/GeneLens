// @ts-check

import fs from 'fs';

const hgnc_genes_list = JSON.parse(
	fs.readFileSync('./output/hgnc_genes.enriched.json', 'utf-8')
);

const genes_by_symbol = {};
// const uniqueLocusGroups = new Set();

for (const gene of hgnc_genes_list) {
	const { symbol, ...rest } = gene;

	if (symbol) {
		genes_by_symbol[symbol] = gene;
	}
	// getting the unique locus groups
	// const locus_group = gene.locus_group || null;
	// if (locus_group && !uniqueLocusGroups.has(locus_group)) {
	// 	uniqueLocusGroups.add(locus_group);
	// }
}

// Writing output files:
fs.writeFileSync(
	'./output/final/genes-by-symbol.json',
	JSON.stringify(genes_by_symbol)
);
