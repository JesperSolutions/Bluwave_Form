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
          {/* Leaf Icon */}
          <div className="leaf-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8.1 20C11.5 20 14.2 16.5 14.2 12.1V12C14.2 10.7 14.7 9.5 15.5 8.5L17 8Z" fill="#89B348"/>
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
            <div className="trust-leaf">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8.1 20C11.5 20 14.2 16.5 14.2 12.1V12C14.2 10.7 14.7 9.5 15.5 8.5L17 8Z" fill="#89B348"/>
              </svg>
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
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8.1 20C11.5 20 14.2 16.5 14.2 12.1V12C14.2 10.7 14.7 9.5 15.5 8.5L17 8Z" fill="#89B348"/>
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
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8.1 20C11.5 20 14.2 16.5 14.2 12.1V12C14.2 10.7 14.7 9.5 15.5 8.5L17 8Z" fill="#89B348"/>
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