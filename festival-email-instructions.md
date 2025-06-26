# Festival Feedback EmailJS Template Setup Instructions

## 1. Create Template in EmailJS Dashboard

1. Go to https://dashboard.emailjs.com/admin/templates
2. Click "Create New Template"
3. Use template ID: `template_festival_feedback`
4. Copy the HTML template from `festival-email-template.html` file

## 2. Template Variables to Configure

In your EmailJS template, use these variables (they will be automatically populated):

### Recipient Information
- `{{to_email}}` - Recipient email address
- `{{to_name}}` - Contact person name

### Contact Information
- `{{contact_person}}` - Contact person name
- `{{email}}` - User email
- `{{phone}}` - Phone number
- `{{company_name}}` - Company name (if applicable)

### Assessment Results
- `{{compatibility_score}}` - Score (0-100%)
- `{{score_description}}` - Score interpretation text
- `{{festival_recommendations}}` - Formatted festival recommendations
- `{{detailed_responses}}` - All question responses formatted

### Visual Elements
- `{{score_color}}` - Color for score display based on score level
- `{{score_emoji}}` - Emoji based on score level (🎉, 🎵, 🎪)

### Contact Preferences
- `{{contact_preference}}` - User's preferred contact method
- `{{user_comments}}` - Optional user comments

### Metadata
- `{{submission_id}}` - Unique submission identifier
- `{{submission_date}}` - Formatted submission date
- `{{submission_timestamp}}` - ISO timestamp

### GDPR Compliance
- `{{gdpr_consent}}` - GDPR consent confirmation
- `{{data_retention}}` - Data retention policy information

## 3. Template Settings in EmailJS

- **Template Name**: Festival Feedback Results
- **Subject**: Dine Festival Anbefalinger - {{contact_person}}
- **From Name**: Festival Finder
- **Reply To**: {{email}}

## 4. Email Service Configuration

Make sure your EmailJS service is configured with:
- Service ID: `service_d40uip4` (already configured)
- Public Key: `BCoUz6Ty8c0oza6pZ` (already configured)

## 5. Template Content Structure

The email template includes:
- **Colorful header** with festival theme gradient
- **Compatibility score** visualization with colored circle
- **Personal information** summary
- **Festival recommendations** with match percentages
- **Contact preferences** section
- **Detailed responses** from the assessment
- **GDPR compliance** information
- **Professional footer** with branding

## 6. Styling Features

- **Festival theme colors** (vibrant gradient backgrounds)
- **Responsive design** for mobile and desktop
- **Danish language** throughout
- **Professional business email** appearance
- **Clean typography** and spacing
- **Visual score representation** with dynamic colors
- **GDPR compliance** section for data protection

## 7. Dynamic Content Features

- **Score-based styling**: Colors and emojis change based on compatibility score
- **Conditional content**: Different messages based on contact preferences
- **Formatted recommendations**: Clean presentation of festival matches
- **Unique submission ID**: For tracking and reference

## 8. Testing

After setting up the template:
1. Test with a sample submission
2. Check all variables are populated correctly
3. Verify responsive design on mobile
4. Confirm Danish characters display properly
5. Test GDPR compliance information displays

## 9. Template ID to Use

Use this exact template ID in your EmailJS dashboard:
```
template_festival_feedback
```

This matches the configuration in the application code.

## 10. GDPR Compliance Features

The template includes:
- Clear consent confirmation
- Data retention policy information
- Contact information for data subject rights
- Transparent data processing information

## 11. Color Scheme

The template uses a vibrant festival theme:
- Primary: #FF6B6B (Coral Red)
- Secondary: #4ECDC4 (Turquoise)
- Accent: #45B7D1 (Sky Blue)
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)

## 12. Score Interpretation

- **80-100%**: Fantastic match (Green, 🎉)
- **60-79%**: Good compatibility (Amber, 🎵)
- **0-59%**: Many options to explore (Red, 🎪)