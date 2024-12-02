import iconImage from '@/assets/icon.png';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
	ArrowLeft,
	Bug,
	CircleUserRound,
	ExternalLink,
	Heart,
	Lightbulb,
	Linkedin,
	Mail,
	NotebookPen,
	Settings,
} from 'lucide-react';
import { useState } from 'react';
import './App.css';
import { NotificationItem } from '@/scripts/notifications/NotificationsItem';

function App() {
	const [showSettings, setShowSettings] = useState(false);
	const [notifications, setNotifications] = useState([]); // Add state for notifications
	const [unreadCount, setUnreadCount] = useState(0);
	const [showContact, setShowContact] = useState(false);

	const NotificationsContent = () => (
		<>
			<div className='flex items-center justify-between'>
				<div className='flex items-center'>
					<img
						src={chrome.runtime.getURL(iconImage)}
						alt='Linklib Icon'
						className='w-6 h-6 mr-2 object-cover rounded-full'
					/>
					<h1 className='font-bold text-lg'>Notifications</h1>
				</div>
				<Button
					variant='outline'
					size='sm'
					onClick={() => setShowSettings(true)}
				>
					<Settings className='h-4 w-4' />
				</Button>
			</div>
			<div className='flex flex-col divide-y divide-border'>
				{notifications.length > 0 ? (
					notifications.map((notification) => (
						<NotificationItem
							key={notification.id}
							notification={notification}
							onMarkAsRead={(id) => {
								setNotifications(
									notifications.map((n) =>
										n.id === id ? { ...n, read: true } : n
									)
								);
								setUnreadCount(Math.max(0, unreadCount - 1));
							}}
						/>
					))
				) : (
					<div className='p-3 text-center text-muted-foreground'>
						No notifications
					</div>
				)}
			</div>
		</>
	);

	const MainContent = () => (
		<>
			{/* <Button
				variant='outline'
				onClick={async () => {
					chrome.runtime.sendMessage({ action: 'saveLinkPopup' });
				}}
			>
				<Heart className='mr-2 h-4 w-4 ' /> Save page
			</Button> */}
			<Button
				variant='outline'
				onClick={() => {
					window.open(
						'https://bytebelli.com',
						'_blank',
						'noopener,noreferrer'
					);
				}}
			>
				<ExternalLink className='mr-2 h-4 w-4' /> Open Bytebelli
			</Button>
			<FeedbackSection />
			<Button variant='outline' onClick={() => setShowContact(true)}>
				<CircleUserRound className='mr-2 h-4 w-4' />
				Contact Us :)
			</Button>
		</>
	);

	const ContactContent = () => (
		<>
			<Button
				variant='outline'
				onClick={() => setShowContact(false)}
				className=''
			>
				<ArrowLeft className='mr-2 h-4 w-4' /> Back
			</Button>
			<div className='grid gap-4 py-4'>
				<div className='grid gap-4'>
					<span className='font-semibold'>Isabelle</span>
					<Button
						variant='outline'
						size='sm'
						className='w-full justify-start'
					>
						<Mail className='mr-2 h-4 w-4' />
						isabelle.ilyia@gmail.com
					</Button>
					<Button
						variant='outline'
						size='sm'
						className='w-full justify-start'
						asChild
					>
						<a
							href='https://www.linkedin.com/in/isabelle-i/'
							target='_blank'
							rel='noopener noreferrer'
						>
							<Linkedin className='mr-2 h-4 w-4' />
							LinkedIn
						</a>
					</Button>
				</div>
				<div className='grid gap-4'>
					<span className='font-semibold'>Jesse</span>
					<Button
						variant='outline'
						size='sm'
						className='w-full justify-start'
					>
						<Mail className='mr-2 h-4 w-4' />
						jesseli751@gmail.com
					</Button>
					<Button
						variant='outline'
						size='sm'
						className='w-full justify-start'
						asChild
					>
						<a
							href='https://www.linkedin.com/in/jesseli751/'
							target='_blank'
							rel='noopener noreferrer'
						>
							<Linkedin className='mr-2 h-4 w-4' />
							LinkedIn
						</a>
					</Button>
					<Button
						variant='outline'
						size='sm'
						className='w-full justify-start'
						asChild
					>
						<a
							href='https://fishinapool.substack.com/'
							target='_blank'
							rel='noopener noreferrer'
						>
							<NotebookPen className='mr-2 h-4 w-4' />
							Substack
						</a>
					</Button>
				</div>
			</div>
		</>
	);

	const SettingsContent = () => (
		<>
			<div className='flex items-center justify-between'>
				<div className='flex items-center'>
					<img
						src={chrome.runtime.getURL(iconImage)}
						alt='Linklib Icon'
						className='w-6 h-6 mr-2 object-cover rounded-full'
					/>
					<h1 className='font-bold text-lg'>Settings</h1>
				</div>
				<Button
					variant='outline'
					size='sm'
					onClick={() => setShowSettings(false)}
				>
					<ArrowLeft className='h-4 w-4' />
				</Button>
			</div>

			{/* Your existing MainContent and ContactContent components */}
			{showContact ? <ContactContent /> : <MainContent />}
		</>
	);

	return (
		<div className='linklib-ext w-60'>
			<div className='bytebelli-internal text-primary'>
				<div className='p-4 flex flex-col space-y-4 bg-popover'>
					{showSettings ? (
						<SettingsContent />
					) : (
						<NotificationsContent />
					)}
				</div>
			</div>
		</div>
	);
}

const FeedbackSection: React.FC = () => {
	const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | null>(
		null
	);
	const [feedbackText, setFeedbackText] = useState('');

	const handleSubmit = (type: 'bug' | 'feature') => {
		// Here you would typically send this data to your backend
		// TODO:// BACKEND
		console.log(type);
		// Reset the form
		setFeedbackType(null);
		setFeedbackText('');
	};

	return (
		<div className='space-y-4'>
			{feedbackType === null ? (
				<div className='space-y-4'>
					<Button
						onClick={() => setFeedbackType('bug')}
						className='w-full '
						variant='outline'
					>
						<Bug className='mr-2 h-4 w-4' />
						Report a Bug
					</Button>
					<Button
						onClick={() => setFeedbackType('feature')}
						className='w-full '
						variant='outline'
					>
						<Lightbulb className='mr-2 h-4 w-4' />
						Request a Feature
					</Button>
				</div>
			) : (
				<div className='space-y-4'>
					<Textarea
						placeholder={
							feedbackType === 'bug'
								? 'Describe the bug...'
								: 'Describe the feature...'
						}
						value={feedbackText}
						onChange={(e) => setFeedbackText(e.target.value)}
					/>
					<div className='flex space-x-2 justify-center w-full'>
						<Button
							onClick={() => handleSubmit(feedbackType)}
							disabled={!feedbackText.trim()}
						>
							Submit
						</Button>
						<Button
							onClick={() => setFeedbackType(null)}
							variant='outline'
						>
							Cancel
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
