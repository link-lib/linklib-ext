import { StarRating } from '@/components/custom/Stars';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CirclePlus, Trash2, X } from 'lucide-react';
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
			<div className='flex gap-2 justify-between items-center flex-row rounded-md p-2 text-sm'>
				<div>
					<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
						<Trash2 className='w-full h-full' />
					</button>
					<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
						<CirclePlus className='w-full h-full' />
					</button>
					<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
						😂
					</button>
					<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
						🥲
					</button>
				</div>
				<div className='flex flex-row items-center'>
					<StarRating />
					<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
						<X className='w-full h-full' />
					</button>
				</div>
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
