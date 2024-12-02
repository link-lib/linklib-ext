import iconImage from '@/assets/icon.png';
import { getUserNotifications } from '@/backend/notifications/getUserNotifications';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AuthContext } from '@/scripts/auth/context/AuthModalContext';
import { NotificationItem } from '@/scripts/notifications/NotificationsItem';
import {
	ArrowLeft,
	Bug,
	CircleUserRound,
	ExternalLink,
	Lightbulb,
	Linkedin,
	Mail,
	NotebookPen,
	Settings,
	Check,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import './App.css';
import { markNotificationsAsRead } from '@/backend/notifications/markNotificationsAsRead';

function App() {
	const auth = useContext(AuthContext);
	const [showSettings, setShowSettings] = useState(false);
	const [notifications, setNotifications] = useState([]); // Add state for notifications
	const [unreadCount, setUnreadCount] = useState(0);
	const [showContact, setShowContact] = useState(false);

	// Add this useEffect to handle notifications and badge
	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				if (!auth?.user?.id) {
					console.error('No user ID found');
					return;
				}

				// Fetch notifications using the user ID from auth context
				const notifications = await getUserNotifications(auth.user.id);

				if (notifications) {
					setNotifications(notifications);
					// Count unread notifications
					const unreadCount = notifications.filter(
						(n) => !n.is_read
					).length;
					setUnreadCount(unreadCount);

					// Update extension badge
					if (unreadCount > 0) {
						chrome.action.setBadgeText({
							text: unreadCount.toString(),
						});
						chrome.action.setBadgeBackgroundColor({
							color: '#EF4444', // Red color for the badge
						});
					} else {
						chrome.action.setBadgeText({ text: '' });
					}
				}
			} catch (error) {
				console.error('Error fetching notifications:', error);
			}
		};

		// Initial fetch
		fetchNotifications();

		// Set up polling for new notifications (every 5 minutes)
		const pollInterval = setInterval(fetchNotifications, 5 * 60 * 1000);

		// Cleanup
		return () => {
			clearInterval(pollInterval);
		};
	}, [auth?.user?.id]);

	// Update badge when unreadCount changes
	useEffect(() => {
		if (unreadCount > 0) {
			chrome.action.setBadgeText({
				text: unreadCount.toString(),
			});
		} else {
			chrome.action.setBadgeText({ text: '' });
		}
	}, [unreadCount]);

	const NotificationsContent = () => (
		<>
			<div className='flex items-center justify-between p-4 pb-0'>
				<div className='flex items-center '>
					<img
						src={chrome.runtime.getURL(iconImage)}
						alt='Linklib Icon'
						className='w-6 h-6 mr-2 object-cover rounded-full'
					/>
					<h1 className='font-bold text-lg font-mono'>
						Notifications
					</h1>
				</div>
				<div className='flex gap-2'>
					{notifications.length > 0 && (
						<Button
							variant='ghost'
							size='sm'
							onClick={async () => {
								await markNotificationsAsRead(
									notifications.map((n) => n.id)
								);
								setNotifications(
									notifications.map((n) => ({
										...n,
										is_read: true,
									}))
								);
								setUnreadCount(0);
							}}
							className='text-xs text-muted-foreground hover:text-foreground'
						>
							<Check className='h-3 w-3 mr-1' />
							Mark all as read
						</Button>
					)}
					<Button
						variant='outline'
						size='sm'
						onClick={() => setShowSettings(true)}
					>
						<Settings className='h-4 w-4' />
					</Button>
				</div>
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
										n.id === id
											? { ...n, is_read: true }
											: n
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
		<div className='linklib-ext w-[500px]'>
			<div className=' text-primary'>
				<div className='flex flex-col space-y-4 bg-popover'>
					{showSettings ? (
						<div className='p-4 flex flex-col space-y-4'>
							<SettingsContent />
						</div>
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
