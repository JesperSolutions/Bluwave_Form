import React, { useState } from 'react'
import ContactForm from './ContactForm'
import AssessmentQuestions from './AssessmentQuestions'
import ResultsDisplay from './ResultsDisplay'
import { submitAssessment } from '../services/emailService'
import './ESGAssessment.css'

const ESGAssessment = () => {
  const [currentStep, setCurrentStep] = useState('contact')
  const [contactData, setContactData] = useState({})
  const [assessmentData, setAssessmentData] = useState({})
  const [results, setResults] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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
      <header className="esg-header">
        <div className="header-content">
          <h1>Er din virksomhed klar til ESG-rapportering?</h1>
          <p className="subtitle">En selvtest for små og mellemstore virksomheder (SMV'er)</p>
          <p className="description">
            Formålet med denne test er at give et hurtigt overblik over, hvor ESG-parat jeres virksomhed er – 
            og samtidig vise, hvorfor ESG er vigtig for forretningen.
          </p>
        </div>
      </header>

      <main className="assessment-content">
        {currentStep === 'contact' && (
          <ContactForm onSubmit={handleContactSubmit} />
        )}
        
        {currentStep === 'assessment' && (
          <AssessmentQuestions 
            onSubmit={handleAssessmentSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}
        
        {currentStep === 'results' && (
          <ResultsDisplay 
            results={results}
            contactData={contactData}
          />
        )}
      </main>
    </div>
  )
}

export default ESGAssessment