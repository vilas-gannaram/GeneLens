# Alias / previous-symbol lookup

## Problem

Lookup only matches a gene's _current_ official HGNC symbol
(`service-worker.ts`, `bySymbolUpper` index). Papers and pages constantly
use retired or alias names (`MLL`, `IL8`, `HER2`, ...) that exist in the
dataset as `alias_symbol` / `prev_symbol` fields on other genes' records,
but aren't indexed for lookup — so double-clicking one returns "not found"
even though the data to resolve it is already bundled.

## Data shape (checked against `public/hgnc_dataset.json`)

- 57,950 alias/prev-symbol entries total across all genes.
- 791 of those collide with another gene's _current_ official symbol
  (alias for gene A happens to equal gene B's real symbol today).
- 2,100 aliases map to more than one different canonical gene — symbols
  get reused/retired and reassigned over the decades HGNC has been
  running, so alias→gene is not 1:1.

## Proposed design

Still a hashmap — no need for a trie or fuzzy search, this is exact
string matching. But it can't be single-valued like the primary index,
because the data itself isn't 1:1.

1. **Exact primary-symbol match always wins first** (already implemented
   via `bySymbolUpper`). This correctly resolves the 791 collision cases:
   if the typed/selected string is gene B's real symbol today, return
   gene B, not gene A's stale alias for it.
2. **Only on a primary miss**, fall back to a second index built in the
   same pass over the dataset: `Map<string, string[]>` (uppercased
   alias/prev symbol → array of canonical symbols). Multi-valued because
   ~2,100 keys have more than one candidate.
3. Single-candidate fallback hits: just return that gene.

## Open question

What happens when the alias fallback has _more than one_ candidate?
Three options, undecided:

- **Show a disambiguation list** — side panel shows "not an official
  symbol, but could be: X, Y, Z" as clickable options. Needs a small UI
  addition to gene-card/side-panel. Never silently shows the wrong gene.
- **Return the first match, no indication** — simplest, reuses the
  current single-gene view unchanged. Risk: up to 2,100 aliases could
  silently resolve to the wrong gene with no signal it was a guess.
- **Treat ambiguous aliases as not found** — safest against showing wrong
  data, but the fallback then only helps for the ~55,850 (of 57,950)
  aliases that have exactly one candidate.

Need a decision here before implementing the fallback index.
