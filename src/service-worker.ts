// chrome.runtime.onInstalled.addListener(async ({ reason }) => {
// 	console.info('chrome ext install listener: reason', reason);

// 	if (reason == 'install') {
// 		await chrome.storage.local.set({ 'gene-lens-enabled': true });
// 	}

// 	// const isGeneLensEnabled = await chrome.storage.local.get('gene-lens-enabled');

// 	// if (isGeneLensEnabled) {
// 	// 	chrome.action.setBadgeText({
// 	// 		text: 'ON',
// 	// 	});

// 	// 	chrome.action.setBadgeBackgroundColor({
// 	// 		color: 'black',
// 	// 	});
// 	// }
// });

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
	if (message.type === 'FETCH_GENE') {
		console.log('📩 Received message in background:', message.symbol);

		fetch(chrome.runtime.getURL('data/genes-list.json'))
			.then((res) => res.json())
			.then((data) => sendResponse({ gene: data[message.symbol] }))
			.catch((err) => sendResponse({ error: err.message }));

		// 👇 IMPORTANT: return true to allow async response
		return true;
	}
});

// chrome.action.onClicked.addListener(async (tab) => {
// 	if (!tab || !tab.id) return;

// 	// Retrieve the action badge to check if the extension is 'ON' or 'OFF'
// 	const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
// 	// Next state will always be the opposite
// 	const nextState = prevState === 'ON' ? 'OFF' : 'ON';

// 	// Set the action badge to the next state
// 	await chrome.action.setBadgeText({
// 		tabId: tab.id,
// 		text: nextState,
// 	});

// 	if (nextState === 'ON') {
// 		// Insert the CSS file when the user turns the extension on
// 		await chrome.scripting.insertCSS({
// 			files: ['style.css'],
// 			target: { tabId: tab.id },
// 		});
// 	} else if (nextState === 'OFF') {
// 		// Remove the CSS file when the user turns the extension off
// 		await chrome.scripting.removeCSS({
// 			files: ['style.css'],
// 			target: { tabId: tab.id },
// 		});
// 	}
// });
