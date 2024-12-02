chrome.contextMenus.create({
	id: 'ImageLinklib',
	title: 'Save Image to linklib',
	contexts: ['image'],
});

chrome.contextMenus.create({
	id: 'VideoLinklib',
	title: 'Save Video to linklib',
	contexts: ['video'],
});

chrome.contextMenus.create({
	id: 'link-Linklib',
	title: 'Save Link to linklib',
	contexts: ['link'],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === 'ImageLinklib') {
		const imageUrl = info.srcUrl;
		// TODO (backend) save image URL from context menu
		// Handle the image URL (e.g., save it to linklib)
		console.log('Image URL:', imageUrl);
		console.log('Tab:', tab);
		if (tab?.id) {
			console.log(tab.id);
			chrome.tabs.sendMessage(tab.id, { type: 'saveImage', imageUrl });
		}
	}
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === 'VideoLinklib') {
		const videoUrl = info.srcUrl;
		// TODO (backend) save video URL from context menu
		// Handle the video URL (e.g., save it to linklib)
		console.log('video URL:', videoUrl);
		console.log('Tab:', tab);
		if (tab?.id) {
			console.log(tab.id);
			chrome.tabs.sendMessage(tab.id, { type: 'saveVideo', videoUrl });
		}
	}
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === 'link-Linklib') {
		const linkUrl = info.linkUrl;
		console.log('link URL:', linkUrl);
		console.log('Tab:', tab);
		if (tab?.id) {
			console.log(tab.id);
			chrome.tabs.sendMessage(tab.id, { type: 'saveLink', linkUrl });
		}
	}
});

chrome.commands.onCommand.addListener((command) => {
	if (command === 'toggle-icon-position') {
		chrome.tabs.query(
			{ active: true, currentWindow: true },
			function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id!, {
					action: 'toggleIconPosition',
				});
			}
		);
	}
});

// Function to update badge
function updateBadge(count: number) {
	if (count > 0) {
		chrome.action.setBadgeText({
			text: count.toString(),
		});
		chrome.action.setBadgeBackgroundColor({
			color: '#EF4444',
		});
	} else {
		chrome.action.setBadgeText({ text: '' });
	}
}

// Listen for badge update messages from content scripts
chrome.runtime.onMessage.addListener((message) => {
	if (message.type === 'UPDATE_BADGE') {
		updateBadge(message.count);
	}
});
