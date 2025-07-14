import emailjs from '@emailjs/browser'

/**
 * Email Service for ESG Assessment - Lead Notification Only
 * 
 * Sends assessment results to Bluwave as lead notifications.
 * Customers can download their results or email them manually.
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
 * Submit ESG assessment - sends lead notification to Bluwave only
 * Customer gets results on screen and can download/email themselves
 */
export const submitAssessment = async (data) => {
  const { contact, assessment, score, sectionScores, recommendation } = data

  // Only send if customer agreed to be contacted
  if (contact.contactPreference !== 'yes') {
    console.log('📧 Customer opted out of contact - no email sent')
    return { success: true, emailSent: false }
  }

  // Danish question texts for lead notification
  const questions = [
    'Har I i ledelsen en fælles forståelse af, hvad ESG betyder for jeres virksomhed?',
    'Har I formuleret en holdning til klima, socialt ansvar og governance?',
    'Har I identificeret, hvilke ESG-faktorer der er væsentlige for jeres virksomhed og jeres branche?',
    'Har I konkrete mål for fx CO₂-reduktion, diversitet, medarbejdertrivsel og ansvarlig leverandørstyring?',
    'Har I processer til at indsamle og dokumentere data om jeres ESG-indsats?',
    'Kommunikerer I allerede i dag om jeres ansvar og resultater – fx på hjemmeside, i tilbud eller i dialog med kunder?',
    'Indgår ESG som en aktiv del af jeres strategi og værdigrundlag?',
    'Har jeres vigtigste kunder eller samarbejdspartnere spurgt ind til jeres ESG-indsats?',
    'Oplever I, at krav til bæredygtighed og ESG i stigende grad er et konkurrenceparameter?',
    'Ville I kunne dokumentere jeres ESG-arbejde, hvis I blev spurgt i morgen?',
    'Er I klar over, at krav til ESG-rapportering allerede gælder store virksomheder?',
    'Har I overblik over de risici, der kan ramme jeres forretning, hvis I ikke arbejder systematisk med ESG?',
    'Ville det styrke jeres konkurrenceevne, rekruttering og relationer, hvis I kunne vise ansvar og resultater på ESG?'
  ]

  // Format responses for lead notification
  let formattedResponses = ''
  for (let i = 1; i <= 13; i++) {
    const answer = assessment[`q${i}`]
    const answerText = answer === 'ja' ? '✅ Ja' : answer === 'nej' ? '❌ Nej' : '❓ Ved ikke'
    formattedResponses += `${i}. ${questions[i-1]}\n   Svar: ${answerText}\n\n`
  }

  // Industry and employee mapping
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
    '1-3': '1-3 medarbejdere',
    '4-9': '4-9 medarbejdere', 
    '10-49': '10-49 medarbejdere',
    '50-249': '50-249 medarbejdere',
    '250+': '250+ medarbejdere'
  }

  // Lead notification email to Bluwave
  const leadNotificationData = {
    // This goes to ja@bluwave.dk (configured in EmailJS)
    company_name: `🚨 NYT LEAD: ${contact.companyName}`,
    contact_person: contact.contactPerson,
    email: contact.email,
    phone: contact.phone || 'Ikke angivet',
    industry: industryMap[contact.industry] || contact.industry || 'Ikke angivet',
    employees: employeeMap[contact.employees] || contact.employees || 'Ikke angivet',
    
    // Highlight contact preference
    contact_preference: '🟢 JA - ØNSKER KONTAKT',
    
    // Assessment results
    total_score: score,
    max_score: 17,
    score_percentage: Math.round((score / 17) * 100),
    recommendation_title: recommendation.title,
    recommendation_text: recommendation.text,
    
    // Detailed responses for lead qualification
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
    
    // Next steps for lead follow-up
    next_steps: getNextStepsText(recommendation.level),
    
    // Visual elements
    score_color: getScoreColor(recommendation.level),
    score_emoji: getScoreEmoji(recommendation.level)
  }

  try {
    console.log('📤 Sending lead notification to Bluwave...')
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      leadNotificationData
    )
    
    console.log('✅ Lead notification sent successfully:', response)
    return { success: true, emailSent: true, response }
    
  } catch (error) {
    console.error('❌ Lead notification failed:', error)
    // Don't throw - user should still see results
    return { success: true, emailSent: false, error: error.message }
  }
}

/**
 * Generate downloadable results data for customer
 */
export const generateDownloadableResults = (data) => {
  const { contact, assessment, score, sectionScores, recommendation } = data
  
  const questions = [
    'Har I i ledelsen en fælles forståelse af, hvad ESG betyder for jeres virksomhed?',
    'Har I formuleret en holdning til klima, socialt ansvar og governance?',
    'Har I identificeret, hvilke ESG-faktorer der er væsentlige for jeres virksomhed og jeres branche?',
    'Har I konkrete mål for fx CO₂-reduktion, diversitet, medarbejdertrivsel og ansvarlig leverandørstyring?',
    'Har I processer til at indsamle og dokumentere data om jeres ESG-indsats?',
    'Kommunikerer I allerede i dag om jeres ansvar og resultater – fx på hjemmeside, i tilbud eller i dialog med kunder?',
    'Indgår ESG som en aktiv del af jeres strategi og værdigrundlag?',
    'Har jeres vigtigste kunder eller samarbejdspartnere spurgt ind til jeres ESG-indsats?',
    'Oplever I, at krav til bæredygtighed og ESG i stigende grad er et konkurrenceparameter?',
    'Ville I kunne dokumentere jeres ESG-arbejde, hvis I blev spurgt i morgen?',
    'Er I klar over, at krav til ESG-rapportering allerede gælder store virksomheder?',
    'Har I overblik over de risici, der kan ramme jeres forretning, hvis I ikke arbejder systematisk med ESG?',
    'Ville det styrke jeres konkurrenceevne, rekruttering og relationer, hvis I kunne vise ansvar og resultater på ESG?'
  ]

  // Create comprehensive results object
  return {
    company: {
      name: contact.companyName,
      contactPerson: contact.contactPerson,
      email: contact.email,
      phone: contact.phone,
      industry: contact.industry,
      employees: contact.employees
    },
    results: {
      totalScore: score,
      maxScore: 17,
      percentage: Math.round((score / 17) * 100),
      level: recommendation.level,
      title: recommendation.title,
      description: recommendation.text,
      nextSteps: getNextStepsText(recommendation.level)
    },
    sectionBreakdown: sectionScores,
    detailedAnswers: questions.map((question, index) => ({
      question,
      answer: assessment[`q${index + 1}`] || 'Ikke besvaret'
    })),
    generatedAt: new Date().toISOString(),
    submissionDate: new Date().toLocaleDateString('da-DK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Helper functions
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

function getScoreColor(level) {
  switch (level) {
    case 'beginner': return '#f59e0b'
    case 'intermediate': return '#10b981'
    case 'advanced': return '#059669'
    default: return '#10b981'
  }
}

function getScoreEmoji(level) {
  switch (level) {
    case 'beginner': return '🌱'
    case 'intermediate': return '🌿'
    case 'advanced': return '🌳'
    default: return '🌿'
  }
}