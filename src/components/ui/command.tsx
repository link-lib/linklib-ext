import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Command = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive
		ref={ref}
		className={cn(
			'bb-flex bb-h-full bb-w-full bb-flex-col bb-overflow-hidden bb-rounded-md bb-bg-popover bb-text-popover-foreground',
			className
		)}
		{...props}
	/>
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
	return (
		<Dialog {...props}>
			<DialogContent className='bb-overflow-hidden bb-p-0'>
				<Command className='[&_[cmdk-group-heading]]:bb-px-2 [&_[cmdk-group-heading]]:bb-font-medium [&_[cmdk-group-heading]]:bb-text-muted-foreground [&_[cmdk-group]:bb-not([hidden])_~[cmdk-group]]:bb-pt-0 [&_[cmdk-group]]:bb-px-2 [&_[cmdk-input-wrapper]_svg]:bb-h-5 [&_[cmdk-input-wrapper]_svg]:bb-w-5 [&_[cmdk-input]]:bb-h-12 [&_[cmdk-item]]:bb-px-2 [&_[cmdk-item]]:bb-py-3 [&_[cmdk-item]_svg]:bb-h-5 [&_[cmdk-item]_svg]:bb-w-5'>
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
};

const CommandInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<div
		className='bb-flex bb-items-center bb-border-b bb-px-3'
		cmdk-input-wrapper=''
	>
		<MagnifyingGlassIcon className='bb-mr-2 bb-h-4 bb-w-4 bb-shrink-0 bb-opacity-50' />
		<CommandPrimitive.Input
			ref={ref}
			className={cn(
				'bb-flex bb-h-10 bb-w-full bb-rounded-md bb-bg-transparent bb-py-3 bb-text-sm bb-outline-none placeholder:bb-text-muted-foreground disabled:bb-cursor-not-allowed disabled:bb-opacity-50',
				className
			)}
			{...props}
		/>
	</div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		ref={ref}
		className={cn(
			'bb-max-h-[bb-300px] overflow-y-auto bb-overflow-x-hidden',
			className
		)}
		{...props}
	/>
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
	<CommandPrimitive.Empty
		ref={ref}
		className='bb-py-6 bb-text-center bb-text-sm'
		{...props}
	/>
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(
			'bb-overflow-hidden bb-p-1 bb-text-foreground [&_[cmdk-group-heading]]:bb-px-2 [&_[cmdk-group-heading]]:bb-py-1.5 [&_[cmdk-group-heading]]:bb-text-xs [&_[cmdk-group-heading]]:bb-font-medium [&_[cmdk-group-heading]]:bb-text-muted-foreground',
			className
		)}
		{...props}
	/>
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator
		ref={ref}
		className={cn('bb--mx-1 bb-h-px bb-bg-border', className)}
		{...props}
	/>
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			'bb-relative bb-flex bb-cursor-default bb-select-none bb-items-center bb-rounded-sm bb-px-2 bb-py-1.5 bb-text-sm bb-outline-none aria-selected:bb-bg-accent aria-selected:bb-text-accent-foreground data-[disabled=true]:bb-pointer-events-none data-[disabled=true]:bb-opacity-50',
			className
		)}
		{...props}
	/>
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={cn(
				'bb-ml-auto bb-text-xs bb-tracking-widest bb-text-muted-foreground',
				className
			)}
			{...props}
		/>
	);
};
CommandShortcut.displayName = 'CommandShortcut';

export {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
};
