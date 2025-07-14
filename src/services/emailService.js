import emailjs from '@emailjs/browser'

/**
 * Email Service for ESG Assessment
 * 
 * Handles sending assessment results via EmailJS to both:
 * 1. Customer - Detailed ESG analysis report
 * 2. Bluwave - Lead notification with contact preferences
 * 
 * Uses EmailJS service with Danish language support
 */

// EmailJS configuration - Production Ready
const EMAILJS_CONFIG = {
  serviceId: 'service_d40uip4', // Bluwave EmailJS service
  templateId: 'template_pac9jom', // ESG assessment template
  publicKey: 'BCoUz6Ty8c0oza6pZ' // Public API key
}

// Initialize EmailJS with public key
emailjs.init(EMAILJS_CONFIG.publicKey)

/**
 * Submit ESG assessment and send results via email
 * 
 * @param {Object} data - Assessment submission data
 * @param {Object} data.contact - Contact information
 * @param {Object} data.assessment - Assessment responses
 * @param {number} data.score - Total weighted score (0-17)
 * @param {Object} data.sectionScores - Section breakdown scores
 * @param {Object} data.recommendation - Recommendation based on score
 * @returns {Promise} EmailJS response objects
 */
export const submitAssessment = async (data) => {
  const { contact, assessment, score, sectionScores, recommendation } = data

  // Danish question texts for email formatting
  const questions = [
    'Har I i ledelsen en fælles forståelse af, hvad ESG betyder for jeres virksomhed?',
    'Har I formuleret en holdning til klima, sociale ansvar og governance?',
    'Har I identificeret, hvilke ESG-faktorer der er væsentlige for jeres virksomhed og jeres branche?',
    'Har I konkrete mål for fx CO₂-reduktion, diversitet, medarbejdertrivsel eller ansvarlig leverandørstyring?',
    'Har I processer til at indsamle og dokumentere data om jeres ESG-indsats?',
    'Kommunikerer I allerede i dag om jeres ansvar og resultater – fx på hjemmeside, i tilbud eller i dialog med kunder?',
    'Indgår ESG som en aktiv del af jeres strategi og værdigrundlag?',
    'Har jeres vigtigste kunder eller samarbejdspartnere spurgt ind til jeres ESG-indsats?',
    'Oplever I, at krav til bæredygtighed og ESG i stigende grad er et konkurrenceparameter (f.eks. i udbud, kundekrav, rekruttering og adgang til kapital)?',
    'Ville I kunne dokumentere jeres ESG-arbejde, hvis I blev spurgt i morgen?',
    'Er I klar over, at krav til ESG-rapportering allerede gælder store virksomheder – og at de krav nu bevæger sig ud i leverandørkæden?',
    'Har I overblik over de risici, der kan ramme jeres forretning, hvis I ikke arbejder systematisk med ESG?',
    'Ville det styrke jeres konkurrenceevne, rekruttering og relationer, hvis I kunne vise ansvar og resultater på ESG?'
  ]

  // Format responses for email with visual indicators
  let formattedResponses = ''
  for (let i = 1; i <= 13; i++) {
    const answer = assessment[`q${i}`]
    const answerText = answer === 'ja' ? '✅ Ja' : answer === 'nej' ? '❌ Nej' : '❓ Ved ikke'
    formattedResponses += `${i}. ${questions[i-1]}\n   Svar: ${answerText}\n\n`
  }

  // Industry display mapping (Danish)
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

  // Employee count mapping (Danish)
  const employeeMap = {
    '1-3': '1-3 medarbejdere',
    '4-9': '4-9 medarbejdere',
    '10-49': '10-49 medarbejdere',
    '50-249': '50-249 medarbejdere',
    '250+': '250+ medarbejdere'
  }

  // Prepare customer email data
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
    
    // Assessment results (updated max score to 17)
    total_score: score,
    max_score: 17,
    score_percentage: Math.round((score / 17) * 100),
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

  // Prepare Bluwave notification email data
  const notificationEmailData = {
    // Send to Bluwave
    to_email: 'ja@bluwave.dk',
    to_name: 'Jesper',
    
    // Company information with lead indicator
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
    max_score: 17,
    score_percentage: Math.round((score / 17) * 100),
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
    
    // Additional context
    next_steps: getNextStepsText(recommendation.level),
    score_interpretation: getScoreInterpretation(score),
    
    // Visual elements
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
    
    // Provide user-friendly error messages in Danish
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

/**
 * Generate next steps text based on recommendation level
 * @param {string} level - Recommendation level (beginner/intermediate/advanced)
 * @returns {string} Formatted next steps text
 */
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

/**
 * Generate score interpretation text
 * @param {number} score - Total score (0-17)
 * @returns {string} Score interpretation
 */
function getScoreInterpretation(score) {
  if (score <= 6) {
    return 'I er i startfasen med ESG. Det er helt normalt, og I har gode muligheder for at komme godt i gang.'
  } else if (score <= 12) {
    return 'I har allerede fat i mange af de rigtige ting. Nu handler det om at strukturere og dokumentere jeres arbejde.'
  } else {
    return 'I er godt på vej og foran mange andre SMV\'er. I kan nu fokusere på at optimere og bruge ESG strategisk.'
  }
}

/**
 * Get color for score level
 * @param {string} level - Recommendation level
 * @returns {string} Hex color code
 */
function getScoreColor(level) {
  switch (level) {
    case 'beginner': return '#f59e0b'
    case 'intermediate': return '#10b981'
    case 'advanced': return '#059669'
    default: return '#10b981'
  }
}

/**
 * Get emoji for score level
 * @param {string} level - Recommendation level
 * @returns {string} Emoji character
 */
function getScoreEmoji(level) {
  switch (level) {
    case 'beginner': return '🌱'
    case 'intermediate': return '🌿'
    case 'advanced': return '🌳'
    default: return '🌿'
  }
}