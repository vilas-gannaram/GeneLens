import fs from 'fs';

const hgnc_data_set_raw = JSON.parse(
	fs.readFileSync('./input/hgnc_raw_full.json', 'utf-8')
);

const genes_list = [];
// const genes_by_symbol = {};
// const uniqueLocusGroups = new Set();

for (const gene of hgnc_data_set_raw.response.docs) {
	const symbol = gene?.symbol || null;

	if (symbol && symbol.length > 0) {
		// basic gene details
		genes_list.push(gene);
		// genes_by_symbol[symbol] = gene;

		// getting the unique locus groups
		// const locus_group = gene.locus_group || null;
		// if (locus_group && !uniqueLocusGroups.has(locus_group)) {
		// 	uniqueLocusGroups.add(locus_group);
		// }
	}
}

// Writing output files:
fs.writeFileSync(
	'./output/hgnc_genes.filtered.json',
	JSON.stringify(genes_list)
);

// fs.writeFileSync(
// 	'./output/hgnc-genes-by-symbol.json',
// 	JSON.stringify(genes_by_symbol)
// );

// fs.writeFileSync(
// 	'./output/unique-locus-groups.json',
// 	JSON.stringify([...uniqueLocusGroups], null, 2)
// );
