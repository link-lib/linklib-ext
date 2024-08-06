'use client';

import { StarRating } from '@/scripts/highlighter/components/Stars';
import { Star } from 'lucide-react';

export function RatingsBar({ onRate }: { onRate: (rating: number) => void }) {
	return (
		<div className='bb-relative bb-group'>
			<button className='bb-group-hover:text-white bb-group-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'>
				<Star className='bb-w-full bb-h-full' />
			</button>
			<div className='bb-bg-popover bb-absolute bb-left-1/2 bb-transform bb--translate-x-1/2 bb-p-0 bb-hidden bb-group-hover:block bb-rounded-lg bb-'>
				<div className='bb-mt-2 bb-border-popover bb-radius-lg bb-p-2'>
					<StarRating horizontal={false} onRating={onRate} />
				</div>
			</div>
		</div>
	);
}
