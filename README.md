# ESG Selvtest - Bluwave Assessment Tool

En moderne, responsiv webapplikation til vurdering af virksomheders ESG-parathed. Udviklet til Bluwave for at hjælpe små og mellemstore virksomheder med at evaluere deres bæredygtighedsindsats.

## 🌟 Features

### 📊 Komplet ESG Vurdering
- **13 spørgsmål** fordelt på 4 kategorier
- **Vægtede scoring** med kritiske spørgsmål (max 17 point)
- **Sektionsbaserede resultater** med individuelle scores
- **Personlige anbefalinger** baseret på scoreniveau

### 🎯 Brugervenlig Oplevelse
- **Multi-step form** med progress tracking
- **Responsivt design** optimeret til alle enheder
- **Dansk sprog** gennem hele applikationen
- **Intuitive navigation** mellem sektioner

### 📧 Automatisk Email Rapportering
- **Øjeblikkelig levering** af resultater
- **Professionel email template** med virksomhedsbranding
- **Detaljeret analyse** med næste skridt
- **Lead notifikationer** til Bluwave team

### 🔧 Teknisk Excellence
- **React 18** med moderne hooks
- **EmailJS integration** for pålidelig email levering
- **CSS Grid/Flexbox** for optimal layout
- **Performance optimeret** med lazy loading

## 🏗️ Arkitektur

### Komponenter
```
src/
├── components/
│   ├── ESGAssessment.jsx      # Hovedkomponent og state management
│   ├── ContactForm.jsx        # Virksomhedsoplysninger
│   ├── AssessmentQuestions.jsx # ESG spørgsmål og navigation
│   └── ResultsDisplay.jsx     # Resultater og anbefalinger
├── services/
│   └── emailService.js        # EmailJS integration
└── styles/                    # CSS moduler
```

### Scoring System
```javascript
// Vægtede spørgsmål (vægt 2)
const criticalQuestions = {
  q3: 2,  // Identificeret væsentlige ESG-faktorer
  q5: 2,  // Processer til dataindsamling  
  q8: 2,  // Kunder spurgt ind til ESG
  q10: 2  // Kunne dokumentere ESG-arbejdet
}

// Sektioner og max scores
const sections = {
  section1: { max: 4 },  // Grundlæggende forståelse
  section2: { max: 4 },  // Mål og måling
  section3: { max: 4 },  // Strategi og forretning
  section4: { max: 5 }   // Risici og fremtidssikring
}
```

### Score Niveauer
- **0-6 point**: Opstartsfasen (🌱)
- **7-12 point**: Har fat i tingene (🌿)  
- **13-17 point**: Godt i gang (🌳)

## 🚀 Installation

```bash
# Clone repository
git clone https://github.com/bluwave/esg-assessment.git
cd esg-assessment

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## ⚙️ Konfiguration

### EmailJS Setup
1. Opret konto på [EmailJS](https://www.emailjs.com/)
2. Konfigurer service med ID: `service_d40uip4`
3. Opret to templates:
   - **Customer template**: `template_71juzbb` (til kunder)
   - **Lead template**: `template_prjekf7` (til Bluwave)
4. Brug public key: `lM3RvJE63x4ZIqmwg`

### Environment Variables
```env
VITE_EMAILJS_SERVICE_ID=service_d40uip4
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=template_71juzbb
VITE_EMAILJS_LEAD_TEMPLATE_ID=template_prjekf7
VITE_EMAILJS_PUBLIC_KEY=lM3RvJE63x4ZIqmwg
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Optimering
- **Touch-friendly** interface på mobile
- **Optimeret typography** for læsbarhed
- **Adaptive layouts** med CSS Grid
- **Performance** med moderne CSS features

## 🎨 Design System

### Farver
```css
:root {
  --primary-green: #89B348;
  --secondary-green: #91C574;
  --text-primary: #000000;
  --text-secondary: #4a5568;
  --background-primary: #ffffff;
  --background-light: #f8fafc;
}
```

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Scale**: Modular scale for konsistent hierarki

## 📊 Analytics & Tracking

### Metrics
- **Completion rate** per sektion
- **Score distribution** på tværs af virksomheder
- **Contact preferences** for lead kvalificering
- **Industry breakdown** for markedsanalyse

## 🔒 Sikkerhed & Privacy

### Data Behandling
- **GDPR compliant** data håndtering
- **Minimal data collection** - kun nødvendige oplysninger
- **Secure transmission** via HTTPS
- **No persistent storage** af personlige data

### Email Sikkerhed
- **Encrypted transmission** via EmailJS
- **Rate limiting** for spam beskyttelse
- **Input validation** og sanitization
- **Dual email system** med separate templates

## 🚀 Deployment

### Netlify (Anbefalet)
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_EMAILJS_SERVICE_ID=service_3q3n4lr
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=template_customer
VITE_EMAILJS_LEAD_TEMPLATE_ID=template_prjekf7
VITE_EMAILJS_PUBLIC_KEY=lM3RvJE63x4ZIqmwg
```

### Performance
- **Lighthouse Score**: 95+ på alle metrics
- **Core Web Vitals**: Optimeret for Google ranking
- **Bundle Size**: < 500KB gzipped

## 🧪 Testing

### Manual Testing Checklist
- [ ] Alle formular felter validerer korrekt
- [ ] Navigation mellem sektioner fungerer
- [ ] Email levering til både kunde og Bluwave
- [ ] Responsive design på alle enheder
- [ ] Score beregning er korrekt
- [ ] Error handling fungerer

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📈 Roadmap

### Næste Features
- [ ] **A/B testing** af spørgsmålsformulering
- [ ] **Industry-specific** spørgsmål
- [ ] **PDF export** af resultater
- [ ] **Multi-language** support
- [ ] **Advanced analytics** dashboard

### Tekniske Forbedringer
- [ ] **TypeScript** migration
- [ ] **Unit tests** med Jest/Vitest
- [ ] **E2E tests** med Playwright
- [ ] **Performance monitoring** med Sentry

## 🤝 Contributing

### Development Workflow
1. **Fork** repository
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Standards
- **ESLint** for code quality
- **Prettier** for formatting
- **Conventional Commits** for commit messages
- **Component documentation** med JSDoc

## 📞 Support

### Kontakt
- **Email**: support@bluwave.dk
- **Website**: [bluwave.dk](https://bluwave.dk)
- **LinkedIn**: [Bluwave](https://linkedin.com/company/bluwave)

### Dokumentation
- **API Reference**: Se `src/services/emailService.js`
- **Component Guide**: Se individuelle component filer
- **Styling Guide**: Se `src/index.css`

---

**Reporting Progress – Power Your Business**

*Udviklet med ❤️ af Bluwave team*