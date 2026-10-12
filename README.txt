OPENTOUR — VERCEL WEBSITE

DEPLOYMENT
1. Create a free Resend account at https://resend.com and create an API key.
2. Import this folder or ZIP into a new Vercel project.
3. In Vercel, open Project Settings > Environment Variables and add:
   RESEND_API_KEY = your Resend API key
   NOTIFICATION_EMAIL = the email that should receive registrations
   FROM_EMAIL = OpenTour <notifications@your-verified-domain.com>
4. Apply the variables to Production, Preview and Development, then redeploy.

RESEND DOMAIN
For production delivery, verify your sending domain in Resend and use an address
from that domain for FROM_EMAIL. During initial testing you can omit FROM_EMAIL;
the API will use Resend's onboarding sender, subject to Resend's testing limits.

EMAIL CONTENT
Notifications include the user's full name, email, phone number, tour address,
marketing preference and submission time. Passwords are never sent or stored.

FILES
- index.html, registration.html, create-account.html, success.html
- styles.css and script.js
- api/register.js: Vercel serverless email endpoint
- vercel.json: clean page routes
- hero-family.png

LOCAL PREVIEW
Use `vercel dev` if you need to test the email API locally. Opening the HTML file
directly previews the design and navigation but cannot execute the API endpoint.
