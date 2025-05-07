import fs from 'fs';

const input = './input/hgnc_complete_set.json';

const hgnc_data_set_raw = JSON.parse(fs.readFileSync(input, 'utf-8'));
const genes_list = hgnc_data_set_raw.response.docs;

const genes_output = {};
const genes_alias_output = {};
const uniqueLocusGroups = new Set();
const uniqueLocusTypes = new Set();

// console.info('genes_list', genes_list[1]);

for (const gene of genes_list) {
	const symbol = gene?.symbol || null;

	if (symbol && symbol.length > 0) {
		// basic gene details
		genes_output[symbol] = gene;

		// getting the unique locus groups
		const locus_group = gene.locus_group || null;
		if (locus_group && !uniqueLocusGroups.has(locus_group)) {
			uniqueLocusGroups.add(locus_group);
		}

		// getting the unique locus types (sub groups)
		const locus_type = gene.locus_type || null;
		if (locus_type && !uniqueLocusTypes.has(locus_type)) {
			uniqueLocusTypes.add(locus_type);
		}

		// alias map
		const alias_symbols = gene?.alias_symbol || [];
		const prev_symbols = gene?.prev_symbol || [];

		[...alias_symbols, ...prev_symbols].forEach((sybl) => {
			if (!genes_alias_output[sybl]) {
				genes_alias_output[sybl] = symbol;
			}
		});
	}
}

// Writing output files:
fs.writeFileSync(
	'./output/genes-list.json',
	JSON.stringify(genes_output, null, 2)
);

fs.writeFileSync(
	'./output/genes-alias-map.json',
	JSON.stringify(genes_alias_output, null, 2)
);

fs.writeFileSync(
	'./output/unique-locus-groups.json',
	JSON.stringify([...uniqueLocusGroups], null, 2)
);

fs.writeFileSync(
	'./output/unique-locus-types.json',
	JSON.stringify([...uniqueLocusTypes], null, 2)
);

console.info('genes length', Object.keys(genes_output).length);
console.info('genes-alias-map length', Object.keys(genes_alias_output).length);

console.info('unique locus groups', uniqueLocusGroups.size);
console.info('unique locus types', uniqueLocusTypes.size);
