import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, phone, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const subjectLabels: Record<string, string> = {
    enrollment: 'Enrollment Inquiry',
    trial: 'Free Trial Lesson',
    pricing: 'Pricing & Plans',
    programs: 'Program Information',
    other: 'Other',
  };

  const { error } = await resend.emails.send({
    from: 'TOP Music Website <onboarding@resend.dev>',
    to: 'thetopmusicschool@gmail.com',
    replyTo: email,
    subject: `New Contact: ${subjectLabels[subject] ?? subject ?? 'General Inquiry'}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a1a1a">New message from the website</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666">Subject</td><td style="padding:8px 0">${subjectLabels[subject] ?? subject ?? '—'}</td></tr>
        </table>
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
        <p style="color:#1a1a1a;white-space:pre-wrap">${message}</p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
