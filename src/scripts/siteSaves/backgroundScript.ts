chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
