<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/1.png">
  <img src="public/2.png" alt="Gene Lens logo" width="96">
</picture>

# Gene Lens

**Look up any human gene symbol without leaving the page you're reading.**

Gene Lens is a Chrome extension for anyone who reads papers, preprints, forum
threads, or GitHub issues where gene symbols show up as bare, unexplained
jargon — `TP53`, `BRCA1`, `EGFR` — with no context unless you stop and go
search for it yourself.

## Why I built this

Reading genomics literature means constantly breaking your flow: you hit a
gene symbol, open a new tab, search HGNC or NCBI or Ensembl, skim the result,
and go back — for every single symbol, sometimes dozens per paper. It's
tedious, and it adds up. Gene Lens collapses that whole loop into a
double-click or a quick search, right where you're already reading.

## What it does

- **Double-click a gene symbol** anywhere on a web page and it looks it up
  instantly.
- **Search manually** from the side panel — useful for PDFs, scanned
  documents, or images where there's no selectable text to double-click.
- Shows the essentials at a glance: full name, approval status, chromosomal
  location, aliases and previous symbols, gene family, and direct links out
  to HGNC, Ensembl, Entrez, UniProt, OMIM, UCSC, and RefSeq for anyone who
  wants to dig deeper.
- Works entirely offline at lookup time — no network request is made when
  you search, so it's fast and doesn't leak what you're reading to anyone.

## How to use it

1. Install the extension (see below).
2. **Double-click** any gene symbol on a web page — the side panel opens
   automatically with the result.
3. Or open the side panel yourself any time via the toolbar icon, or the
   keyboard shortcut (`Ctrl+Shift+G` on Windows/Linux, `Cmd+Shift+G` on Mac —
   configurable in `chrome://extensions/shortcuts`), and type a symbol into
   the search box.
4. If a symbol isn't found, it just means it's not a recognized human gene
   symbol (see below on data coverage) — not a bug.

## About the data

- **Human genes only.** Gene Lens is built on [HGNC](https://www.genenames.org/)
  (the HUGO Gene Nomenclature Committee), the official authority for human
  gene symbols. It does not include mouse, rat, or any other organism's
  genes — a symbol that's only used in another species won't resolve here.
- **Genome build.** Genomic coordinates and biotype are enriched from
  [Ensembl](https://www.ensembl.org/), using the current **GRCh38** human
  genome assembly.
- **Static snapshot, not a live lookup.** The gene database is bundled with
  the extension and regenerated periodically from HGNC and Ensembl — it's
  not a live query against those services, so very recently approved or
  renamed symbols may not be reflected until the next update.

## Installation

1. Grab the latest build from the [Releases page](../../releases) — download
   the `.zip` asset and unzip it.
2. In Chrome, go to `chrome://extensions`, enable **Developer mode** (top
   right), then click **Load unpacked** and select the unzipped folder.
3. Pin the Gene Lens icon to your toolbar for quick access.
