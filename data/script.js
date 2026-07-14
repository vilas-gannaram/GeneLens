import fs from 'fs';
import { setTimeout as sleep } from 'timers/promises';

const HGNC_INPUT = './raw/hgnc.json';
const OUTPUT = './final/hgnc_dataset.json';

const ENSEMBL_LOOKUP_URL = 'https://rest.ensembl.org/lookup/id';
const BATCH_SIZE = 1000;
const BATCH_DELAY_MS = 250;

function loadHgncDataset() {
	return JSON.parse(fs.readFileSync(HGNC_INPUT, 'utf-8'));
}

function filterGenes(rawDataset) {
	return rawDataset.response.docs.filter((gene) => Boolean(gene.symbol));
}

function getUniqueEnsemblIds(genes) {
	return [
		...new Set(genes.map((gene) => gene.ensembl_gene_id).filter(Boolean)),
	];
}

async function fetchBatch(ids) {
	try {
		const response = await fetch(ENSEMBL_LOOKUP_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({ ids }),
		});

		if (!response.ok) {
			console.error(`Batch failed: ${response.status}`);
			return {};
		}

		return await response.json();
	} catch (error) {
		console.error('Network error:', error);
		return {};
	}
}

async function fetchEnrichments(ensemblIds) {
	const enrichmentMap = {};

	for (let i = 0; i < ensemblIds.length; i += BATCH_SIZE) {
		const batch = ensemblIds.slice(i, i + BATCH_SIZE);

		console.log(
			`Fetching batch ${i / BATCH_SIZE + 1} (${batch.length} genes)...`,
		);

		const batchData = await fetchBatch(batch);

		for (const [id, info] of Object.entries(batchData)) {
			enrichmentMap[id] = {
				ensembl_description: info?.description ?? null,
				chromosome: info?.seq_region_name ?? null,
				start: info?.start ?? null,
				end: info?.end ?? null,
				strand: info?.strand ?? null,
				biotype: info?.biotype ?? null,
			};
		}

		await sleep(BATCH_DELAY_MS);
	}

	return enrichmentMap;
}

function mergeEnrichments(genes, enrichmentMap) {
	return genes.map((gene) => {
		const enrichment = enrichmentMap[gene.ensembl_gene_id];

		return enrichment
			? {
					...gene,
					...enrichment,
				}
			: gene;
	});
}

function writeOutput(genes) {
	fs.writeFileSync(OUTPUT, JSON.stringify(genes));
	console.log(`✓ Wrote ${genes.length} genes to ${OUTPUT}`);
}

async function main() {
	const rawDataset = loadHgncDataset();

	const genes = filterGenes(rawDataset);

	console.log(`Loaded ${genes.length} HGNC genes.`);

	const ensemblIds = getUniqueEnsemblIds(genes);

	console.log(`Found ${ensemblIds.length} unique Ensembl IDs.`);

	const enrichmentMap = await fetchEnrichments(ensemblIds);

	const enrichedGenes = mergeEnrichments(genes, enrichmentMap);

	const genes_by_symbol = {};
	// const uniqueLocusGroups = new Set();

	for (const gene of enrichedGenes) {
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

	writeOutput(genes_by_symbol);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
