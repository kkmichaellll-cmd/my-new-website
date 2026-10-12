export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'Method not allowed.' });
  }

  const { address='', email='', full_name='', phone='', marketing=false, website='' } = request.body || {};
  if (website) return response.status(200).json({ success: true });

  const clean = value => String(value).trim().slice(0, 500);
  const registration = {
    address: clean(address), email: clean(email), name: clean(full_name),
    phone: clean(phone), marketing: Boolean(marketing)
  };
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.email);
  if (!registration.address || !validEmail || !registration.name || !registration.phone) {
    return response.status(400).json({ message: 'Please complete every required field.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.NOTIFICATION_EMAIL;
  const from = process.env.FROM_EMAIL || 'OpenTour <onboarding@resend.dev>';
  if (!apiKey || !recipient) {
    return response.status(500).json({ message: 'Email notifications have not been configured yet.' });
  }

  const text = [
    'A user completed OpenTour registration.','',
    `Name: ${registration.name}`,`Email: ${registration.email}`,
    `Phone: ${registration.phone}`,`Tour address: ${registration.address}`,
    `Marketing consent: ${registration.marketing ? 'Yes' : 'No'}`,
    `Submitted: ${new Date().toISOString()}`,'',
    'Passwords are intentionally excluded from this email.'
  ].join('\n');

  try {
    const mail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [recipient], reply_to: registration.email, subject: `New OpenTour registration: ${registration.address}`, text })
    });
    if (!mail.ok) {
      const details = await mail.text();
      console.error('Resend error:', mail.status, details);
      return response.status(502).json({ message: 'We could not send the notification email. Please try again.' });
    }
    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('Registration notification error:', error);
    return response.status(500).json({ message: 'We could not complete your registration. Please try again.' });
  }
}
