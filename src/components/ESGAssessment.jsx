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

  const calculateScore = (responses) => {
    return Object.values(responses).filter(answer => answer === 'ja').length
  }

  const getRecommendation = (score) => {
    if (score <= 5) {
      return {
        title: 'I er i startfasen',
        text: 'ESG er nok ikke en topprioritet endnu, men det kan blive det hurtigt. Start med at få overblik og sæt ét konkret mål. Vi anbefaler at begynde med at identificere de mest relevante ESG-faktorer for jeres branche og formulere en grundlæggende holdning til bæredygtighed.',
        level: 'beginner'
      }
    } else if (score <= 9) {
      return {
        title: 'I har fat i mange af de rigtige ting',
        text: 'Måske uden at kalde det ESG. Nu er det tid til at strukturere arbejdet og forberede jer på, at kunder og myndigheder vil kræve mere dokumentation. I har et godt fundament at bygge videre på.',
        level: 'intermediate'
      }
    } else {
      return {
        title: 'I er godt på vej',
        text: 'Måske endda foran mange andre SMV\'er. I har potentiale til at bruge ESG aktivt som en del af jeres strategi og som konkurrencefordel. Fokuser nu på at optimere jeres processer og kommunikation.',
        level: 'advanced'
      }
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
              Er din virksomhed <span className="esg-highlight">ESG-klar?</span>
            </h1>
            
            <p className="landing-subtitle">
              Få et hurtigt overblik over jeres ESG-parathed med vores gratis selvtest.<br />
              Perfekt til små og mellemstore virksomheder der vil være klar til fremtidens krav.
            </p>

            <div className="features-row">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>100% gratis</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>5 minutters test</span>
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
              <button className="secondary-cta">
                Læs mere om ESG
              </button>
            </div>
          </div>

          {/* Trust Section */}
          <div className="trust-section">
            <p className="trust-text">Tillid fra virksomheder i hele Danmark</p>
            <div className="trust-logos">
              <div className="trust-logo">LOGO</div>
              <div className="trust-logo">LOGO</div>
              <div className="trust-logo">LOGO</div>
              <div className="trust-logo">LOGO</div>
            </div>
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