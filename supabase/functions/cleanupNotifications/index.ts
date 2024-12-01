import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/utils/supabase/server';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const supabase = createClient();
    // Execute the cleanup function
    const { error } = await supabase.rpc('clean_stale_notifications');

    if (error) {
      console.error('Error cleaning notifications:', error);
      res
        .status(500)
        .json({ message: 'Failed to clean stale notifications', error });
    } else {
      console.log('Stale notifications cleaned successfully');
      res
        .status(200)
        .json({ message: 'Stale notifications cleaned successfully' });
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Unexpected error', error: err });
  }
};

export default handler;
