// Helper function to get the favicon URL
export const getLinkIcon = (): string => {
	// Check for a high-resolution icon first
	const appleTouchIcon = document.querySelector<HTMLLinkElement>(
		'link[rel="apple-touch-icon"]'
	);
	if (appleTouchIcon?.href) return appleTouchIcon.href;

	// Then check for a regular favicon
	const favicon = document.querySelector<HTMLLinkElement>(
		'link[rel="icon"], link[rel="shortcut icon"]'
	);
	if (favicon?.href) return favicon.href;

	// If no specific favicon is found, return the default favicon path
	return `${window.location.origin}/favicon.ico`;
};

// Helper function to get article metadata
export const getArticleMetadata = (): {
	author: string | null;
	publishDate: string | null;
} => {
	let author = null;
	let publishDate = null;

	// Try to find author
	const authorMeta = document.querySelector('meta[name="author"]');
	if (authorMeta) {
		author = authorMeta.getAttribute('content');
	} else {
		// Fallback: look for common author selectors
		const authorElement = document.querySelector('.author, [rel="author"]');
		if (authorElement) author = authorElement.textContent?.trim() || null;
	}

	// Try to find publish date
	const dateMeta = document.querySelector(
		'meta[property="article:published_time"]'
	);
	if (dateMeta) {
		publishDate = dateMeta.getAttribute('content');
	} else {
		// Fallback: look for common date selectors
		const dateElement = document.querySelector(
			'time[datetime], .published, .post-date'
		);
		if (dateElement) {
			publishDate =
				dateElement.getAttribute('datetime') ||
				dateElement.textContent?.trim() ||
				null;
		}
	}

	return { author, publishDate };
};
