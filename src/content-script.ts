function isEditableTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return true;
	return target.isContentEditable;
}

document.addEventListener('dblclick', (event) => {
	if (isEditableTarget(event.target)) return;

	const selection = document.getSelection();
	if (!selection || !selection.rangeCount) return;

	const text = selection.toString().trim();
	if (!text) return;

	chrome.runtime.sendMessage({ type: 'OPEN_GENE_PANEL', symbol: text });
});
