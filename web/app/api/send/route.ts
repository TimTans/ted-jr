import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { EmailTemplate } from '@/components/email-template';

export async function POST(request: Request) {
  try {
    const { to, firstName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Neighborly <onboarding@resend.dev>',
      to: [to],
      subject: 'Welcome to Neighborly!',
      react: EmailTemplate({ firstName }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
