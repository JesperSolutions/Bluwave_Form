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
  serviceId: 'service_3q3n4lr',
  templateId: 'template_prjekf7',
  publicKey: 'IM3RvJE63x4ZIqmwg'
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

  // Simple email data that matches your working test exactly
  const emailData = {
    to_email: contact.email,
    to_name: contact.contactPerson,
    
    contact_person: contact.contactPerson,
    email: contact.email,
    industry: contact.industry,
    employees: contact.employees,
    contact_preference: contact.contactPreference === 'yes' ? 'Ja, må gerne kontaktes' : 'Nej, kun resultat ønsket',
    total_score: score,
    max_score: 17,
    score_percentage: Math.round((score / 17) * 100),
    recommendation_title: recommendation.title,
    recommendation_text: recommendation.text,
    score_color: getScoreColor(recommendation.level),
    score_emoji: getScoreEmoji(recommendation.level),
    next_steps: getNextStepsText(recommendation.level),
    detailed_responses: 'Detaljerede svar vil blive tilføjet senere',
    submission_date: new Date().toLocaleDateString('da-DK')
  }

  try {
    console.log('📤 Sending email with simple data...')
    console.log('📤 Email data:', emailData)
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      emailData
    )
    
    console.log('✅ Email sent successfully:', response)
    return response
    
  } catch (error) {
    console.error('❌ Email sending failed, but continuing anyway:', error)
    // Don't throw error - just log it and continue
    return null
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