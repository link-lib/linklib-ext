import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceNoteProps {
	audioUrl: string;
	transcription: string;
	duration: string; // in format "MM:SS"
}

const VoiceNote = ({ audioUrl, transcription, duration }: VoiceNoteProps) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [showTranscription, setShowTranscription] = useState(false);

	return (
		<div className='flex flex-col max-w-[80%] gap-1 pt-2'>
			<div className='flex items-center gap-3'>
				<button
					onClick={() => setIsPlaying(!isPlaying)}
					className='w-6 h-6 bg-[#0A84FF] rounded-full flex items-center justify-center'
				>
					{isPlaying ? (
						<Pause className='w-4 h-4' />
					) : (
						<Play className='w-4 h- ml-0.5' />
					)}
				</button>

				<div className='flex-1'>
					<div className='h-[18px] bg-[#383838] rounded-full'>
						{/* Add waveform visualization here if needed */}
					</div>
				</div>

				<span className='text-gray-400 text-sm min-w-[46px]'>
					{duration}
				</span>
			</div>
			{transcription && (
				<div className='flex flex-col'>
					<div
						className={`text-gray-300 text-sm ${
							!showTranscription ? 'line-clamp-1' : ''
						}`}
					>
						{transcription}
					</div>
					<button
						onClick={() => setShowTranscription(!showTranscription)}
						className='text-[#0A84FF] text-sm self-start'
					>
						{showTranscription ? 'Show Less' : 'Show More'}
					</button>
				</div>
			)}
		</div>
	);
};

export default VoiceNote;
