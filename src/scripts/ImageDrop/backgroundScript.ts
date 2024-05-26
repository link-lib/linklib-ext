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
		const linkUrl = info.srcUrl;
		// Handle the link URL (e.g., save it to linklib)
		console.log('link URL:', linkUrl);
		console.log('Tab:', tab);
		if (tab?.id) {
            console.log(tab.id);
			chrome.tabs.sendMessage(tab.id, { type: 'saveLink', linkUrl });
		}
	}
});