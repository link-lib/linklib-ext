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

const frameworks = [
	{
		value: 'next.js',
		label: '🦧 monkey',
	},
	{
		value: 'sveltekit',
		label: '👨‍💻 graphiqal',
	},
	{
		value: 'nuxt.js',
		label: '🎨 art',
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
		<div className='bb-relative bb-group bb-cursor-pointer'>
			<button className='bb-group-hover:text-white bb-group-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'>
				<Plus className='bb-w-full bb-h-full' />
			</button>
			<div className='bb-absolute bb-left-1/2 bb-transform bb--translate-x-1/2 bb-p-0 bb-hidden bb-group-hover:block bb-rounded-lg'>
				<div className='bb-mt-2'>
					<Command>
						<CommandInput
							placeholder='Search framework...'
							className='bb-h-9'
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
