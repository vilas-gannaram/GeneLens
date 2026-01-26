import { mount } from 'svelte';
import GeneSymbol from '$lib/components/popover.svelte';

document.addEventListener('dblclick', () => {
	const selection = document.getSelection();
	if (!selection || !selection.rangeCount) return;

	const range = selection.getRangeAt(0);
	const text = selection.toString().trim();
	if (!text) return;

	// Prevent nested overlays
	if (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
		const el = range.commonAncestorContainer as Element;
		if (el.closest('.gene-overlay-host')) return;
	} else if (
		range.commonAncestorContainer.parentElement?.closest('.gene-overlay-host')
	) {
		return;
	}

	// Capture range before async work
	const startContainer = range.startContainer;
	const startOffset = range.startOffset;
	const endContainer = range.endContainer;
	const endOffset = range.endOffset;

	selection.removeAllRanges();

	chrome.runtime.sendMessage(
		{ type: 'FETCH_GENE', symbol: text },
		(response) => {
			if (chrome.runtime.lastError) {
				console.error('❌ Runtime error:', chrome.runtime.lastError);
				return;
			}

			const gene = response?.gene ?? null;

			try {
				// Recreate range
				const newRange = document.createRange();
				newRange.setStart(startContainer, startOffset);
				newRange.setEnd(endContainer, endOffset);

				// Wrapper element (used only for overlay identity)
				const wrapper = document.createElement('span');
				wrapper.className = 'gene-overlay-host';

				// Insert wrapper into DOM
				newRange.deleteContents();
				newRange.insertNode(wrapper);

				// Mount Svelte component directly
				mount(GeneSymbol, {
					target: wrapper,
					props: {
						gene,
						symbol: text,
					},
				});
			} catch (err) {
				console.error('❌ Failed to insert component:', err);
			}
		},
	);
});
