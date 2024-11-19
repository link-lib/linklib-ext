import React from 'react';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';

interface HighlightsSidebarProps {
	highlights: { [key: string]: HighlightData };
}

const HighlightsSidebar: React.FC<HighlightsSidebarProps> = () => {
	// const [isOpen, setIsOpen] = useState(false);

	// const toggleSidebar = () => setIsOpen(!isOpen);

	return <></>;

	// return (
	// 	<div className='w-96 bg-background fixed right-0 top-0 h-full shadow-lg overflow-hidden z-infinite flex flex-col'>
	// 		<div className='flex justify-between items-center p-4 border-b'>
	// 			<h2 className='text-lg font-bold'>Highlights</h2>
	// 			<Button onClick={toggleSidebar} variant='ghost' size='icon'>
	// 				&times; {/* Close icon */}
	// 			</Button>
	// 		</div>
	// 		<div className='overflow-y-auto flex-grow'>
	// 			{Object.entries(highlights).map(([uuid, highlight]) => (
	// 				<div key={uuid} className='p-4 border-b'>
	// 					<p className='text-sm font-medium'>
	// 						{highlight.matching.body.substring(0, 50)}...
	// 					</p>
	// 					{highlight.note && (
	// 						<p className='text-xs mt-2 italic'>
	// 							{highlight.note}
	// 						</p>
	// 					)}
	// 				</div>
	// 			))}
	// 		</div>
	// 	</div>
	// );
};

export default HighlightsSidebar;
