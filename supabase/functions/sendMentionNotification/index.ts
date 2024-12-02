import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@1.0.0';

// Initialize Resend
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
const resend = new Resend(resendApiKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers':
          'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Parse the request body
    const { note, mentioned_email, highlight, author_name, link } =
      await req.json();

    console.log('Request received:', {
      note,
      mentioned_email,
      highlight,
      author_name,
      link,
    });

    // Validate the input
    if (!note || !mentioned_email || !highlight || !author_name || !link) {
      console.error('Invalid request body:', {
        note,
        mentioned_email,
        highlight,
        author_name,
        link,
      });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Construct the email content
    const emailContent = `
      <p>You were mentioned in a note on ${link} using ByteBelli!</p>
      <p><strong>Author:</strong> ${author_name}</p>
      <p><strong>Highlight:</strong> ${highlight}</p>
      <p><strong>Note:</strong> ${note}</p>
      <p><strong>Link:</strong> <a href="${link}" target="_blank">${link}</a></p>
    `;

    // Send the email
    const response = await resend.emails.send({
      from: 'isabelle@bytebelli.com', // Replace with your verified sender email
      to: mentioned_email,
      subject: `You were mentioned in a note by ${author_name}`,
      html: emailContent,
    });

    console.log('Email sent:', response);

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers':
            'authorization, x-client-info, apikey, content-type',
        },
        status: 200,
      }
    );
  } catch (err) {
    console.error('Error sending email:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers':
          'authorization, x-client-info, apikey, content-type',
      },
      status: 500,
    });
  }
});
