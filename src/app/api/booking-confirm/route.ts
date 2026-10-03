import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email, program, date, time } = await req.json();

  if (!email || !program || !date || !time) {
    return NextResponse.json({ error: 'Missing fields.' }, { status: 400 });
  }

  const formattedDate = new Date(date).toLocaleDateString('en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const { error } = await resend.emails.send({
    from: 'TOP Music School <noreply@topmusic.pro>',
    to: email,
    subject: `Your lesson is confirmed — ${program}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0D0B0F;color:#F5F0E8;padding:40px;border-radius:12px">
        <div style="text-align:center;margin-bottom:32px">
          <h1 style="font-size:28px;margin:0;color:#F5F0E8">Your lesson is confirmed!</h1>
          <div style="width:60px;height:2px;background:#C9A84C;margin:12px auto 0"></div>
        </div>

        <p style="color:#A09880;margin-bottom:24px">Hi there,</p>
        <p style="color:#A09880;margin-bottom:32px">
          We are excited to confirm your upcoming lesson at TOP Music School. Here are your details:
        </p>

        <div style="background:#1A1820;border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:24px;margin-bottom:32px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;color:#A09880;width:130px">Program</td>
              <td style="padding:10px 0;color:#F5F0E8;font-weight:600">${program}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#A09880">Date</td>
              <td style="padding:10px 0;color:#F5F0E8;font-weight:600">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#A09880">Time</td>
              <td style="padding:10px 0;color:#F5F0E8;font-weight:600">${time}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#A09880">Location</td>
              <td style="padding:10px 0;color:#F5F0E8;font-weight:600">255 Rue Gamelin, Gatineau, QC J8Y 1W8</td>
            </tr>
          </table>
        </div>

        <p style="color:#A09880;margin-bottom:24px">
          If you have any questions or need to reschedule, reply to this email or call us at <strong style="color:#F5F0E8">(819) 598-0808</strong>.
        </p>

        <p style="color:#A09880;margin-bottom:4px">See you soon,</p>
        <p style="color:#C9A84C;font-weight:600;margin:0">The TOP Music School Team</p>

        <div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(201,168,76,0.15);text-align:center">
          <p style="color:#A09880;font-size:12px;margin:0">TOP Music School · 255 Rue Gamelin, Gatineau, QC · <a href="https://topmusic.pro" style="color:#C9A84C">topmusic.pro</a></p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Resend error:', JSON.stringify(error));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
