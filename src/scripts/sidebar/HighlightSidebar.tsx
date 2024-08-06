import React from 'react';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';

interface SidebarProps {
	highlights: { [key: string]: HighlightData };
}

const Sidebar: React.FC<SidebarProps> = ({ highlights }) => {
	return (
		<div className='bb-linklib-ext-sidebar bb-fixed bb-right-0 bb-top-0 bb-h-full bb-w-64 bb-bg-white bb-shadow-lg bb-overflow-y-auto bb-z-50'>
			<h2 className='bb-text-lg bb-font-bold bb-p-4'>Highlights</h2>
			{Object.entries(highlights).map(([uuid, highlight]) => (
				<div key={uuid} className='bb-p-4 bb-border-b'>
					<p className='bb-text-sm bb-font-medium'>
						{highlight.matching.body.substring(0, 50)}...
					</p>
					{highlight.note && (
						<p className='bb-text-xs bb-mt-2 bb-italic'>
							{highlight.note}
						</p>
					)}
				</div>
			))}
		</div>
	);
};

export default Sidebar;
