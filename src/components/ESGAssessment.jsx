import React, { useState } from 'react'
import ContactForm from './ContactForm'
import AssessmentQuestions from './AssessmentQuestions'
import ResultsDisplay from './ResultsDisplay'
import { submitAssessment, generateDownloadableResults } from '../services/emailService'
import './ESGAssessment.css'

/**
 * Main ESG Assessment Component
 * 
 * This component manages the entire ESG assessment flow:
 * 1. Landing page with introduction
 * 2. Contact form for company information
 * 3. Assessment questions (13 questions across 4 sections)
 * 4. Results display with scoring and recommendations
 * 
 * Features:
 * - Multi-step form with progress tracking
 * - Weighted scoring system (17 points max)
 * - Section-based results breakdown
 * - Email delivery of results
 * - Responsive design
 */
const ESGAssessment = () => {
  // State management for the multi-step form
  const [currentStep, setCurrentStep] = useState('landing')
  const [contactData, setContactData] = useState({})
  const [assessmentData, setAssessmentData] = useState({})
  const [results, setResults] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [downloadableData, setDownloadableData] = useState(null)

  /**
   * Navigate from landing page to contact form
   */
  const handleStartTest = () => {
    setCurrentStep('contact')
  }

  /**
   * Handle contact form submission and proceed to assessment
   * @param {Object} data - Contact form data
   */
  const handleContactSubmit = (data) => {
    setContactData(data)
    setCurrentStep('assessment')
  }

  /**
   * Calculate total score using weighted system
   * Critical questions (Q3, Q5, Q8, Q10) have weight 2, others weight 1
   * Maximum possible score: 17 points
   * 
   * @param {Object} responses - Assessment responses object
   * @returns {number} Total weighted score
   */
  const calculateScore = (responses) => {
    // Critical questions with double weight
    const weights = {
      q3: 2,  // Identificeret væsentlige ESG-faktorer
      q5: 2,  // Processer til dataindsamling
      q8: 2,  // Kunder spurgt ind til ESG
      q10: 2  // Kunne dokumentere ESG-arbejdet
    }

    return Object.entries(responses).reduce((sum, [key, value]) => {
      const weight = weights[key] || 1
      return sum + (value === 'ja' ? weight : 0)
    }, 0)
  }

  /**
   * Calculate scores for each of the 4 sections
   * Section 1: Forståelse og bevidsthed (Q1-3, max 4 points)
   * Section 2: Mål og data (Q4-6, max 4 points)
   * Section 3: Strategi og forretning (Q7-9, max 4 points)
   * Section 4: Risici og fremtidssikring (Q10-13, max 5 points)
   * 
   * @param {Object} responses - Assessment responses object
   * @returns {Object} Section scores with percentages
   */
  const calculateSectionScores = (responses) => {
    const sections = {
      section1: { questions: ['q1', 'q2', 'q3'], weights: { q3: 2 }, max: 4 },
      section2: { questions: ['q4', 'q5', 'q6'], weights: { q5: 2 }, max: 4 },
      section3: { questions: ['q7', 'q8', 'q9'], weights: { q8: 2 }, max: 4 },
      section4: { questions: ['q10', 'q11', 'q12', 'q13'], weights: { q10: 2 }, max: 5 }
    }

    const sectionScores = {}
    Object.entries(sections).forEach(([sectionKey, section]) => {
      let score = 0
      section.questions.forEach(questionKey => {
        if (responses[questionKey] === 'ja') {
          const weight = section.weights[questionKey] || 1
          score += weight
        }
      })
      sectionScores[sectionKey] = {
        score,
        max: section.max,
        percentage: Math.round((score / section.max) * 100)
      }
    })
    return sectionScores
  }

  /**
   * Generate recommendation based on total score
   * Score ranges:
   * - 0-6: Beginner (opstartsfasen)
   * - 7-12: Intermediate (har fat i tingene)
   * - 13-17: Advanced (godt i gang)
   * 
   * @param {number} score - Total weighted score
   * @returns {Object} Recommendation object with title, text, CTA, and level
   */
  const getRecommendation = (score) => {
    if (score <= 6) {
      return {
        title: 'I er i opstartsfasen',
        text: 'Det er helt naturligt for mange SMV\'er, men det bliver vigtigt at komme i gang – både for at imødekomme krav og gribe nye muligheder.',
        cta: 'Start med at få overblik: Vælg ét område, hvor I kan sætte et konkret ESG-mål i år.',
        level: 'beginner'
      }
    } else if (score <= 12) {
      return {
        title: 'I har fat i mange af de rigtige ting',
        text: 'Måske uden at kalde det ESG. Det er nu, I skal systematisere arbejdet og begynde at dokumentere det.',
        cta: 'Saml jeres ESG-initiativer i ét overblik og beslut jer for, hvad I vil kunne dokumentere om 12 måneder.',
        level: 'intermediate'
      }
    } else {
      return {
        title: 'I er godt i gang',
        text: 'Måske længere end mange andre SMV\'er. I har mulighed for at bruge ESG strategisk og differentiere jer.',
        cta: 'Tag næste skridt: Overvej at kommunikere jeres ESG-indsats aktivt i tilbud, branding og rekruttering.',
        level: 'advanced'
      }
    }
  }

  /**
   * Handle final assessment submission
   * Calculates scores, generates recommendations, and sends email
   * Always shows results to user, regardless of email success/failure
   * 
   * @param {Object} data - Assessment responses
   */
  const handleAssessmentSubmit = async (data) => {
    setIsSubmitting(true)
    setError('')

    try {
      // Calculate all scores and recommendations
      const score = calculateScore(data)
      const sectionScores = calculateSectionScores(data)
      const recommendation = getRecommendation(score)

      // Prepare submission data
      const submissionData = {
        contact: contactData,
        assessment: data,
        score,
        sectionScores,
        recommendation
      }

      // Try to send email, but don't fail if it doesn't work
      let emailResult = { emailSent: false }
      try {
        emailResult = await submitAssessment(submissionData)
        console.log('✅ Assessment submitted:', emailResult)
      } catch (emailError) {
        console.error('⚠️ Lead notification failed, but showing results anyway:', emailError)
      }

      // Generate downloadable data for customer
      const downloadData = generateDownloadableResults(submissionData)
      setDownloadableData(downloadData)

      // Update state and show results
      setAssessmentData(data)
      setResults({ score, sectionScores, recommendation })
      setCurrentStep('results')
    } catch (err) {
      // This should rarely happen since we don't throw email errors
      console.error('Submission error:', err)
      setError('Der opstod en fejl ved indsendelse. Prøv venligst igen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render current step
  return (
    <div className="esg-assessment">
      {/* Landing Page - Introduction and CTA */}
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
              Få et hurtigt overblik over jeres ESG-parathed med vores gratis selvtest og få resultatet tilsendt direkte i din indbakke.
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
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Step */}
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

      {/* Assessment Questions Step */}
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

      {/* Results Display Step */}
      {currentStep === 'results' && (
        <div className="form-page">
          <ResultsDisplay
            results={results}
            contactData={contactData}
            downloadableData={downloadableData}
          />
        </div>
      )}
    </div>
  )
}

export default ESGAssessment