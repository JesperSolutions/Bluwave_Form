import emailjs from '@emailjs/browser'

/**
 * Email Service for ESG Assessment
 * 
 * Handles sending assessment results via EmailJS to both:
 * 1. Customer - Detailed ESG analysis report
 * 2. Bluwave - Lead notification with contact preferences
 * 
 * Features:
 * - Dual email system (customer + lead notification)
 * - Industry-specific recommendations
 * - Detailed question responses
 * - Contact preference handling
 * - Danish language support
 */

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_3q3n4lr',
  templateId: 'template_prjekf7',
  publicKey: 'IM3RvJE63x4ZIqmwg'
}

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey)

/**
 * Industry mappings for display
 */
const INDUSTRY_NAMES = {
  byggeri: 'Byggeri og anlæg',
  energi: 'Energi og forsyning',
  finans: 'Finans og forsikring',
  handel: 'Handel og detailhandel',
  industri: 'Industri og produktion',
  it: 'IT og teknologi',
  konsulent: 'Konsulent og rådgivning',
  landbrug: 'Landbrug og fødevarer',
  logistik: 'Logistik og transport',
  sundhed: 'Sundhed og social',
  turisme: 'Turisme og oplevelser',
  anden: 'Anden branche'
}

/**
 * Employee count mappings for display
 */
const EMPLOYEE_COUNTS = {
  '1-3': '1-3 medarbejdere',
  '4-9': '4-9 medarbejdere',
  '10-49': '10-49 medarbejdere',
  '50-249': '50-249 medarbejdere',
  '250+': '250+ medarbejdere'
}

/**
 * Assessment questions for detailed responses
 */
