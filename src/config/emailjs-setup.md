# EmailJS Setup Instructions

To make the form functional, you need to set up EmailJS:

## 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Note down your **Service ID**

## 3. Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

**Subject:** ESG Selvtest Resultat - {{to_name}} fra {{company}}

**Content:**
```
Hej {{to_name}},

Tak for at have gennemført vores ESG selvtest for {{company}}.

DINE RESULTATER:
Score: {{score}} ud af 13 point

ANBEFALING:
{{recommendation_title}}
{{recommendation_text}}

DINE SVAR:
{{responses}}

KONTAKTOPLYSNINGER:
Navn: {{to_name}}
Virksomhed: {{company}}
Stilling: {{position}}
Telefon: {{phone}}
Virksomhedsstørrelse: {{company_size}}
Dato: {{submission_date}}

Med venlig hilsen,
Dit ESG Team

---
Denne email er genereret automatisk fra ESG selvevaluering.
```

4. Save the template and note down your **Template ID**

## 4. Get Public Key
1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** (also called User ID)

## 5. Update Configuration
In `src/components/FormHandler.js`, replace the placeholder values:

```javascript
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',      // Replace with your Service ID
  templateId: 'YOUR_TEMPLATE_ID',    // Replace with your Template ID
  publicKey: 'YOUR_PUBLIC_KEY'       // Replace with your Public Key
}
```

## 6. Test the Form
1. Deploy your site or run it locally
2. Fill out the form completely
3. Submit and check if you receive the email

## Troubleshooting
- Make sure all IDs are correct
- Check EmailJS dashboard for any error logs
- Verify your email service is properly connected
- Test with a simple template first if issues persist

## EmailJS Limits
- Free plan: 200 emails/month
- Paid plans available for higher volumes