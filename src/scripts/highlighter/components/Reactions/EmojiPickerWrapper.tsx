import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import EmojiPicker, {
	EmojiClickData,
	SkinTones,
	SuggestionMode,
} from 'emoji-picker-react';

export const EmojiPickerWrapper = ({
	onEmojiClick,
	trigger,
	searchDisabled = false,
}: {
	onEmojiClick: (emoji: string) => void;
	trigger: React.ReactNode;
	searchDisabled?: boolean;
}) => {
	const emojiDataObj: EmojiClickData = {
		activeSkinTone: SkinTones.NEUTRAL,
		unified: '1f600',
		unifiedWithoutSkinTone: '1f600',
		emoji: '😀',
		isCustom: false,
		names: ['grinning face', 'grinning'],
		imageUrl: 'https://example.com/emoji.png',
		getImageUrl: () => 'https://example.com/emoji.png',
	};

	const handleEmojiClick = (emojiData: EmojiClickData) => {
		const wrappedEmojiData = {
			...emojiDataObj,
			emoji: emojiData.emoji,
		};
		onEmojiClick(wrappedEmojiData.emoji);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<PopoverContent
				className='p-0 shadow-none bg-transparent w-[10px] h-auto border-none z-infinite+1 rounded-full'
				onMouseDown={(e) => {
					e.stopPropagation();
				}}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<style>
					{`
					[class*="nav"] {
						display: none !important;
					}
					[class*="icn-search"] {
						display: none !important;
					}
					`}
				</style>
				<EmojiPicker
					className='emoji-picker rounded-sm flex flex-col text-sm gap-y-2 text-black'
					skinTonesDisabled={true}
					suggestedEmojisMode={SuggestionMode.FREQUENT}
					lazyLoadEmojis={true}
					onEmojiClick={handleEmojiClick}
					previewConfig={{ showPreview: false }}
					width={300}
					searchDisabled={searchDisabled}
				/>
			</PopoverContent>
		</Popover>
	);
};