const ASSESSMENT_QUESTIONS = [
  'Har I i ledelsen en fælles forståelse af, hvad ESG betyder for jeres virksomhed?',
  'Har I formuleret en holdning til klima, socialt ansvar og governance?',
  'Har I identificeret, hvilke ESG-faktorer der er væsentlige for jeres virksomhed og jeres branche?',
  'Har I konkrete mål for fx CO₂-reduktion, diversitet, medarbejdertrivsel og ansvarlig leverandørstyring?',
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

/**
 * Submit ESG assessment and send results via email
 * 
 * @param {Object} data - Assessment submission data
 * @returns {Promise} EmailJS response objects
 */
export const submitAssessment = async (data) => {
  const { contact, assessment, score, sectionScores, recommendation } = data

  try {
    console.log('📤 Starting email sending process...')

    // Prepare common email data
    const baseEmailData = prepareEmailData(contact, assessment, score, recommendation)
    
    // Send customer email (if they want it)
    let customerResponse = null
    if (contact.contactPreference === 'yes' || contact.contactPreference === 'no') {
      // Always send to customer - they completed the assessment
      customerResponse = await sendCustomerEmail(baseEmailData, contact.email)
    }

    // Send Bluwave notification
    const bluewaveResponse = await sendBluewaveNotification(baseEmailData, contact)

    console.log('✅ Email sending completed successfully')
    return { customerResponse, bluewaveResponse }

  } catch (error) {
    console.error('⚠️ Email sending failed, but continuing anyway:', error)
    // Don't throw - let user see results regardless
    return null
  }
}

/**
 * Prepare base email data with all variables
 */
function prepareEmailData(contact, assessment, score, recommendation) {
  return {
    company_name: contact.companyName,
    contact_person: contact.contactPerson,
    email: contact.email,
    industry: INDUSTRY_NAMES[contact.industry] || contact.industry || 'Ikke angivet',
    employees: EMPLOYEE_COUNTS[contact.employees] || contact.employees || 'Ikke angivet',
    contact_preference: contact.contactPreference === 'yes' 
      ? 'Ja, må gerne kontaktes med rådgivning og tilbud'
      : 'Nej, ønsker kun at modtage resultatet',
    total_score: score,
    max_score: 17,
    score_percentage: Math.round((score / 17) * 100),
    recommendation_title: recommendation.title,
    recommendation_text: recommendation.text,
    score_color: getScoreColor(recommendation.level),
    score_emoji: getScoreEmoji(recommendation.level),
    next_steps: getIndustrySpecificNextSteps(recommendation.level, contact.industry),
    detailed_responses: generateDetailedResponses(assessment),
    submission_date: new Date().toLocaleDateString('da-DK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

/**
 * Send email to customer
 */
async function sendCustomerEmail(emailData, customerEmail) {
  console.log('📧 Sending customer email to:', customerEmail)
  
  const customerData = {
    ...emailData,
    to_email: customerEmail
  }

  const response = await emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    customerData
  )
  
  console.log('✅ Customer email sent successfully')
  return response
}

/**
 * Send notification to Bluwave
 */
async function sendBluewaveNotification(emailData, contact) {
  console.log('📧 Sending Bluwave notification...')
  
  const bluewaveData = {
    ...emailData,
    to_email: 'ja@bluwave.dk',
    company_name: `[LEAD] ${contact.companyName}`,
    contact_preference: contact.contactPreference === 'yes' 
      ? '🟢 JA - KONTAKT ØNSKET'
      : '🔴 NEJ - Kun resultat ønsket'
  }

  const response = await emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    bluewaveData
  )
  
  console.log('✅ Bluwave notification sent successfully')
  return response
}

/**
 * Generate detailed responses for all questions
 */
function generateDetailedResponses(assessment) {
  let detailedText = ''
  
  for (let i = 1; i <= 13; i++) {
    const questionKey = `q${i}`
    const answer = assessment[questionKey]
    const question = ASSESSMENT_QUESTIONS[i - 1]
    
    detailedText += `${i}. ${question}\n`
    detailedText += `   Svar: ${formatAnswer(answer)}\n\n`
  }
  
  return detailedText
}

/**
 * Format answer for display
 */
function formatAnswer(answer) {
  switch (answer) {
    case 'ja': return '✅ Ja'
    case 'nej': return '❌ Nej'
    case 'ved_ikke': return '❓ Ved ikke'
    default: return '❓ Ikke besvaret'
  }
}

/**
 * Generate industry-specific next steps
 */
function getIndustrySpecificNextSteps(level, industry) {
  const baseSteps = getBaseNextSteps(level)
  const industrySteps = getIndustrySpecificSteps(industry, level)
  
  return baseSteps + (industrySteps ? `\n\n🏭 Branche-specifikke anbefalinger:\n${industrySteps}` : '')
}

/**
 * Get base next steps by level
 */
function getBaseNextSteps(level) {
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
 * Get industry-specific recommendations
 */
function getIndustrySpecificSteps(industry, level) {
  const industryRecommendations = {
    byggeri: {
      beginner: '• Fokuser på materialevalg og affaldshåndtering\n• Undersøg certificeringsordninger som DGNB eller BREEAM',
      intermediate: '• Implementer CO₂-beregninger for projekter\n• Etabler leverandørkrav for bæredygtige materialer',
      advanced: '• Udvikl cirkulære forretningsmodeller\n• Bliv certificeret som bæredygtig byggevirksomhed'
    },
    energi: {
      beginner: '• Kortlæg jeres energimix og CO₂-aftryk\n• Sæt mål for vedvarende energi',
      intermediate: '• Implementer energiledelsessystemer\n• Rapporter på EU-taksonomi krav',
      advanced: '• Udvikl grønne energiløsninger\n• Integrer ESG i investeringsbeslutninger'
    },
    it: {
      beginner: '• Mål energiforbrug i datacentre\n• Implementer grøn IT-politik',
      intermediate: '• Optimér servereffektivitet og cloud-forbrug\n• Etabler bæredygtige indkøbspolitikker',
      advanced: '• Udvikl ESG-tech løsninger for kunder\n• Bliv carbon neutral virksomhed'
    },
    finans: {
      beginner: '• Kortlæg ESG-risici i portefølje\n• Implementer ESG-screening',
      intermediate: '• Udvikl ESG-investeringsprodukter\n• Rapporter på SFDR krav',
      advanced: '• Integrer klimarisiko i alle beslutninger\n• Bliv førende på sustainable finance'
    }
  }

  return industryRecommendations[industry]?.[level] || null
}

/**
 * Get color for score level
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
 */
function getScoreEmoji(level) {
  switch (level) {
    case 'beginner': return '🌱'
    case 'intermediate': return '🌿'
    case 'advanced': return '🌳'
    default: return '🌿'
  }
}