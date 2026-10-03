import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const data = await req.json();

  const { error } = await resend.emails.send({
    from: 'TOP Music <noreply@topmusic.pro>',
    to: 'info@topmusic.pro',
    replyTo: data.email,
    subject: `New Enrollment Request: ${data.program} — ${data.studentName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a1a1a">New enrollment request</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:140px">Student Name</td><td style="padding:8px 0">${data.studentName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Age</td><td style="padding:8px 0">${data.age}</td></tr>
          ${data.parentName ? `<tr><td style="padding:8px 0;color:#666">Parent Name</td><td style="padding:8px 0">${data.parentName}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          ${data.phone ? `<tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${data.phone}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666">Program</td><td style="padding:8px 0">${data.program}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Lesson Length</td><td style="padding:8px 0">${data.length}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Frequency</td><td style="padding:8px 0">${data.frequency}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Format</td><td style="padding:8px 0">${data.format}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Experience</td><td style="padding:8px 0">${data.experience}</td></tr>
          ${data.days?.length ? `<tr><td style="padding:8px 0;color:#666">Preferred Days</td><td style="padding:8px 0">${data.days.join(', ')}</td></tr>` : ''}
          ${data.notes ? `<tr><td style="padding:8px 0;color:#666">Notes</td><td style="padding:8px 0">${data.notes}</td></tr>` : ''}
        </table>
      </div>
    `,
  });

  if (error) {
    console.error('Resend error:', JSON.stringify(error));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
