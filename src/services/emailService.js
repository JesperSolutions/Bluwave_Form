import emailjs from '@emailjs/browser'

// EmailJS configuration - Production Ready
const EMAILJS_CONFIG = {
  serviceId: 'service_d40uip4', // Your provided service ID
  templateId: 'template_pac9jom', // Updated template ID
  publicKey: 'BCoUz6Ty8c0oza6pZ' // Your provided public key
}

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey)

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

  // Prepare comprehensive email data for customer
  const customerEmailData = {
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
    
    // Contact preference
    contact_preference: contact.contactPreference === 'yes' ? 'Ja, må gerne kontaktes' : 'Nej, kun resultat ønsket',
    may_contact: contact.contactPreference === 'yes' ? 'JA' : 'NEJ',
    
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
    score_interpretation: getScoreInterpretation(score),
    
    // Visual elements for email
    score_color: getScoreColor(recommendation.level),
    score_emoji: getScoreEmoji(recommendation.level)
  }

  // Prepare notification email data for Bluwave
  const notificationEmailData = {
    // Send to Bluwave
    to_email: 'ja@bluwave.dk',
    to_name: 'Jesper',
    
    // Company information
    company_name: `[LEAD] ${contact.companyName}`,
    contact_person: contact.contactPerson,
    email: contact.email,
    phone: contact.phone || 'Ikke angivet',
    industry: industryMap[contact.industry] || contact.industry || 'Ikke angivet',
    employees: employeeMap[contact.employees] || contact.employees || 'Ikke angivet',
    
    // Contact preference - highlighted for business
    contact_preference: contact.contactPreference === 'yes' ? '🟢 JA - KONTAKT ØNSKET' : '🔴 NEJ - Kun resultat',
    may_contact: contact.contactPreference === 'yes' ? 'JA' : 'NEJ',
    
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
    score_interpretation: getScoreInterpretation(score),
    
    // Visual elements for email
    score_color: getScoreColor(recommendation.level),
    score_emoji: getScoreEmoji(recommendation.level)
  }

  try {
    console.log('📤 Sending emails with config:', EMAILJS_CONFIG)
    
    // Send email to customer first
    console.log('📤 Sending ESG assessment email to customer...')
    
    const customerResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      customerEmailData
    )
    
    console.log('✅ Customer email sent successfully:', customerResponse)

    // Send notification email to Bluwave
    console.log('📤 Sending notification email to Bluwave...')
    
    const notificationResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      notificationEmailData
    )
    
    console.log('✅ Notification email sent successfully:', notificationResponse)
    
    return { customerResponse, notificationResponse }
    
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    console.error('Error details:', {
      status: error.status,
      text: error.text,
      message: error.message
    })
    
    // Provide more specific error messages
    if (error.status === 400) {
      throw new Error('Template ikke fundet. Kontakt venligst support.')
    } else if (error.status === 401) {
      throw new Error('Email service ikke autoriseret. Prøv igen senere.')
    } else if (error.status === 402) {
      throw new Error('Email service limit nået. Prøv igen senere.')
    } else if (error.text && error.text.includes('template')) {
      throw new Error('Email template ikke konfigureret korrekt. Kontakt support.')
    } else {
      throw new Error('Kunne ikke sende email. Tjek din internetforbindelse og prøv igen.')
    }
  }
}

// Helper function to get next steps text based on recommendation level
function getNextStepsText(level) {
  switch (level) {
    case 'beginner':
      return `• 📋 Få overblik over ESG-faktorer relevante for jeres branche
• 🎯 Sæt ét konkret mål at starte med
• 📚 Uddann jer selv og teamet i ESG-grundlæggende
• 💬 Start dialogen om bæredygtighed internt`
    
    case 'intermediate':
      return `• 📊 Implementer systemer til dataindsamling og dokumentation
• 📋 Forbered jer på øgede rapporteringskrav
• 💬 Kommuniker aktivt om jeres ESG-indsats
• 🔄 Strukturer og systematiser jeres arbejde`
    
    case 'advanced':
      return `• 🚀 Optimer og effektivisér jeres ESG-processer
• 💼 Integrer ESG strategisk i forretningsmodellen
• 🏆 Bliv frontløber og del jeres erfaringer
• 📈 Brug ESG som konkurrencefordel`
    
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

// Helper function to get score color for email styling
function getScoreColor(level) {
  switch (level) {
    case 'beginner': return '#f59e0b'
    case 'intermediate': return '#10b981'
    case 'advanced': return '#059669'
    default: return '#10b981'
  }
}

// Helper function to get score emoji
function getScoreEmoji(level) {
  switch (level) {
    case 'beginner': return '🌱'
    case 'intermediate': return '🌿'
    case 'advanced': return '🌳'
    default: return '🌿'
  }
}