import type { TGeneData } from './lib/types';

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

let geneIndexPromise: Promise<{ data: TGeneData; bySymbolUpper: Map<string, string> }> | null =
	null;

function loadGeneIndex() {
	if (!geneIndexPromise) {
		geneIndexPromise = fetch(chrome.runtime.getURL('hgnc_dataset.json'))
			.then((res) => res.json())
			.then((data: TGeneData) => {
				const bySymbolUpper = new Map<string, string>();
				for (const key of Object.keys(data)) {
					bySymbolUpper.set(key.toUpperCase(), key);
				}
				return { data, bySymbolUpper };
			});
	}
	return geneIndexPromise;
}

chrome.commands.onCommand.addListener(async (command) => {
	if (command !== 'open-side-panel') return;

	const window = await chrome.windows.getCurrent();
	if (window.id !== undefined) {
		chrome.sidePanel.open({ windowId: window.id });
	}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'OPEN_GENE_PANEL') {
		if (sender.tab?.windowId !== undefined) {
			// Must be called synchronously, before any await, to stay within the
			// user gesture forwarded from the content script's dblclick handler.
			chrome.sidePanel.open({ windowId: sender.tab.windowId });
		}

		chrome.storage.session.set({ pendingSymbol: message.symbol });
		return false;
	}

	if (message.type === 'FETCH_GENE') {
		loadGeneIndex()
			.then(({ data, bySymbolUpper }) => {
				const key = bySymbolUpper.get(message.symbol.toUpperCase());
				sendResponse({ gene: key ? data[key] : undefined });
			})
			.catch((err) => sendResponse({ error: err.message }));

		// 👇 IMPORTANT: return true to allow async response
		return true;
	}
});
