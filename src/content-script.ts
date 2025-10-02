import { mount } from 'svelte';
import GeneOverlay from '$lib/components/gene-overlay.svelte';
import './global.css';

document.addEventListener('dblclick', () => {
	const selection = document.getSelection();
	if (!selection || !selection.rangeCount) return;

	const range = selection.getRangeAt(0);
	const text = selection.toString().trim();

	if (!text) return;

	// Clear the selection immediately to prevent the original text from staying highlighted
	selection.removeAllRanges();

	chrome.runtime.sendMessage(
		{ type: 'FETCH_GENE', symbol: text },
		async (response) => {
			if (chrome.runtime.lastError) {
				console.error('❌ Runtime error:', chrome.runtime.lastError);
				return;
			}

			const gene = response.gene || null;
			const componentContainer = document.createElement('span');

			range.deleteContents();
			range.insertNode(componentContainer);

			mount(GeneOverlay, {
				target: componentContainer,
				props: { gene, symbol: text },
			});
		}
	);
});
