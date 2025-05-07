import fs from 'fs';
import { setTimeout as sleep } from 'timers/promises';

const fetch = global.fetch;

// 1. Load the HGNC genes list
const hgnc_genes = JSON.parse(
	fs.readFileSync('./output/hgnc_genes.filtered.json', 'utf-8')
);

// 2. Extract unique Ensembl Gene IDs
const ensemblIdMap = {};
const ensemblIds = [];

for (const gene of hgnc_genes) {
	const id = gene.ensembl_gene_id;
	if (id && !ensemblIdMap[id]) {
		ensemblIdMap[id] = gene;
		ensemblIds.push(id);
	}
}

const BATCH_SIZE = 1000;
const enrichments = {};

async function fetchBatch(ids) {
	try {
		const res = await fetch('https://rest.ensembl.org/lookup/id', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({ ids }),
		});

		if (!res.ok) {
			console.error(`❌ Batch failed with ${res.status}`);
			return {};
		}

		return await res.json();
	} catch (err) {
		console.error(`❌ Network error:`, err);
		return {};
	}
}

async function enrichGenes() {
	for (let i = 0; i < ensemblIds.length; i += BATCH_SIZE) {
		const batch = ensemblIds.slice(i, i + BATCH_SIZE);
		console.log(
			`🔎 Fetching batch ${i / BATCH_SIZE + 1} (${batch.length} genes)...`
		);
		const batchData = await fetchBatch(batch);

		for (const [id, info] of Object.entries(batchData)) {
			enrichments[id] = {
				ensembl_description: info?.description || null,
				chromosome: info?.seq_region_name || null,
				start: info?.start || null,
				end: info?.end || null,
				strand: info?.strand || null,
				biotype: info?.biotype || null,
			};
		}

		// Slight delay to respect API usage
		await sleep(250); // 250ms delay between batches
	}

	// Merge enrichments
	const enriched_genes = hgnc_genes.map((gene) => {
		const id = gene.ensembl_gene_id;
		return id && enrichments[id] ? { ...gene, ...enrichments[id] } : gene;
	});

	// Write enriched output
	fs.writeFileSync(
		'./output/hgnc_genes.enriched.json',
		JSON.stringify(enriched_genes)
	);
}

// Run
enrichGenes();
