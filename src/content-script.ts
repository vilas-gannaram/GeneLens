import { mount } from 'svelte';
import GeneSymbol from '$lib/components/gene-symbol.svelte';
import appStyles from './app.css?inline';

document.addEventListener('dblclick', () => {
	const selection = document.getSelection();
	if (!selection || !selection.rangeCount) return;

	const range = selection.getRangeAt(0);
	const text = selection.toString().trim();
	if (!text) return;

	// Prevent nested overlays
	if (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
		const element = range.commonAncestorContainer as Element;
		if (element.closest('.gene-overlay-host')) return;
	} else if (
		range.commonAncestorContainer.parentElement?.closest('.gene-overlay-host')
	) {
		return;
	}

	// Store range information before async operation
	const startContainer = range.startContainer;
	const startOffset = range.startOffset;
	const endContainer = range.endContainer;
	const endOffset = range.endOffset;

	selection.removeAllRanges();

	chrome.runtime.sendMessage(
		{ type: 'FETCH_GENE', symbol: text },
		async (response) => {
			if (chrome.runtime.lastError) {
				console.error('❌ Runtime error:', chrome.runtime.lastError);
				return;
			}

			const gene = response.gene || null;

			try {
				// Recreate the range
				const newRange = document.createRange();
				newRange.setStart(startContainer, startOffset);
				newRange.setEnd(endContainer, endOffset);

				// Create wrapper with shadow DOM
				const wrapper = document.createElement('span');
				wrapper.className = 'gene-overlay-host'; // For preventing nested overlays
				const shadow = wrapper.attachShadow({ mode: 'open' });

				// Inject styles into shadow DOM
				const style = document.createElement('style');
				style.textContent = appStyles;
				shadow.appendChild(style);

				// Create container for Svelte component
				const componentContainer = document.createElement('span');
				shadow.appendChild(componentContainer);

				// Insert wrapper into DOM first
				newRange.deleteContents();
				newRange.insertNode(wrapper);

				// Mount Svelte component with context set to shadow root
				mount(GeneSymbol, {
					target: componentContainer,
					props: { gene, symbol: text },
				});
			} catch (err) {
				console.error('Failed to insert component:', err);
			}
		},
	);
});
