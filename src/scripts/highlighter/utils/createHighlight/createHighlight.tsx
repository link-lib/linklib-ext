import { createRangesByElement } from '@/scripts/highlighter/utils/createHighlight/createRangeByElement';

import {
	createHighlightElementTextArrayBased,
	createHighlightElementTextBased,
} from '@/scripts/highlighter/utils/createHighlight/createRangeFromTextSearch';
import { createRangeUsingWindowFind } from '@/scripts/highlighter/utils/createHighlight/createRangeUsingWindowFind';
import { createHighlightElementTextArrayBasedDeterministic } from '@/scripts/highlighter/utils/createHighlight/createRangeo1';
import { createHighlightElementClaudeBased } from '@/scripts/highlighter/utils/createHighlight/createRangesClaude';
import { createHighlightFromRange } from '@/scripts/highlighter/utils/createHighlight/utils/splitRanges';

export const createElementFallbackOrder = [
	'text-array-based-o1',
	'text-based',
	'text-window-find',
	'range-based',
	'text-array-based',
	'element-range',
	'claude-3.5-restore',
];

export const createHighlight = {
	'text-array-based-o1': createHighlightElementTextArrayBasedDeterministic,
	'text-array-based': createHighlightElementTextArrayBased,
	'text-based': createHighlightElementTextBased,
	'text-window-find': createRangeUsingWindowFind,
	'range-based': createHighlightFromRange,
	'element-range': createRangesByElement,
	'claude-3.5-restore': createHighlightElementClaudeBased,
};

export const createHighlightElement = createHighlight['element-range'];
