import React from 'react'
import './ResultsDisplay.css'

const ResultsDisplay = ({ results, contactData }) => {
  const { score, recommendation } = results

  const getScoreColor = (level) => {
    switch (level) {
      case 'beginner': return 'var(--gradient-g2)'
      case 'intermediate': return 'var(--gradient-g)'
      case 'advanced': return 'var(--primary-green)'
      default: return 'var(--primary-green)'
    }
  }

  const getScoreIcon = (level) => {
    switch (level) {
      case 'beginner': return '🌱'
      case 'intermediate': return '🌿'
      case 'advanced': return '🌳'
      default: return '🌿'
    }
  }

  return (
    <div className="results-display">
      <div className="results-header">
        <h2>Dit ESG-resultat, {contactData.contactPerson}</h2>
        <p>Her er din personlige analyse baseret på dine svar</p>
      </div>

      <div className="score-card">
        <div className="score-visual">
          <div 
            className="score-circle"
            style={{ borderColor: getScoreColor(recommendation.level) }}
          >
            <span className="score-number">{score}</span>
            <span className="score-total">/ 13</span>
          </div>
          <div className="score-icon">{getScoreIcon(recommendation.level)}</div>
        </div>
        
        <div className="score-details">
          <h3 className="recommendation-title">{recommendation.title}</h3>
          <p className="recommendation-text">{recommendation.text}</p>
        </div>
      </div>

      <div className="next-steps">
        <h3>Næste skridt</h3>
        <div className="steps-grid">
          {recommendation.level === 'beginner' && (
            <>
              <div className="step-card">
                <div className="step-icon">📋</div>
                <h4>Få overblik</h4>
                <p>Start med at identificere de mest relevante ESG-faktorer for jeres branche</p>
              </div>
              <div className="step-card">
                <div className="step-icon">🎯</div>
                <h4>Sæt et mål</h4>
                <p>Vælg ét konkret område at fokusere på først</p>
              </div>
              <div className="step-card">
                <div className="step-icon">📚</div>
                <h4>Lær mere</h4>
                <p>Uddann jer selv og jeres team i ESG-grundlæggende</p>
              </div>
            </>
          )}
          
          {recommendation.level === 'intermediate' && (
            <>
              <div className="step-card">
                <div className="step-icon">📊</div>
                <h4>Strukturer data</h4>
                <p>Implementer systemer til at indsamle og dokumentere ESG-data</p>
              </div>
              <div className="step-card">
                <div className="step-icon">📋</div>
                <h4>Forbered rapportering</h4>
                <p>Gør jer klar til øgede krav fra kunder og myndigheder</p>
              </div>
              <div className="step-card">
                <div className="step-icon">💬</div>
                <h4>Kommuniker aktivt</h4>
                <p>Fortæl om jeres ESG-indsats på hjemmeside og i kundemøder</p>
              </div>
            </>
          )}
          
          {recommendation.level === 'advanced' && (
            <>
              <div className="step-card">
                <div className="step-icon">🚀</div>
                <h4>Optimer processer</h4>
                <p>Finpudse jeres ESG-processer og gør dem mere effektive</p>
              </div>
              <div className="step-card">
                <div className="step-icon">💼</div>
                <h4>Strategisk integration</h4>
                <p>Brug ESG som konkurrencefordel i jeres forretningsstrategi</p>
              </div>
              <div className="step-card">
                <div className="step-icon">🏆</div>
                <h4>Bliv frontløber</h4>
                <p>Del jeres erfaringer og bliv en ESG-ambassadør i jeres branche</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="email-confirmation">
        <div className="confirmation-icon">📧</div>
        <h3>Din detaljerede analyse er på vej</h3>
        <p>
          Vi sender en omfattende rapport til <strong>{contactData.email}</strong> inden for få minutter.
          Rapporten indeholder konkrete anbefalinger og næste skridt for {contactData.companyName}.
        </p>
        <p className="email-note">
          Tjek venligst din spam-mappe, hvis du ikke modtager emailen inden for 10 minutter.
        </p>
      </div>
    </div>
  )
}

export default ResultsDisplay