import React, { useState } from 'react'
import './FestivalResults.css'

const FestivalResults = ({ results, contactData, assessmentData }) => {
  const [showDetailedResponses, setShowDetailedResponses] = useState(false)
  const { score, recommendations, submissionId } = results

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'
    if (score >= 60) return '#F59E0B'
    return '#EF4444'
  }

  const getScoreEmoji = (score) => {
    if (score >= 80) return '🎉'
    if (score >= 60) return '🎵'
    return '🎪'
  }

  const getScoreDescription = (score) => {
    if (score >= 80) return 'Fantastisk match!'
    if (score >= 60) return 'God kompatibilitet'
    return 'Flere muligheder at udforske'
  }

  const formatResponses = () => {
    const questionLabels = {
      music_preference: 'Musik præference',
      crowd_size: 'Festival størrelse',
      atmosphere: 'Atmosfære',
      budget: 'Budget',
      duration: 'Varighed',
      accommodation: 'Overnatning',
      activities: 'Aktiviteter',
      food_preference: 'Mad præferencer',
      travel_distance: 'Rejse afstand',
      contact_preference: 'Kontakt præference',
      comments: 'Kommentarer'
    }

    return Object.entries(assessmentData)
      .filter(([key, value]) => value && value !== '')
      .map(([key, value]) => {
        const label = questionLabels[key] || key
        const displayValue = Array.isArray(value) ? value.join(', ') : value
        return `${label}: ${displayValue}`
      })
      .join('\n')
  }

  return (
    <div className="festival-results">
      <div className="results-header">
        <h2>Dine festival anbefalinger, {contactData.contactPerson}!</h2>
        <p>Baseret på dine svar har vi fundet de perfekte festivaler til dig</p>
        <div className="submission-info">
          <span className="submission-id">Submission ID: {submissionId}</span>
          <span className="submission-date">{new Date().toLocaleDateString('da-DK')}</span>
        </div>
      </div>

      <div className="score-card">
        <div className="score-visual">
          <div 
            className="score-circle"
            style={{ borderColor: getScoreColor(score) }}
          >
            <span className="score-number" style={{ color: getScoreColor(score) }}>{score}</span>
            <span className="score-total">%</span>
          </div>
          <div className="score-icon">{getScoreEmoji(score)}</div>
          <div className="score-description">{getScoreDescription(score)}</div>
        </div>
        
        <div className="score-details">
          <h3 className="compatibility-title">Din kompatibilitetsscore</h3>
          <p className="compatibility-text">
            Baseret på dine præferencer for musik, atmosfære, budget og praktiske forhold 
            har vi beregnet din kompatibilitet med forskellige festival typer.
          </p>
        </div>
      </div>

      <div className="recommendations-section">
        <h3>Dine personlige festival anbefalinger</h3>
        <div className="recommendations-grid">
          {recommendations.map((festival, index) => (
            <div key={index} className="festival-card">
              <div className="festival-header">
                <h4>{festival.name}</h4>
                <div className="match-score" style={{ backgroundColor: getScoreColor(festival.match) }}>
                  {festival.match}% match
                </div>
              </div>
              <div className="festival-location">📍 {festival.location}</div>
              <p className="festival-reason">{festival.reason}</p>
              <button className="festival-cta">Se mere info</button>
            </div>
          ))}
        </div>
      </div>

      <div className="response-summary">
        <div className="summary-header">
          <h3>Sammendrag af dine svar</h3>
          <button 
            className="toggle-details"
            onClick={() => setShowDetailedResponses(!showDetailedResponses)}
          >
            {showDetailedResponses ? 'Skjul detaljer' : 'Vis alle svar'}
          </button>
        </div>
        
        {showDetailedResponses && (
          <div className="detailed-responses">
            <pre>{formatResponses()}</pre>
          </div>
        )}
      </div>

      <div className="contact-preferences">
        <h3>Næste skridt</h3>
        {assessmentData.contact_preference === 'contact_me' ? (
          <div className="contact-confirmation">
            <div className="contact-icon">📞</div>
            <div>
              <h4>Vi kontakter dig snart!</h4>
              <p>
                Baseret på dine præferencer vil en af vores festival eksperter kontakte dig 
                på <strong>{contactData.email}</strong> inden for 2 arbejdsdage med personlige anbefalinger.
              </p>
            </div>
          </div>
        ) : (
          <div className="self-contact">
            <div className="contact-icon">💌</div>
            <div>
              <h4>Du bestemmer tempoet</h4>
              <p>
                Vi respekterer dit ønske om selv at tage kontakt. Du kan altid skrive til os 
                på <strong>festival@example.com</strong> hvis du har spørgsmål.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="cta-section">
        <h3>Klar til at booke?</h3>
        <div className="cta-buttons">
          <button className="primary-cta">
            Se alle festival pakker
          </button>
          <button className="secondary-cta">
            Kontakt os for hjælp
          </button>
        </div>
        
        <div className="social-follow">
          <p>Følg os for de seneste festival nyheder:</p>
          <div className="social-buttons">
            <button className="social-btn facebook">Facebook</button>
            <button className="social-btn instagram">Instagram</button>
            <button className="social-btn twitter">Twitter</button>
          </div>
        </div>
      </div>

      <div className="email-confirmation">
        <div className="confirmation-icon">📧</div>
        <h3>Din detaljerede rapport er på vej</h3>
        <p>
          Vi sender en omfattende festival guide til <strong>{contactData.email}</strong> inden for få minutter.
          Guiden indeholder detaljerede informationer om dine anbefalede festivaler og praktiske tips.
        </p>
        <p className="email-note">
          Tjek venligst din spam-mappe, hvis du ikke modtager emailen inden for 10 minutter.
        </p>
        <div className="gdpr-notice">
          <small>
            Dine data behandles i overensstemmelse med GDPR. Du kan til enhver tid 
            trække dit samtykke tilbage ved at kontakte os.
          </small>
        </div>
      </div>
    </div>
  )
}

export default FestivalResults