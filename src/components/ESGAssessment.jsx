import React, { useState } from 'react'
import ContactForm from './ContactForm'
import AssessmentQuestions from './AssessmentQuestions'
import ResultsDisplay from './ResultsDisplay'
import { submitAssessment } from '../services/emailService'
import './ESGAssessment.css'

const ESGAssessment = () => {
  const [currentStep, setCurrentStep] = useState('landing')
  const [contactData, setContactData] = useState({})
  const [assessmentData, setAssessmentData] = useState({})
  const [results, setResults] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleStartTest = () => {
    setCurrentStep('contact')
  }

  const handleContactSubmit = (data) => {
    setContactData(data)
    setCurrentStep('assessment')
  }

  const calculateScore = (responses) => {
  const weights = {
    q3: 2,
    q5: 2,
    q8: 2,
    q10: 2,
    q13: 2
  }

  return Object.entries(responses).reduce((sum, [key, value]) => {
    const weight = weights[key] || 1
    return sum + (value === 'ja' ? weight : 0)
  }, 0)
}


  const getRecommendation = (score) => {
    if (score <= 6) {
      return {
        title: 'I er i opstartsfasen',
        text: 'Det er helt naturligt for mange SMV’er, men det bliver vigtigt at komme i gang – både for at imødekomme krav og gribe nye muligheder.',
        cta: '👉 Start med at få overblik: Vælg ét område, hvor I kan sætte et konkret ESG-mål i år.',
        level: 'beginner'
      }
    } else if (score <= 12) {
      return {
        title: 'I har fat i mange af de rigtige ting',
        text: 'Måske uden at kalde det ESG. Det er nu, I skal systematisere arbejdet og begynde at dokumentere det.',
        cta: '👉 Saml jeres ESG-initiativer i ét overblik og beslut jer for, hvad I vil kunne dokumentere om 12 måneder.',
        level: 'intermediate'
      }
    } else {
      return {
        title: 'I er godt i gang',
        text: 'Måske længere end mange andre SMV’er. I har mulighed for at bruge ESG strategisk og differentiere jer.',
        cta: '👉 Tag næste skridt: Overvej at kommunikere jeres ESG-indsats aktivt i tilbud, markedsføring og rekruttering.',
        level: 'advanced'
      }
    }
  }

  const handleAssessmentSubmit = async (data) => {
    setIsSubmitting(true)
    setError('')

    try {
      const score = calculateScore(data)
      const recommendation = getRecommendation(score)

      const submissionData = {
        contact: contactData,
        assessment: data,
        score,
        recommendation
      }

      await submitAssessment(submissionData)

      setAssessmentData(data)
      setResults({ score, recommendation })
      setCurrentStep('results')
    } catch (err) {
      setError('Der opstod en fejl ved indsendelse. Prøv venligst igen.')
      console.error('Submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="esg-assessment">
      {currentStep === 'landing' && (
        <div className="landing-page">
          {/* Logo at the top */}
          <div className="top-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#89B348"/>
              <path d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z" fill="#89B348"/>
              <path d="M5 6L5.5 8.5L8 9L5.5 9.5L5 12L4.5 9.5L2 9L4.5 8.5L5 6Z" fill="#89B348"/>
            </svg>
          </div>

          {/* Main Content */}
          <div className="landing-content">
            <h1>
              Er din virksomhed <br /><span className="esg-highlight">ESG-klar?</span>
            </h1>

            <p className="landing-subtitle">
              Få et hurtigt overblik over jeres ESG-parathed med vores gratis selvtest – og få resultatet tilsendt direkte i din indbakke.
            </p>

            <div className="features-row">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>100% gratis</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>2 minutters test</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <span>Personlig rapport</span>
              </div>
            </div>

            <div className="cta-buttons">
              <button onClick={handleStartTest} className="primary-cta">
                Start ESG-test nu →
              </button>
              {/* <button className="secondary-cta">Læs mere om ESG</button> */}
            </div>
          </div>

          {/* Trust Section */}
          <div className="trust-section">
            <p className="trust-text">Tillid fra virksomheder i hele Danmark</p>
            {/* Fjern eller vis kun ved 4+ logoer */}
            {/* <div className="trust-logos">
              <div className="trust-logo">LOGO</div>
              <div className="trust-logo">LOGO</div>
              <div className="trust-logo">LOGO</div>
              <div className="trust-logo">LOGO</div>
            </div> */}
          </div>
        </div>
      )}

      {currentStep === 'contact' && (
        <div className="form-page">
          <div className="form-header">
            <button onClick={() => setCurrentStep('landing')} className="back-button">
              ← Tilbage til forsiden
            </button>
            <div className="form-title">
              <div className="title-leaf">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#89B348"/>
                </svg>
              </div>
              <span>ESG Selvtest</span>
            </div>
          </div>
          <ContactForm onSubmit={handleContactSubmit} />
        </div>
      )}

      {currentStep === 'assessment' && (
        <div className="form-page">
          <div className="form-header">
            <button onClick={() => setCurrentStep('contact')} className="back-button">
              ← Tilbage til forsiden
            </button>
            <div className="form-title">
              <div className="title-leaf">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#89B348"/>
                </svg>
              </div>
              <span>ESG Selvtest</span>
            </div>
          </div>
          <AssessmentQuestions
            onSubmit={handleAssessmentSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      )}

      {currentStep === 'results' && (
        <div className="form-page">
          <ResultsDisplay
            results={results}
            contactData={contactData}
          />
        </div>
      )}
    </div>
  )
}

export default ESGAssessment
