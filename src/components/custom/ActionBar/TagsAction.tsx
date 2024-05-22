'use client';

import { CheckIcon } from '@radix-ui/react-icons';
import * as React from 'react';

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

const frameworks = [
	{
		value: 'next.js',
		label: 'Next.js',
	},
	{
		value: 'sveltekit',
		label: 'SvelteKit',
	},
	{
		value: 'nuxt.js',
		label: 'Nuxt.js',
	},
	{
		value: 'remix',
		label: 'Remix',
	},
	{
		value: 'astro',
		label: 'Astro',
	},
];

export function TagsAction() {
	return (
		<div className='relative group'>
			<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
				<Plus className='w-full h-full' />
			</button>
			<div className='absolute top-0 left-1/2 transform -translate-x-1/2 pt-2 p-0 hidden group-hover:block rounded-lg'>
				<div className='mt-2'>
					<Command>
						<CommandInput
							placeholder='Search framework...'
							className='h-9'
						/>
						<CommandEmpty>No framework found.</CommandEmpty>
						<CommandList>
							<CommandGroup>
								{frameworks.map((framework) => (
									<CommandItem
										key={framework.value}
										value={framework.value}
										onSelect={() => {}}
									>
										{framework.label}
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
