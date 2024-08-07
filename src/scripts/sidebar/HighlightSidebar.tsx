import React from 'react';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';

interface SidebarProps {
	highlights: { [key: string]: HighlightData };
}

const Sidebar: React.FC<SidebarProps> = ({ highlights }) => {
	return (
		<div className='linklib-ext-sidebar fixed right-0 top-0 h-full w-64 shadow-lg overflow-y-auto z-50'>
			<h2 className='text-lg font-bold p-4'>Highlights</h2>
			{Object.entries(highlights).map(([uuid, highlight]) => (
				<div key={uuid} className='p-4 border-b'>
					<p className='text-sm font-medium'>
						{highlight.matching.body.substring(0, 50)}...
					</p>
					{highlight.note && (
						<p className='text-xs mt-2 italic'>{highlight.note}</p>
					)}
				</div>
			))}
		</div>
	);
};

export default Sidebar;
