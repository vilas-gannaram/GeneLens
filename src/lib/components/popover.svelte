<script lang="ts">
	import type { TGene } from '$lib/types';

	import Header from './header.svelte';
	import BasicInfo from './basic-info.svelte';
	import PrimaryIds from './primary-ids.svelte';
	import Aliases from './aliases.svelte';
	import AdditionalResources from './additional-resources.svelte';
	import GeneGroups from './gene-groups.svelte';

	let {
		gene,
		symbol,
	}: {
		gene: TGene | null;
		symbol: string;
	} = $props();

	let showPopup = $state(false);
	let popoverElement: HTMLDivElement | undefined = $state();
	let triggerElement: HTMLSpanElement | undefined = $state();

	$effect(() => {
		if (showPopup && popoverElement && triggerElement) {
			const rect = triggerElement.getBoundingClientRect();
			const popoverRect = popoverElement.getBoundingClientRect();

			popoverElement.style.left = '50%';
			popoverElement.style.right = 'auto';
			popoverElement.style.transform = 'translateX(-50%)';

			if (rect.left + popoverRect.width / 2 > window.innerWidth) {
				popoverElement.style.left = 'auto';
				popoverElement.style.right = '0';
				popoverElement.style.transform = 'translateX(0)';
			} else if (rect.left - popoverRect.width / 2 < 0) {
				popoverElement.style.left = '0';
				popoverElement.style.right = 'auto';
				popoverElement.style.transform = 'translateX(0)';
			}
		}
	});

	function formatArray(arr: string[] | undefined) {
		if (!arr || arr.length === 0) return '';
		return arr.join(', ');
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	class="gene-lens-root"
	bind:this={triggerElement}
	onmouseenter={() => (showPopup = true)}
	style:text-decoration-color={gene
		? 'oklch(90.5% 0.182 98.111)'
		: 'oklch(57.7% 0.245 27.325)'}
>
	{symbol}

	{#if showPopup && gene}
		<div class="gene-popover" bind:this={popoverElement}>
			<!-- Header -->

			<Header {gene} />
			<BasicInfo {gene} />
			<PrimaryIds {gene} />
			<AdditionalResources {gene} />
			<Aliases {gene} />
			<GeneGroups {gene} />
		</div>
	{/if}

	{#if showPopup && !gene}
		<div class="gene-popover error" bind:this={popoverElement}>
			<p class="error-title">Gene not found</p>
			<p class="error-text">
				Symbol <strong>{symbol}</strong> is not in our database.
			</p>
		</div>
	{/if}
</span>

<style>
	.gene-lens-root {
		position: relative;
		padding-bottom: 2px;
		text-decoration: underline double;
		cursor: help;
	}

	.gene-popover {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: 8px;

		min-width: 300px;
		max-width: 520px;

		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

		padding: 12px 16px;
		color: #111827;
		font-size: 14px;

		z-index: 10000;
	}

	.gene-popover.error {
		background: #fef2f2;
		border-color: #fca5a5;
		color: #7f1d1d;
	}

	.error-title {
		font-weight: 600;
	}

	.error-text {
		margin-top: 4px;
		font-size: 13px;
	}
</style>
