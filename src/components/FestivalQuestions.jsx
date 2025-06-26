import React, { useState } from 'react'
import './FestivalQuestions.css'

const FestivalQuestions = ({ onSubmit, isSubmitting, error }) => {
  const [responses, setResponses] = useState({})
  const [currentSection, setCurrentSection] = useState(0)

  const sections = [
    {
      title: 'Musik & Atmosfære',
      questions: [
        {
          key: 'music_preference',
          text: 'Hvilken type musik foretrækker du mest?',
          type: 'radio',
          options: [
            { value: 'electronic', label: 'Elektronisk/House/Techno' },
            { value: 'rock', label: 'Rock/Metal/Punk' },
            { value: 'pop', label: 'Pop/Mainstream' },
            { value: 'indie', label: 'Indie/Alternative' },
            { value: 'jazz', label: 'Jazz/Blues' },
            { value: 'mixed', label: 'Blandet - jeg kan lide det hele' }
          ]
        },
        {
          key: 'crowd_size',
          text: 'Hvilken størrelse festival foretrækker du?',
          type: 'radio',
          options: [
            { value: 'intimate', label: 'Intimt (under 5.000 gæster)' },
            { value: 'medium', label: 'Medium (5.000-20.000 gæster)' },
            { value: 'large', label: 'Stort (20.000-50.000 gæster)' },
            { value: 'massive', label: 'Massivt (50.000+ gæster)' }
          ]
        },
        {
          key: 'atmosphere',
          text: 'Hvilken atmosfære tiltrækker dig mest?',
          type: 'radio',
          options: [
            { value: 'party', label: 'Fest og party hele tiden' },
            { value: 'chill', label: 'Afslappet og hyggelig' },
            { value: 'cultural', label: 'Kulturel og kunstnerisk' },
            { value: 'family', label: 'Familievenlig' }
          ]
        }
      ]
    },
    {
      title: 'Praktiske Præferencer',
      questions: [
        {
          key: 'budget',
          text: 'Hvad er dit budget for en festival (inkl. billet, mad, transport)?',
          type: 'radio',
          options: [
            { value: 'budget', label: 'Under 2.000 kr.' },
            { value: 'moderate', label: '2.000-4.000 kr.' },
            { value: 'premium', label: '4.000-7.000 kr.' },
            { value: 'luxury', label: 'Over 7.000 kr.' }
          ]
        },
        {
          key: 'duration',
          text: 'Hvor lang tid vil du gerne bruge på festivalen?',
          type: 'radio',
          options: [
            { value: 'day', label: '1 dag' },
            { value: 'weekend', label: '2-3 dage' },
            { value: 'week', label: '4-7 dage' },
            { value: 'extended', label: 'Mere end en uge' }
          ]
        },
        {
          key: 'accommodation',
          text: 'Hvor vil du helst overnatte?',
          type: 'radio',
          options: [
            { value: 'camping', label: 'Camping/telt' },
            { value: 'hotel', label: 'Hotel/B&B' },
            { value: 'glamping', label: 'Glamping/luksus camping' },
            { value: 'home', label: 'Hjemme (dagsbillet)' }
          ]
        }
      ]
    },
    {
      title: 'Oplevelser & Aktiviteter',
      questions: [
        {
          key: 'activities',
          text: 'Hvilke aktiviteter ud over musik interesserer dig?',
          type: 'checkbox',
          options: [
            { value: 'food', label: 'Gourmet mad og drinks' },
            { value: 'art', label: 'Kunst og installationer' },
            { value: 'workshops', label: 'Workshops og talks' },
            { value: 'wellness', label: 'Wellness og yoga' },
            { value: 'sports', label: 'Sport og aktiviteter' },
            { value: 'none', label: 'Kun musik, tak' }
          ]
        },
        {
          key: 'food_preference',
          text: 'Hvad er vigtigt for dig mht. mad på festivalen?',
          type: 'radio',
          options: [
            { value: 'variety', label: 'Stort udvalg af forskellige køkkener' },
            { value: 'quality', label: 'Høj kvalitet og gourmet' },
            { value: 'healthy', label: 'Sunde og vegetariske muligheder' },
            { value: 'cheap', label: 'Billig og mættende mad' }
          ]
        }
      ]
    },
    {
      title: 'Rejse & Kontakt',
      questions: [
        {
          key: 'travel_distance',
          text: 'Hvor langt er du villig til at rejse?',
          type: 'radio',
          options: [
            { value: 'local', label: 'Kun lokalt (samme region)' },
            { value: 'national', label: 'Overalt i Danmark' },
            { value: 'nordic', label: 'Norden (Sverige, Norge)' },
            { value: 'europe', label: 'Hele Europa' }
          ]
        },
        {
          key: 'contact_preference',
          text: 'Hvordan vil du gerne høre fra os?',
          type: 'radio',
          options: [
            { value: 'contact_me', label: 'Kontakt mig gerne med festival forslag' },
            { value: 'no_contact', label: 'Jeg tager selv kontakt hvis jeg har brug for hjælp' }
          ]
        },
        {
          key: 'comments',
          text: 'Har du andre ønsker eller kommentarer?',
          type: 'textarea',
          placeholder: 'Fortæl os om specielle ønsker, tidligere festival oplevelser, eller andet vi bør vide...'
        }
      ]
    }
  ]

  const handleResponseChange = (questionKey, value, isCheckbox = false) => {
    setResponses(prev => {
      if (isCheckbox) {
        const currentValues = prev[questionKey] || []
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
        return { ...prev, [questionKey]: newValues }
      }
      return { ...prev, [questionKey]: value }
    })
  }

  const isCurrentSectionComplete = () => {
    const section = sections[currentSection]
    return section.questions.every(question => {
      if (question.key === 'comments') return true // Optional field
      return responses[question.key] && 
        (Array.isArray(responses[question.key]) ? responses[question.key].length > 0 : true)
    })
  }

  const isAllComplete = () => {
    const requiredFields = sections.flatMap(section => 
      section.questions.filter(q => q.key !== 'comments').map(q => q.key)
    )
    return requiredFields.every(key => responses[key])
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

  const currentSectionData = sections[currentSection]
  const progress = ((currentSection + 1) / sections.length) * 100

  return (
    <div className="festival-questions">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="section-header">
        <h2>{currentSectionData.title}</h2>
        <span className="section-counter">Del {currentSection + 1} af {sections.length}</span>
      </div>

      <form onSubmit={handleSubmit} className="questions-form">
        <div className="questions-container">
          {currentSectionData.questions.map((question, questionIndex) => (
            <div key={question.key} className="question-card">
              <p className="question-text">{question.text}</p>
              
              {question.type === 'radio' && (
                <div className="options">
                  {question.options.map((option) => (
                    <label key={option.value} className="option">
                      <input
                        type="radio"
                        name={question.key}
                        value={option.value}
                        checked={responses[question.key] === option.value}
                        onChange={(e) => handleResponseChange(question.key, e.target.value)}
                      />
                      <span className="option-text">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'checkbox' && (
                <div className="options checkbox-options">
                  {question.options.map((option) => (
                    <label key={option.value} className="option checkbox-option">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={(responses[question.key] || []).includes(option.value)}
                        onChange={(e) => handleResponseChange(question.key, e.target.value, true)}
                      />
                      <span className="option-text">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'textarea' && (
                <textarea
                  className="comment-textarea"
                  placeholder={question.placeholder}
                  value={responses[question.key] || ''}
                  onChange={(e) => handleResponseChange(question.key, e.target.value)}
                  rows={4}
                />
              )}
            </div>
          ))}
        </div>

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
                'Find mine festivaler'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default FestivalQuestions