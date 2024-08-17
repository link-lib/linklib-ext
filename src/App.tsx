import iconImage from '@/assets/icon.png';
import { Button } from '@/components/ui/button';
import { ExternalLink, Heart, MessageSquare } from 'lucide-react';
import './App.css';

function App() {
	return (
		<div className='linklib-ext w-fit'>
			<div className='bytebelli-internal w-fit text-primary'>
				<div className='p-4 flex flex-col  space-y-4 bg-popover w-fit'>
					<div className='flex w-fit items-center align-middle'>
						<img
							src={chrome.runtime.getURL(iconImage)}
							alt='Linklib Icon'
							className='w-8 h-8 p-1 object-cover rounded-full'
						/>
						<span className='font-bold text-lg pl-2'>
							Bytebelli
						</span>
					</div>
					<Button variant='outline' size='sm'>
						<Heart className='mr-2 h-4 w-4 ' /> Save page
					</Button>
					<Button variant='outline' size='sm'>
						<ExternalLink className='mr-2 h-4 w-4' /> Open Bytebelli
					</Button>
					<Button variant='outline' size='sm'>
						<ExternalLink className='mr-2 h-4 w-4' /> Open Bytebelli
					</Button>
					<Button variant='outline' size='sm'>
						<MessageSquare className='mr-2 h-4 w-4' /> Give feedback
					</Button>
				</div>
			</div>
		</div>
	);
}

export default App;
