chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
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
