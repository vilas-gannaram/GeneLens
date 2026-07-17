chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

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
		console.log('📩 Received message in background:', message.symbol);

		fetch(chrome.runtime.getURL('genes-list.json'))
			.then((res) => res.json())
			.then((data) => sendResponse({ gene: data[message.symbol] }))
			.catch((err) => sendResponse({ error: err.message }));

		// 👇 IMPORTANT: return true to allow async response
		return true;
	}
});
