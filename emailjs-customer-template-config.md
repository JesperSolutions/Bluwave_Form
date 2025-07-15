# EmailJS Customer Template Configuration

## Template Settings

**Template Name**: Contact Us - Customer
**Template ID**: template_71juzbb

## Email Configuration

### Subject
```
Jeres ESG Selvtest Resultat - {{company_name}}
```

### To Email
```
{{to_email}}
```
*This should be the customer's email address, NOT ja@bluwave.dk*

### From Name
```
ESG Selvtest - Bluwave
```

### From Email
```
Use Default Email Address ✓
```

### Reply To
```
ja@bluwave.dk
```

### BCC
```
(leave empty)
```

### CC
```
(leave empty)
```

## Template Variables Used

Make sure these variables are available in your template:
- `{{to_email}}` - Customer's email address
- `{{to_name}}` - Customer's contact person name
- `{{company_name}}` - Company name
- `{{contact_person}}` - Contact person name
- `{{email}}` - Company email
- `{{phone}}` - Phone number
- `{{industry}}` - Industry/branch
- `{{employees}}` - Number of employees
- `{{contact_preference}}` - Contact preference text
- `{{may_contact}}` - "JA" or "NEJ"
- `{{total_score}}` - Score (0-17)
- `{{max_score}}` - Maximum score (17)
- `{{score_percentage}}` - Score as percentage
- `{{recommendation_title}}` - Result title
- `{{recommendation_text}}` - Recommendation description
- `{{score_color}}` - Color for score display
- `{{score_emoji}}` - Emoji based on score level
- `{{next_steps}}` - Formatted next steps text
- `{{detailed_responses}}` - All question responses
- `{{submission_date}}` - Formatted submission date

## Content
Use the HTML content from `emailjs-customer-template.html` file.