const userColors = {
	default: 'bg-yellow-300',
	user1: 'bg-blue-300',
	user2: 'bg-green-300',
	user3: 'bg-purple-300',
	user4: 'bg-pink-300',
	user5: 'bg-orange-300',
};

export const unused = {
	userHighlight1: 'bg-blue-200',
	userHighlight2: 'bg-green-200',
	userHighlight3: 'bg-purple-200',
	userHighlight4: 'bg-pink-200',
	userHighlight5: 'bg-orange-200',
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
