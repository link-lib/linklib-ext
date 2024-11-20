interface EmojiData {
	code: string[];
	emoji: string;
	name: string;
	category: string;
	subcategory: string;
}

// Import JSON file
import emojiDataRaw from './emoji_list.json';

// Filter out compound emojis
export const emojiList: EmojiData[] = emojiDataRaw.emojis
	.filter((emoji) => emoji.code.length === 1) // Only keep emojis with a single code
	.map((emoji) => ({
		...emoji,
		emoji: emoji.emoji.trim(),
	}));

// Group emojis by category
export const groupedEmojis = emojiList.reduce((acc, emoji) => {
	if (!acc[emoji.category]) {
		acc[emoji.category] = [];
	}
	acc[emoji.category].push(emoji);
	return acc;
}, {} as Record<string, EmojiData[]>);

export const searchEmojis = (searchTerm: string): EmojiData[] => {
	const term = searchTerm.toLowerCase();
	return emojiList.filter(
		(emoji) =>
			emoji.name.toLowerCase().includes(term) ||
			emoji.category.toLowerCase().includes(term) ||
			emoji.subcategory.toLowerCase().includes(term)
	);
};
