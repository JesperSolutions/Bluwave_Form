import React, { useState } from 'react'
import ContactForm from './ContactForm'
import FestivalQuestions from './FestivalQuestions'
import FestivalResults from './FestivalResults'
import { submitFestivalFeedback } from '../services/emailService'
import './FestivalAssessment.css'

const FestivalAssessment = () => {
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
      const score = calculateCompatibilityScore(data)
      const recommendations = getFestivalRecommendations(data, score)
      const submissionId = generateSubmissionId()
      
      const submissionData = {
        contact: contactData,
        assessment: data,
        score,
        recommendations,
        submissionId,
        timestamp: new Date().toISOString()
      }

      await submitFestivalFeedback(submissionData)
      
      setAssessmentData(data)
      setResults({ score, recommendations, submissionId })
      setCurrentStep('results')
    } catch (err) {
      setError('Der opstod en fejl ved indsendelse. Prøv venligst igen.')
      console.error('Submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateCompatibilityScore = (responses) => {
    let score = 0
    const weights = {
      music_preference: 3,
      crowd_size: 2,
      budget: 2,
      duration: 1,
      accommodation: 1,
      activities: 2,
      food_preference: 1,
      travel_distance: 1,
      weather_preference: 1,
      experience_level: 1
    }

    Object.entries(responses).forEach(([key, value]) => {
      if (weights[key]) {
        // Calculate score based on preference alignment
        score += weights[key] * getPreferenceScore(key, value)
      }
    })

    return Math.min(Math.round((score / 45) * 100), 100) // Normalize to 0-100
  }

  const getPreferenceScore = (category, value) => {
    // Scoring logic based on festival compatibility
    const scoringMatrix = {
      music_preference: {
        'electronic': 3,
        'rock': 3,
        'pop': 2,
        'indie': 2,
        'jazz': 1,
        'classical': 1
      },
      crowd_size: {
        'intimate': 2,
        'medium': 3,
        'large': 2,
        'massive': 1
      },
      budget: {
        'budget': 1,
        'moderate': 3,
        'premium': 2,
        'luxury': 1
      }
    }

    return scoringMatrix[category]?.[value] || 2
  }

  const getFestivalRecommendations = (responses, score) => {
    const festivals = []
    
    // Music-based recommendations
    if (responses.music_preference === 'electronic') {
      festivals.push({
        name: 'Distortion Festival',
        location: 'København',
        match: 95,
        reason: 'Perfekt match for elektronisk musik og street party atmosfære'
      })
    }
    
    if (responses.music_preference === 'rock') {
      festivals.push({
        name: 'Copenhell',
        location: 'København',
        match: 92,
        reason: 'Danmarks største metal og rock festival'
      })
    }

    if (responses.crowd_size === 'intimate') {
      festivals.push({
        name: 'Heartland Festival',
        location: 'Egeskov',
        match: 88,
        reason: 'Intimt festival med fokus på kvalitet og oplevelser'
      })
    }

    // Default recommendations if no specific matches
    if (festivals.length === 0) {
      festivals.push(
        {
          name: 'Roskilde Festival',
          location: 'Roskilde',
          match: 85,
          reason: 'Danmarks største og mest alsidige festival'
        },
        {
          name: 'Smukfest',
          location: 'Skanderborg',
          match: 80,
          reason: 'Hyggelig festival i smukke omgivelser'
        }
      )
    }

    return festivals.slice(0, 3) // Return top 3 recommendations
  }

  const generateSubmissionId = () => {
    return 'FEST-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase()
  }

  return (
    <div className="festival-assessment">
      {currentStep === 'landing' && (
        <div className="landing-page">
          <div className="top-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#FF6B6B"/>
              <path d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z" fill="#4ECDC4"/>
              <path d="M5 6L5.5 8.5L8 9L5.5 9.5L5 12L4.5 9.5L2 9L4.5 8.5L5 6Z" fill="#45B7D1"/>
            </svg>
          </div>

          <div className="landing-content">
            <h1>
              Find dit <span className="festival-highlight">perfekte festival</span>
            </h1>
            
            <p className="landing-subtitle">
              Få personlige festival anbefalinger baseret på dine præferencer.<br />
              Svar på få spørgsmål og find dit næste festival eventyr.
            </p>

            <div className="features-row">
              <div className="feature-item">
                <div className="feature-icon">🎵</div>
                <span>Personlige anbefalinger</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>3 minutters test</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <span>Kompatibilitetsscore</span>
              </div>
            </div>

            <div className="cta-buttons">
              <button onClick={handleStartTest} className="primary-cta">
                Find mit festival →
              </button>
              <button className="secondary-cta">
                Se alle festivaler
              </button>
            </div>
          </div>

          <div className="trust-section">
            <p className="trust-text">Betroet af festival-elskere i hele Danmark</p>
            <div className="trust-logos">
              <div className="trust-logo">ROSKILDE</div>
              <div className="trust-logo">SMUKFEST</div>
              <div className="trust-logo">DISTORTION</div>
              <div className="trust-logo">COPENHELL</div>
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
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#FF6B6B"/>
                </svg>
              </div>
              <span>Festival Finder</span>
            </div>
          </div>
          <ContactForm onSubmit={handleContactSubmit} />
        </div>
      )}
      
      {currentStep === 'assessment' && (
        <div className="form-page">
          <div className="form-header">
            <button onClick={() => setCurrentStep('contact')} className="back-button">
              ← Tilbage til kontaktinfo
            </button>
            <div className="form-title">
              <div className="title-leaf">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#FF6B6B"/>
                </svg>
              </div>
              <span>Festival Finder</span>
            </div>
          </div>
          <FestivalQuestions 
            onSubmit={handleAssessmentSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      )}
      
      {currentStep === 'results' && (
        <div className="form-page">
          <FestivalResults 
            results={results}
            contactData={contactData}
            assessmentData={assessmentData}
          />
        </div>
      )}
    </div>
  )
}

export default FestivalAssessment