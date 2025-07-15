/**
 * Email Service for ESG Assessment - Dual Email System (Check ID's)
 * 
 * Sends assessment results to both customer and Bluwave:
 * 1. Customer gets professional report with results and recommendations
 * 2. Bluwave gets lead notification with contact details and assessment data
 */

import emailjs from '@emailjs/browser'

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_3q3n4lr',
  templateId: 'template_prjekf7',    // Customer template (new)
  leadTemplateId: 'template_71juzbb', // Lead template (working)
  publicKey: 'lM3RvJE63x4ZIqmwg'
}

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey)

/**
 * Submit ESG assessment - sends emails to both customer and Bluwave
 */
export const submitAssessment = async (data) => {
  const { contact, assessment, score, sectionScores, recommendation } = data

  // Question texts for detailed responses
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

  // Format responses for detailed display
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

  const submissionDate = new Date().toLocaleDateString('da-DK', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Common data for both emails
  const commonData = {
    company_name: contact.companyName,
    contact_person: contact.contactPerson,
    email: contact.email,
    industry: industryMap[contact.industry] || contact.industry || 'Ikke angivet',
    employees: employeeMap[contact.employees] || contact.employees || 'Ikke angivet',
    total_score: score,
    max_score: 17,
    score_percentage: Math.round((score / 17) * 100),
    recommendation_title: recommendation.title,
    recommendation_text: recommendation.text,
    detailed_responses: formattedResponses,
    submission_date: submissionDate,
    next_steps: getNextStepsText(recommendation.level),
    score_color: getScoreColor(recommendation.level),
    score_emoji: getScoreEmoji(recommendation.level)
  }

  // Customer email data (professional report focus)
  const customerEmailData = {
    ...commonData,
    to_email: contact.email,
    phone: contact.phone || 'Ikke angivet',
    may_contact: contact.contactPreference === 'yes' ? 'JA' : 'NEJ',
    contact_preference: contact.contactPreference === 'yes' ? 
      'Ja, I må gerne kontakte mig med rådgivning og tilbud' : 
      'Nej, jeg ønsker kun at modtage resultatet',
    else: contact.contactPreference === 'yes' ? 'contact_wanted' : 'no_contact'
  }

  // Lead notification data (internal Bluwave focus)
  const leadEmailData = {
    ...commonData
    // Lead template has ja@bluwave.dk hardcoded, no to_email needed
  }

  const results = {
    customerEmailSent: false,
    leadEmailSent: false,
    errors: []
  }

  try {
    console.log('📤 Sending dual emails...')

    // Send customer email
    try {
      console.log('📧 Sending customer report email...')
      const customerResponse = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        customerEmailData
      )
      console.log('✅ Customer email sent successfully:', customerResponse)
      results.customerEmailSent = true
      results.customerResponse = customerResponse
    } catch (customerError) {
      console.error('❌ Customer email failed:', customerError)
      console.error('Error details:', {
        status: customerError.status,
        text: customerError.text,
        message: customerError.message
      })
      results.errors.push({
        type: 'customer',
        error: customerError.message || customerError.text || 'Unknown error'
      })
    }

    // Send lead notification (only if customer agreed to contact)
    if (contact.contactPreference === 'yes') {
      try {
        console.log('📧 Sending lead notification email...')
        const leadResponse = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.leadTemplateId,
          leadEmailData
        )
        console.log('✅ Lead notification sent successfully:', leadResponse)
        results.leadEmailSent = true
        results.leadResponse = leadResponse
      } catch (leadError) {
        console.error('❌ Lead notification failed:', leadError)
        console.error('Error details:', {
          status: leadError.status,
          text: leadError.text,
          message: leadError.message
        })
        results.errors.push({
          type: 'lead',
          error: leadError.message || leadError.text || 'Unknown error'
        })
      }
    } else {
      console.log('📧 Customer opted out - no lead notification sent')
    }

    return {
      success: results.customerEmailSent || results.leadEmailSent,
      ...results
    }
    
  } catch (error) {
    console.error('❌ Email system failed:', error)
    
    // Enhanced error handling
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

// Helper function for score interpretation
function getScoreInterpretation(score) {
  if (score <= 6) {
    return 'I er i opstartsfasen. Det er helt naturligt for mange SMV\'er, men det bliver vigtigt at komme i gang – både for at imødekomme krav og gribe nye muligheder.'
  } else if (score <= 12) {
    return 'I har fat i mange af de rigtige ting – måske uden at kalde det ESG. Det er nu, I skal systematisere arbejdet og begynde at dokumentere det.'
  } else {
    return 'I er godt i gang – måske længere end mange andre SMV\'er. I har mulighed for at bruge ESG strategisk og differentiere jer.'
  }
}
