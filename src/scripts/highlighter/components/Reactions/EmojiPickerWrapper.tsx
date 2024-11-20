import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useMemo, useState } from 'react';
import { groupedEmojis, searchEmojis } from './emoji_helpers';

export const EmojiPickerWrapper = ({
	onEmojiClick,
	trigger,
	searchDisabled = false,
}: {
	onEmojiClick: (emoji: string) => void;
	trigger: React.ReactNode;
	searchDisabled?: boolean;
}) => {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const displayedEmojis = useMemo(() => {
		if (searchTerm) {
			return searchEmojis(searchTerm);
		}
		return null; // null means we should show categorized view
	}, [searchTerm]);

	const handleTriggerClick = (e: React.MouseEvent) => {
		e.preventDefault();
		togglePopover();
	};

	const handleEmojiClick = (emoji: string) => {
		onEmojiClick(emoji);
		togglePopover(false);
	};

	const togglePopover = (state?: boolean) => {
		setOpen(state ?? !open);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild onClick={handleTriggerClick}>
				{trigger}
			</PopoverTrigger>
			<PopoverContent
				align='center'
				side='bottom'
				className='z-infinite+1 emoji-picker rounded-md'
				onClick={(e) => e.stopPropagation()}
				onMouseDown={(e) => e.preventDefault()}
			>
				<style>
					{`
						.emoji-picker input {
							background-color: black !important;
							color: rgb(156 163 175) !important;
						}
						.hide-scrollbar::-webkit-scrollbar {
							display: none;
						}
						.hide-scrollbar {
							-ms-overflow-style: none;  /* IE and Edge */
							scrollbar-width: none;  /* Firefox */
						}
					`}
				</style>
				{!searchDisabled && (
					<input
						type='text'
						placeholder='Search emojis...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='emoji-picker w-full mb-2 px-2 py-1 border rounded focus:outline-none text-sm'
						onMouseDown={(e) => e.stopPropagation()}
					/>
				)}
				<div className='max-h-[300px] overflow-y-auto hide-scrollbar'>
					{displayedEmojis ? (
						// Search results view
						<div className='text-center w-full'>
							{displayedEmojis.map((emojiData) => (
								<button
									key={emojiData.emoji}
									className='text-2xl hover:bg-gray-100 p-1 rounded focus:outline-none w-10 h-10 text-center overflow-hidden'
									onClick={() =>
										handleEmojiClick(emojiData.emoji)
									}
									title={emojiData.name}
								>
									{emojiData.emoji}
								</button>
							))}
						</div>
					) : (
						// Categorized view
						<div>
							{Object.entries(groupedEmojis).map(
								([category, emojis]) => (
									<div key={category}>
										<h3 className='text-sm font-medium !text-gray-500 mb-1'>
											{category}
										</h3>
										{emojis.map((emojiData) => (
											<button
												key={emojiData.emoji}
												className='text-2xl hover:bg-gray-100 p-1 rounded focus:outline-none w-10 h-10 text-center overflow-hidden'
												onClick={() =>
													handleEmojiClick(
														emojiData.emoji
													)
												}
												title={emojiData.name}
											>
												{emojiData.emoji}
											</button>
										))}
									</div>
								)
							)}
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};
