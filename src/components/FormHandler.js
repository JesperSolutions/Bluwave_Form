import emailjs from '@emailjs/browser'

// EmailJS configuration - Replace with your actual values
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  publicKey: 'YOUR_PUBLIC_KEY'
}

export function initializeForm() {
  const form = document.getElementById('esg-assessment-form')
  const submitBtn = document.getElementById('submit-btn')
  const messageDiv = document.getElementById('form-message')
  const resultSection = document.getElementById('result-section')

  // Initialize EmailJS
  emailjs.init(EMAILJS_CONFIG.publicKey)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    // Show loading state
    showLoading(submitBtn)
    clearMessage(messageDiv)

    try {
      // Collect form data
      const formData = new FormData(form)
      const responses = {}
      
      // Collect contact information
      const contactInfo = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || 'Ikke angivet',
        company: formData.get('company'),
        position: formData.get('position') || 'Ikke angivet',
        companySize: formData.get('companySize') || 'Ikke angivet'
      }

      // Collect assessment responses
      for (let i = 1; i <= 13; i++) {
        responses[`q${i}`] = formData.get(`q${i}`)
      }

      // Calculate score
      const score = calculateScore(responses)
      const recommendation = getRecommendation(score)

      // Prepare email data
      const emailData = {
        to_email: contactInfo.email,
        to_name: `${contactInfo.firstName} ${contactInfo.lastName}`,
        company: contactInfo.company,
        position: contactInfo.position,
        phone: contactInfo.phone,
        company_size: contactInfo.companySize,
        score: score,
        recommendation_title: recommendation.title,
        recommendation_text: recommendation.text,
        responses: formatResponses(responses),
        submission_date: new Date().toLocaleDateString('da-DK')
      }

      // Send email via EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        emailData
      )

      // Show success message
      showSuccess(messageDiv)
      
      // Display results
      displayResults(resultSection, score, recommendation, contactInfo)
      
      // Hide form
      form.style.display = 'none'

    } catch (error) {
      console.error('Error submitting form:', error)
      showError(messageDiv, 'Der opstod en fejl ved indsendelse af formularen. Prøv venligst igen.')
    } finally {
      hideLoading(submitBtn)
    }
  })
}

function calculateScore(responses) {
  let score = 0
  Object.values(responses).forEach(answer => {
    if (answer === 'ja') score += 1
  })
  return score
}

function getRecommendation(score) {
  if (score <= 5) {
    return {
      title: 'I er i startfasen',
      text: 'ESG er nok ikke en topprioritet endnu, men det kan blive det hurtigt. Start med at få overblik og sæt ét konkret mål. Vi anbefaler at begynde med at identificere de mest relevante ESG-faktorer for jeres branche og formulere en grundlæggende holdning til bæredygtighed.'
    }
  } else if (score <= 9) {
    return {
      title: 'I har fat i mange af de rigtige ting',
      text: 'Måske uden at kalde det ESG. Nu er det tid til at strukturere arbejdet og forberede jer på, at kunder og myndigheder vil kræve mere dokumentation. I har et godt fundament at bygge videre på.'
    }
  } else {
    return {
      title: 'I er godt på vej',
      text: 'Måske endda foran mange andre SMV\'er. I har potentiale til at bruge ESG aktivt som en del af jeres strategi og som konkurrencefordel. Fokuser nu på at optimere jeres processer og kommunikation.'
    }
  }
}

function formatResponses(responses) {
  const questions = [
    'Fælles forståelse af ESG i ledelsen',
    'Formuleret holdning til klima, sociale ansvar og governance',
    'Identificeret væsentlige ESG-faktorer',
    'Konkrete mål for ESG-områder',
    'Processer til dataindsamling og dokumentation',
    'Kommunikation om ansvar og resultater',
    'ESG som del af strategi og værdigrundlag',
    'Kunders/partneres interesse for ESG-indsats',
    'ESG som konkurrenceparameter',
    'Evne til at dokumentere ESG-arbejde',
    'Kendskab til ESG-rapporteringskrav',
    'Overblik over ESG-relaterede risici',
    'ESG som styrke for brand og relationer'
  ]

  let formatted = ''
  for (let i = 1; i <= 13; i++) {
    const answer = responses[`q${i}`]
    const answerText = answer === 'ja' ? 'Ja' : answer === 'nej' ? 'Nej' : 'Ved ikke'
    formatted += `${i}. ${questions[i-1]}: ${answerText}\n`
  }
  return formatted
}

function showLoading(button) {
  button.disabled = true
  button.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <span>Sender...</span>
    </div>
  `
}

function hideLoading(button) {
  button.disabled = false
  button.innerHTML = '<span class="btn-text">Få mit ESG-resultat</span>'
}

function showSuccess(messageDiv) {
  messageDiv.innerHTML = `
    <div class="success-message">
      ✅ Tak for din deltagelse! Du vil modtage dit personlige ESG-resultat på email inden for få minutter.
    </div>
  `
}

function showError(messageDiv, message) {
  messageDiv.innerHTML = `
    <div class="error-message">
      ❌ ${message}
    </div>
  `
}

function clearMessage(messageDiv) {
  messageDiv.innerHTML = ''
}

function displayResults(resultSection, score, recommendation, contactInfo) {
  resultSection.style.display = 'block'
  resultSection.innerHTML = `
    <div class="result-section">
      <h2 class="result-title">Dit ESG-resultat, ${contactInfo.firstName}</h2>
      
      <div class="score-display">
        <div class="score-number">${score}</div>
        <div class="score-label">ud af 13 point</div>
      </div>
      
      <div class="recommendation">
        <h3>${recommendation.title}</h3>
        <p>${recommendation.text}</p>
      </div>
      
      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--light-blue); border-radius: 8px; text-align: center;">
        <p style="color: var(--primary-blue); font-weight: 500; margin-bottom: 1rem;">
          📧 En detaljeret analyse er sendt til ${contactInfo.email}
        </p>
        <p style="color: var(--text-medium); font-size: 0.875rem;">
          Hvis du ikke modtager emailen inden for 10 minutter, tjek venligst din spam-mappe.
        </p>
      </div>
    </div>
  `
  
  // Scroll to results
  resultSection.scrollIntoView({ behavior: 'smooth' })
}