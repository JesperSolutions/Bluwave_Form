# EmailJS Template Setup Instructions

## 1. Create Template in EmailJS Dashboard

1. Go to https://dashboard.emailjs.com/admin/templates
2. Click "Create New Template"
3. Use template ID: `template_esg_assessment`
4. Copy the HTML template from `email-template.html` file

## 2. Template Variables to Configure

In your EmailJS template, use these variables (they will be automatically populated):

### Recipient Information
- `{{to_email}}` - Recipient email address
- `{{to_name}}` - Contact person name

### Company Information
- `{{company_name}}` - Company name
- `{{contact_person}}` - Contact person name
- `{{email}}` - Company email
- `{{phone}}` - Phone number
- `{{industry}}` - Industry/branch
- `{{employees}}` - Number of employees

### Assessment Results
- `{{total_score}}` - Score (0-13)
- `{{max_score}}` - Maximum possible score (13)
- `{{score_percentage}}` - Score as percentage
- `{{recommendation_title}}` - Result title
- `{{recommendation_text}}` - Recommendation description
- `{{recommendation_level}}` - Level (beginner/intermediate/advanced)

### Visual Elements
- `{{score_color}}` - Color for score display
- `{{score_emoji}}` - Emoji based on score level
- `{{next_steps}}` - Formatted next steps text
- `{{detailed_responses}}` - All question responses

### Metadata
- `{{submission_date}}` - Formatted submission date
- `{{submission_timestamp}}` - ISO timestamp

## 3. Template Settings in EmailJS

- **Template Name**: ESG Assessment Results
- **Subject**: Jeres ESG Selvtest Resultat - {{company_name}}
- **From Name**: ESG Selvtest
- **Reply To**: {{email}}

## 4. Email Service Configuration

Make sure your EmailJS service is configured with:
- Service ID: `service_d40uip4` (already configured)
- Public Key: `BCoUz6Ty8c0oza6pZ` (already configured)

## 5. Template Content Structure

The email template includes:
- Professional header with logo
- Score visualization with colored circle
- Company information summary
- Personalized recommendations
- Next steps based on score level
- Detailed question responses
- Professional footer

## 6. Styling Features

- Responsive design for mobile and desktop
- Danish language throughout
- Brand colors matching your application
- Professional business email appearance
- Clean typography and spacing
- Visual score representation

## 7. Testing

After setting up the template:
1. Test with a sample submission
2. Check all variables are populated correctly
3. Verify responsive design on mobile
4. Confirm Danish characters display properly

## 8. Template ID to Use

Use this exact template ID in your EmailJS dashboard:
```
template_esg_assessment
```

This matches the configuration already set in the application code.