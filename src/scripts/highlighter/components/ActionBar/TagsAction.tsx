'use client';

import { CheckIcon } from '@radix-ui/react-icons';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { CommandList } from 'cmdk';
import { Plus } from 'lucide-react';
import { useSWRConfig } from 'swr';
import { Tag } from '@/backend/tags/getTags';

import defaultIcon from '@/assets/icon.png';

export function TagsAction({
	onTagSelect,
}: {
	onTagSelect: (tag: Tag) => void;
}) {
	const { cache } = useSWRConfig();
	const { data: tags = [] } = (cache.get('getTags') || {}) as {
		data?: Tag[];
	};

	return (
		<div className='relative group cursor-pointer'>
			<button className='group-hover:text-white group-hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
				<Plus className='w-full h-full' />
			</button>
			<div className='absolute left-1/2 transform -translate-x-1/2 p-0 hidden group-hover:block rounded-lg'>
				<div className='mt-2'>
					<Command className='w-32'>
						<CommandInput
							placeholder='Search tags...'
							className='h-9 text-xs'
						/>
						<CommandEmpty>No tags found.</CommandEmpty>
						<CommandList>
							<CommandGroup>
								{tags.map((tag) => (
									<CommandItem
										key={tag.id}
										value={tag.name}
										onSelect={() => onTagSelect(tag)}
									>
										<span className='flex items-center text-xs'>
											{tag.icon ? (
												<span className='mr-2'>
													{tag.icon}
												</span>
											) : (
												<img
													src={chrome.runtime.getURL(
														defaultIcon
													)}
													alt='Default tag icon'
													width={16}
													height={16}
													className='mr-2'
												/>
											)}
											<span className='truncate overflow-hidden text-xs text-ellipsis'>
												{tag.name}
											</span>
										</span>
										<CheckIcon
											className={cn(
												'ml-auto h-4 w-4 opacity-0'
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</div>
			</div>
		</div>
	);
}
