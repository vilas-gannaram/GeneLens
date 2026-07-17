export interface TGene {
	symbol: string;
	hgnc_id: string;
	name: string;
	status: 'Approved' | string;
	locus_group: string;
	locus_type: string;
	location?: string;
	location_sortable?: string;

	// IDs and external references
	ensembl_gene_id?: string;
	entrez_id?: string;
	uuid?: string;
	ucsc_id?: string;
	vega_id?: string;
	omim_id?: string[];
	ccds_id?: string[];
	uniprot_ids?: string[];
	mgd_id?: string[];
	rgd_id?: string[];
	agr?: string;
	gencc?: string;
	orphanet?: number;
	merops?: string;
	lncipedia?: string;
	cosmic?: string;

	// Additional data
	gene_group?: string[];
	gene_group_id?: number[];
	alias_symbol?: string | string[];
	alias_name?: string[];
	prev_symbol?: string[];
	prev_name?: string[];

	// External resources
	refseq_accession?: string[];
	mane_select?: string[];
	pubmed_id?: number[];
	ena?: string[];
	lsdb?: string[];
	rna_central_id?: string[];

	// Ensembl enrichment (genome build GRCh38)
	ensembl_description?: string;
	chromosome?: string;
	start?: number;
	end?: number;
	strand?: number;
	biotype?: string;

	// Specialist family/database cross-references
	iuphar?: string;
	mirbase?: string;
	horde_id?: string;
	imgt?: string;
	homeodb?: number;
	gtrnadb?: string;
	'mamit-trnadb'?: number;
	lncrnadb?: string;
	snornabase?: string;
	enzyme_id?: string[];
	bioparadigms_slc?: string;
	cd?: string;
	'pseudogene.org'?: string;
	curator_notes?: string[];

	// Dates
	date_approved_reserved?: string;
	date_modified?: string;
	date_symbol_changed?: string;
	date_name_changed?: string;
}

// Helper type for the gene data object structure
export type TGeneData = Record<string, TGene>;

// Type guard to check if a value is a Gene
export function isGene(value: unknown): value is TGene {
	return (
		typeof value === 'object' &&
		value !== null &&
		'symbol' in value &&
		'hgnc_id' in value &&
		'name' in value
	);
}

// Type for gene lookup response
export interface TGeneLookupResponse {
	gene?: TGene;
	error?: string;
}
