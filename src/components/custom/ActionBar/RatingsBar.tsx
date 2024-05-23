'use client';

import { StarRating } from '@/components/custom/Stars';
import { Star } from 'lucide-react';

export function RatingsBar() {
	return (
		<div className='relative group cursor-pointer'>
			<button className='group-hover:text-white group-hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
				<Star className='w-full h-full' />
			</button>
			<div className='bg-popover absolute left-1/2 transform -translate-x-1/2 p-0 hidden group-hover:block rounded-lg '>
				<div className='mt-2 border-popover radius-lg p-2'>
					<StarRating horizontal={false} />
				</div>
			</div>
		</div>
	);
}
