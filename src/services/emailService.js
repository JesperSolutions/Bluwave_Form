import emailjs from '@emailjs/browser'

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_d40uip4',
  templateId: 'template_esg_assessment', // You'll need to create this template in EmailJS
  publicKey: 'YOUR_PUBLIC_KEY' // You'll need to provide this from your EmailJS account
}

// Initialize EmailJS
if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
  emailjs.init(EMAILJS_CONFIG.publicKey)
}

export const submitAssessment = async (data) => {
  const { contact, assessment, score, recommendation } = data

  // Format responses for email
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

  let formattedResponses = ''
  for (let i = 1; i <= 13; i++) {
    const answer = assessment[`q${i}`]
    const answerText = answer === 'ja' ? 'Ja' : answer === 'nej' ? 'Nej' : 'Ved ikke'
    formattedResponses += `${i}. ${questions[i-1]}: ${answerText}\n`
  }

  // Prepare email data
  const emailData = {
    to_email: contact.email,
    to_name: contact.contactPerson,
    company: contact.companyName,
    industry: contact.industry || 'Ikke angivet',
    phone: contact.phone || 'Ikke angivet',
    employees: contact.employees || 'Ikke angivet',
    score: score,
    recommendation_title: recommendation.title,
    recommendation_text: recommendation.text,
    responses: formattedResponses,
    submission_date: new Date().toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  try {
    // Check if EmailJS is properly configured
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
      console.warn('EmailJS not configured. Simulating email send...')
      // Simulate delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Email would be sent with data:', emailData)
      return { status: 'success', message: 'Email simulated successfully' }
    }

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      emailData
    )
    
    console.log('Email sent successfully:', response)
    return response
  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error('Failed to send email')
  }
}