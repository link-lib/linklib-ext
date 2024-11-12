import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { ReactNode } from 'react';

interface EmojiPickerProps {
	onEmojiSelect: (emoji: string) => Promise<void>;
	trigger: ReactNode;
	side?: 'top' | 'bottom' | 'left' | 'right';
	align?: 'start' | 'center' | 'end';
}

export const EmojiPicker = ({
	onEmojiSelect,
	trigger,
	side = 'bottom',
	align = 'start',
}: EmojiPickerProps) => {
	return (
		<Popover>
			<PopoverTrigger>{trigger}</PopoverTrigger>
			<PopoverContent
				className='mt-2 p-0 border-none shadow-lg w-fit h-fit'
				side={side}
				align={align}
				sideOffset={5}
			>
				<Picker
					data={data}
					onEmojiSelect={(emoji: any) => {
						onEmojiSelect(emoji.native);
					}}
					theme='dark'
					previewPosition='none'
					skinTonePosition='none'
					searchPosition='none'
					navPosition='none'
					perLine={6}
					maxFrequentRows={1}
				/>
			</PopoverContent>
		</Popover>
	);
};
