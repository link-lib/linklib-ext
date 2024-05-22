import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paintbrush, NotebookPen, Heart, X } from 'lucide-react';
import { useState } from 'react';

const NotesModal = ({
	note,
	setNote,
	onClose,
}: {
	note: string;
	setNote: (note: string) => void;
	onClose: () => void;
}) => {
	const [inputValue, setInputValue] = useState(note);

	const handleSave = () => {
		setNote(inputValue);
		onClose();
	};

	return (
		<div>
			<div className='gap-2 w-fit justify-center items-center flex-row rounded-md p-2 text-sm'>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					<Paintbrush className='w-full h-full' />
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					<NotebookPen className='w-full h-full' />
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					<Heart className='w-full h-full' />
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					😂
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					🥲
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					<X className='w-full h-full' />
				</button>
			</div>
			<Textarea
				placeholder='Write your note'
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
			/>
			<div className='flex flex-row justify-end mt-2 space-x-1 text-sm'>
				<Button onClick={handleSave}>Cancel</Button>
				<Button
					className='bg-green-500 text-white'
					onClick={handleSave}
				>
					Save
				</Button>
			</div>
		</div>
	);
};

export default NotesModal;
