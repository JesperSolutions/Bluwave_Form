import emailjs from '@emailjs/browser'

// EmailJS configuration - Production Ready
const EMAILJS_CONFIG = {
  serviceId: 'service_d40uip4', // Your provided service ID
  templateId: 'template_esg_assessment', // You'll need to create this template in EmailJS
  publicKey: 'YOUR_PUBLIC_KEY' // Replace with your actual public key from EmailJS
}

// Initialize EmailJS when public key is provided
if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
  emailjs.init(EMAILJS_CONFIG.publicKey)
}

export const submitAssessment = async (data) => {
  const { contact, assessment, score, recommendation } = data

  // Format responses for email with Danish question text
  const questions = [
    'Har I i ledelsen en fælles forståelse af, hvad ESG betyder for jeres virksomhed?',
    'Har I formuleret en holdning til klima, sociale ansvar og governance?',
    'Har I identificeret, hvilke ESG-faktorer der er væsentlige for jeres virksomhed og jeres branche?',
    'Har I konkrete mål for fx CO₂-reduktion, diversitet, medarbejdertrivsel eller ansvarlig leverandørstyring?',
    'Har I processer til at indsamle og dokumentere data om jeres ESG-indsats?',
    'Kommunikerer I allerede i dag om jeres ansvar og resultater – fx på hjemmeside, i tilbud eller i dialog med kunder?',
    'Er ESG en del af jeres strategi og værdigrundlag – eller blot noget, I "skal" gøre?',
    'Har jeres vigtigste kunder eller samarbejdspartnere spurgt ind til jeres ESG-indsats?',
    'Har I oplevet, at ESG-krav er blevet en konkurrenceparameter (f.eks. i udbud, partnerskaber eller investeringer)?',
    'Ville I kunne dokumentere jeres ESG-arbejde, hvis I blev spurgt i morgen?',
    'Er I klar over, at krav til ESG-rapportering allerede gælder store virksomheder – og at de krav nu bevæger sig ud i leverandørkæden?',
    'Har I overblik over de risici, der kan ramme jeres forretning, hvis I ikke arbejder systematisk med ESG?',
    'Ville det styrke jeres brand, rekruttering og relationer, hvis I kunne vise ansvar og resultater på ESG?'
  ]

  // Format responses for better readability
  let formattedResponses = ''
  for (let i = 1; i <= 13; i++) {
    const answer = assessment[`q${i}`]
    const answerText = answer === 'ja' ? '✅ Ja' : answer === 'nej' ? '❌ Nej' : '❓ Ved ikke'
    formattedResponses += `${i}. ${questions[i-1]}\n   Svar: ${answerText}\n\n`
  }

  // Get industry display name
  const industryMap = {
    'byggeri': 'Byggeri og anlæg',
    'energi': 'Energi og forsyning',
    'finans': 'Finans og forsikring',
    'handel': 'Handel og detailhandel',
    'industri': 'Industri og produktion',
    'it': 'IT og teknologi',
    'konsulent': 'Konsulent og rådgivning',
    'landbrug': 'Landbrug og fødevarer',
    'logistik': 'Logistik og transport',
    'sundhed': 'Sundhed og social',
    'turisme': 'Turisme og oplevelser',
    'anden': 'Anden branche'
  }

  const employeeMap = {
    '1-9': '1-9 medarbejdere',
    '10-49': '10-49 medarbejdere',
    '50-249': '50-249 medarbejdere',
    '250+': '250+ medarbejdere'
  }

  // Prepare comprehensive email data
  const emailData = {
    // Recipient information
    to_email: contact.email,
    to_name: contact.contactPerson,
    
    // Company information
    company_name: contact.companyName,
    contact_person: contact.contactPerson,
    email: contact.email,
    phone: contact.phone || 'Ikke angivet',
    industry: industryMap[contact.industry] || contact.industry || 'Ikke angivet',
    employees: employeeMap[contact.employees] || contact.employees || 'Ikke angivet',
    
    // Assessment results
    total_score: score,
    max_score: 13,
    score_percentage: Math.round((score / 13) * 100),
    recommendation_title: recommendation.title,
    recommendation_text: recommendation.text,
    recommendation_level: recommendation.level,
    
    // Detailed responses
    detailed_responses: formattedResponses,
    
    // Metadata
    submission_date: new Date().toLocaleDateString('da-DK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    submission_timestamp: new Date().toISOString(),
    
    // Additional context for email template
    next_steps: getNextStepsText(recommendation.level),
    score_interpretation: getScoreInterpretation(score)
  }

  try {
    // Check if EmailJS is properly configured
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
      console.warn('⚠️ EmailJS not configured with real public key. Simulating email send...')
      
      // Enhanced simulation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
      
      console.log('📧 Email would be sent with the following data:')
      console.log('📊 Assessment Results:', {
        company: emailData.company_name,
        score: `${emailData.total_score}/${emailData.max_score}`,
        level: emailData.recommendation_level,
        email: emailData.to_email
      })
      
      return { 
        status: 'success', 
        message: 'Email simulation completed successfully',
        messageId: `sim_${Date.now()}`
      }
    }

    // Send actual email via EmailJS
    console.log('📤 Sending ESG assessment email...')
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      emailData
    )
    
    console.log('✅ Email sent successfully:', response)
    return response
    
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    
    // Provide more specific error messages
    if (error.status === 400) {
      throw new Error('Ugyldig email konfiguration. Kontakt venligst support.')
    } else if (error.status === 401) {
      throw new Error('Email service ikke autoriseret. Prøv igen senere.')
    } else if (error.status === 402) {
      throw new Error('Email service limit nået. Prøv igen senere.')
    } else {
      throw new Error('Kunne ikke sende email. Tjek din internetforbindelse og prøv igen.')
    }
  }
}

// Helper function to get next steps text based on recommendation level
function getNextStepsText(level) {
  switch (level) {
    case 'beginner':
      return `
1. 📋 Få overblik over ESG-faktorer relevante for jeres branche
2. 🎯 Sæt ét konkret mål at starte med
3. 📚 Uddann jer selv og teamet i ESG-grundlæggende
4. 💬 Start dialogen om bæredygtighed internt
      `.trim()
    
    case 'intermediate':
      return `
1. 📊 Implementer systemer til dataindsamling og dokumentation
2. 📋 Forbered jer på øgede rapporteringskrav
3. 💬 Kommuniker aktivt om jeres ESG-indsats
4. 🔄 Strukturer og systematiser jeres arbejde
      `.trim()
    
    case 'advanced':
      return `
1. 🚀 Optimer og effektivisér jeres ESG-processer
2. 💼 Integrer ESG strategisk i forretningsmodellen
3. 🏆 Bliv frontløber og del jeres erfaringer
4. 📈 Brug ESG som konkurrencefordel
      `.trim()
    
    default:
      return 'Kontakt os for personlige anbefalinger til jeres ESG-rejse.'
  }
}

// Helper function to interpret the score
function getScoreInterpretation(score) {
  if (score <= 5) {
    return 'I er i startfasen med ESG. Det er helt normalt, og I har gode muligheder for at komme godt i gang.'
  } else if (score <= 9) {
    return 'I har allerede fat i mange af de rigtige ting. Nu handler det om at strukturere og dokumentere jeres arbejde.'
  } else {
    return 'I er godt på vej og foran mange andre SMV\'er. I kan nu fokusere på at optimere og bruge ESG strategisk.'
  }
}