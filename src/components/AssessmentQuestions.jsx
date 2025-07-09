import React, { useState } from 'react'
import './AssessmentQuestions.css'

const AssessmentQuestions = ({ onSubmit, isSubmitting, error }) => {
  const [responses, setResponses] = useState({})
  const [currentSection, setCurrentSection] = useState(0)

  const sections = [
    {
      title: 'Del 1: Har I styr på det grundlæggende?',
      questions: [
        'Har I i ledelsen en fælles forståelse af, hvad ESG (miljø, sociale forhold og god ledelse) betyder for jeres virksomhed?',
        'Har I formuleret en holdning til klima, sociale ansvar og governance?',
        'Har I identificeret, hvilke ESG-faktorer der er væsentlige for jeres virksomhed og jeres branche?'
      ]
    },
    {
      title: 'Del 2: Har I sat mål – og måler I fremdrift?',
      questions: [
        'Har I konkrete mål for fx CO₂-reduktion, diversitet, medarbejdertrivsel eller ansvarlig leverandørstyring?',
        'Har I processer til at indsamle og dokumentere data om jeres ESG-indsats?',
        'Kommunikerer I allerede i dag om jeres ansvar og resultater – fx på hjemmeside, i tilbud eller i dialog med kunder?'
      ]
    },
    {
      title: 'Del 3: Er ESG en del af jeres strategi og forretning?',
      questions: [
        'Indgår ESG som en aktiv del af jeres strategi og værdigrundlag?',
        'Har jeres vigtigste kunder eller samarbejdspartnere spurgt ind til jeres ESG-indsats?',
        'Oplever I, at krav til bæredygtighed og ESG i stigende grad er et konkurrenceparameter (f.eks. i udbud, kundekrav, rekruttering og adgang til kapital)?'
      ]
    },
    {
      title: 'Del 4: License to operate, risici og fremtidssikring',
      questions: [
        'Ville I kunne dokumentere jeres ESG-arbejde, hvis I blev spurgt i morgen?',
        'Er I klar over, at krav til ESG-rapportering allerede gælder store virksomheder – og at de krav nu bevæger sig ud i leverandørkæden?',
        'Har I overblik over de risici, der kan ramme jeres forretning, hvis I ikke arbejder systematisk med ESG (f.eks. mistet forretning, skadet omdømme, medarbejderflugt eller højere finansieringsomkostninger)?',
        'Ville det styrke jeres konkurrenceevne, rekruttering og relationer, hvis I kunne vise ansvar og resultater på ESG?'
      ]
    }
  ]

  const handleResponseChange = (questionIndex, value) => {
    setResponses(prev => ({
      ...prev,
      [`q${questionIndex + 1}`]: value
    }))
  }

  const isCurrentSectionComplete = () => {
    const section = sections[currentSection]
    const startIndex = sections.slice(0, currentSection).reduce((sum, s) => sum + s.questions.length, 0)
    
    for (let i = 0; i < section.questions.length; i++) {
      if (!responses[`q${startIndex + i + 1}`]) {
        return false
      }
    }
    return true
  }

  const isAllComplete = () => {
    const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0)
    return Object.keys(responses).length === totalQuestions
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isAllComplete()) {
      onSubmit(responses)
    }
  }

  const getQuestionIndex = (sectionIndex, questionIndex) => {
    return sections.slice(0, sectionIndex).reduce((sum, s) => sum + s.questions.length, 0) + questionIndex
  }

  const currentSectionData = sections[currentSection]
  const progress = ((currentSection + 1) / sections.length) * 100

  return (
    <div className="assessment-questions">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="section-header">
        <h2>{currentSectionData.title}</h2>
        <span className="section-counter">Del {currentSection + 1} af {sections.length}</span>
      </div>

      <form onSubmit={handleSubmit} className="questions-form">
        <div className="questions-container">
          {currentSectionData.questions.map((question, questionIndex) => {
            const globalQuestionIndex = getQuestionIndex(currentSection, questionIndex)
            const questionKey = `q${globalQuestionIndex + 1}`
            
            return (
              <div key={questionKey} className="question-card">
                <p className="question-text">
                  {globalQuestionIndex + 1}. {question}
                </p>
                <div className="options">
                  {['ja', 'nej', 'ved_ikke'].map((option) => (
                    <label key={option} className="option">
                      <input
                        type="radio"
                        name={questionKey}
                        value={option}
                        checked={responses[questionKey] === option}
                        onChange={(e) => handleResponseChange(globalQuestionIndex, e.target.value)}
                      />
                      <span className="option-text">
                        {option === 'ja' ? 'Ja' : option === 'nej' ? 'Nej' : 'Ved ikke'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {currentSection === sections.length - 1 && (
          <p className="completion-hint">
            Du er nået til sidste spørgsmål – klik på knappen nedenfor for at få dit resultat.
          </p>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="navigation-buttons">
          {currentSection > 0 && (
            <button type="button" onClick={handlePrevious} className="nav-btn prev-btn">
              Forrige
            </button>
          )}
          
          {currentSection < sections.length - 1 ? (
            <button 
              type="button" 
              onClick={handleNext} 
              className="nav-btn next-btn"
              disabled={!isCurrentSectionComplete()}
            >
              Næste
            </button>
          ) : (
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!isAllComplete() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sender...
                </>
              ) : (
                'Få mit ESG-resultat'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AssessmentQuestions
