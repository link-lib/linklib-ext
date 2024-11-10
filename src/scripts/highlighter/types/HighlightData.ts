import { Note, Reaction } from '@/utils/supabase/typeAliases';

export type SiteMetadata = {
	url: string;
	title?: string;
	favicon?: string;
	author?: string;
	publishDate?: string;
};

export type HighlightData = {
	// Population Info
	uuid: string;
	matching: {
		body: string;
		rangeSelector: {
			startOffset: number;
			endOffset: number;
			// container fields should look like this, where the number is the number of containers above the highlight
			// Search from the body
			// "/div[1]/div[1]/div[2]/div[2]/div[2]/div[1]/article[1]/div[4]/div[1]/div[1]/p[4]/span[3]"
			startContainer: string;
			endContainer: string;
		};
		surroundingText: {
			prefix: string;
			suffix: string;
		};
		textPosition: {
			start: number;
			end: number;
		};
	};
	siteMetadata: SiteMetadata;
	// Custom
	rating: number;
	color: highlightColours;
	notes: Note[];
	reactions: Reaction[];

	// Search
	highlightWords: string[];
	pageTitleWords: string[];

	// Metadata
	createdAt: Date;
	updatedAt: Date;
};

export enum highlightColours {
	RED = 'red',
	ORANGE = 'orange',
	YELLOW = 'yellow',
	GREEN = 'green',
	BLUE = 'blue',
	PURPLE = 'purple',
}
