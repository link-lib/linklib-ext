const userColors = {
	default: 'bg-yellow-200',
	user1: 'bg-blue-200',
	user2: 'bg-green-200',
	user3: 'bg-purple-200',
	user4: 'bg-pink-200',
	user5: 'bg-orange-200',
};

export const unused = {
	userHighlight1: 'bg-blue-100',
	userHighlight2: 'bg-green-100',
	userHighlight3: 'bg-purple-100',
	userHighlight4: 'bg-pink-100',
	userHighlight5: 'bg-orange-100',
};

const hashString = (str: string) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return hash;
};

export const getHighlightColour = (id: string) => {
	const colorKeys = Object.keys(userColors).filter(
		(key) => key !== 'default'
	);
	const colorIndex = Math.abs(hashString(id)) % colorKeys.length;
	return userColors[colorKeys[colorIndex] as keyof typeof userColors];
};
