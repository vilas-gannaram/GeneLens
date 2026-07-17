document.addEventListener('dblclick', () => {
	const selection = document.getSelection();
	if (!selection || !selection.rangeCount) return;

	const text = selection.toString().trim();
	if (!text) return;

	chrome.runtime.sendMessage({ type: 'OPEN_GENE_PANEL', symbol: text });
});
