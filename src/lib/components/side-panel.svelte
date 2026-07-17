<script lang="ts">
	import { onMount } from 'svelte';
	import type { TGene, TGeneLookupResponse } from '$lib/types';

	import GeneCard from './gene-card.svelte';

	let query = $state('');
	let symbol = $state<string | null>(null);
	let gene = $state<TGene | null>(null);
	let loading = $state(false);

	function lookup(sym: string) {
		if (!sym) return;

		loading = true;
		query = sym;

		chrome.runtime.sendMessage(
			{ type: 'FETCH_GENE', symbol: sym },
			(response: TGeneLookupResponse) => {
				loading = false;
				symbol = sym;
				gene = response?.gene ?? null;
			},
		);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		lookup(query.trim());
	}

	onMount(() => {
		chrome.storage.session.get('pendingSymbol').then((result) => {
			const pending = result.pendingSymbol as string | undefined;
			if (pending) {
				lookup(pending);
				chrome.storage.session.remove('pendingSymbol');
			}
		});

		function onChanged(
			changes: Record<string, chrome.storage.StorageChange>,
			area: string,
		) {
			if (area !== 'session' || !changes.pendingSymbol) return;

			const pending = changes.pendingSymbol.newValue as string | undefined;
			if (pending) {
				lookup(pending);
				chrome.storage.session.remove('pendingSymbol');
			}
		}

		chrome.storage.onChanged.addListener(onChanged);
		return () => chrome.storage.onChanged.removeListener(onChanged);
	});
</script>

<div class="panel">
	<h1 class="title">Gene Lens</h1>

	<form onsubmit={handleSubmit}>
		<input
			type="text"
			placeholder="Search a gene symbol..."
			bind:value={query}
		/>
		<button type="submit">Search</button>
	</form>

	{#if loading}
		<p class="hint">Looking up {query}...</p>
	{:else if symbol}
		<GeneCard {gene} {symbol} />
	{:else}
		<p class="hint">
			Type a gene symbol above, or double-click one on the page.
		</p>
	{/if}
</div>

<style>
	.panel {
		padding: 16px;
	}

	.title {
		font-size: 16px;
		font-weight: 700;
		color: var(--sidebar-foreground);
		margin-bottom: 12px;
	}

	form {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
	}

	input {
		flex: 1;
		padding: 6px 10px;
		border: 1px solid var(--input);
		border-radius: var(--radius);
		background: var(--background);
		color: var(--foreground);
		font-size: 14px;
	}

	input:focus-visible {
		outline: 2px solid var(--sidebar-ring);
		outline-offset: 1px;
	}

	button {
		padding: 6px 12px;
		border: none;
		border-radius: var(--radius);
		background: var(--sidebar-primary);
		color: var(--sidebar-primary-foreground);
		font-size: 14px;
		cursor: pointer;
	}

	button:hover {
		opacity: 0.9;
	}

	.hint {
		color: var(--muted-foreground);
		font-size: 13px;
	}
</style>
