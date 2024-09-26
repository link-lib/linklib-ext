import { saveLink } from '@/backend/saveLink';

chrome.runtime.onMessage.addListener((message) => {
	if (message.action === 'saveTweet') {
		fetch('https://your-backend.com/api/save', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ link: message.link }),
		})
			.then((response) => response.json())
			.then((data) => console.log('Success:', data))
			.catch((error) => console.error('Error:', error));
	}
});

// For "save page" from extension popup
chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
	if (message.action === 'saveLinkPopup') {
		chrome.tabs.query({ active: true }, function (tabs) {
			console.log(tabs[0]);
			const currTab = tabs[0];
			// TODO: can't access the author and publish date for now because we don't have access to the document
			saveLink({
				url: currTab.url,
				favicon: currTab.favIconUrl,
				title: currTab.title,
				author: undefined,
				publishDate: undefined,
				savedDate: new Date().toISOString(),
			}).then(sendResponse);
		});
	}
});
