import React, { useState } from 'react'
import './ResultsDisplay.css'

const ResultsDisplay = ({ results, contactData }) => {
  const { score, sectionScores, recommendation } = results
  const MAX_SCORE = 17
  const [showDemo, setShowDemo] = useState(false)

  const getScoreColor = (level) => {
    switch (level) {
      case 'beginner': return '#f59e0b'
      case 'intermediate': return '#10b981'
      case 'advanced': return '#059669'
      default: return '#10b981'
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

  const getScorePercentage = (score) => {
    const percentage = Math.round((score / MAX_SCORE) * 100)
    return Math.min(percentage, 100)
  }

  const getSectionName = (sectionKey) => {
    const names = {
      section1: 'Forståelse og bevidsthed',
      section2: 'Mål og data',
      section3: 'Strategi og forretning',
      section4: 'Risici og fremtidssikring'
    }
    return names[sectionKey]
  }

  const getSectionRecommendation = (sectionKey, sectionData) => {
    if (sectionData.score >= 4) return null
    
    const recommendations = {
      section1: 'Start med at definere, hvad ESG betyder for jeres virksomhed og identificer de mest relevante faktorer.',
      section2: 'Implementer systemer til at måle og dokumentere jeres ESG-indsats systematisk.',
      section3: 'Integrer ESG i jeres forretningsstrategi og kommuniker aktivt om jeres indsats.',
      section4: 'Få overblik over ESG-risici og forbered jer på kommende rapporteringskrav.'
    }
    return recommendations[sectionKey]
  }

  return (
    <div className="results-display">
      {/* Hero Section */}
      <div className="results-hero">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor" />
              <path d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z" fill="currentColor" />
              <path d="M5 6L5.5 8.5L8 9L5.5 9.5L5 12L4.5 9.5L2 9L4.5 8.5L5 6Z" fill="currentColor" />
            </svg>
          </div>

          <h1 className="hero-title">
            Resultat for <span className="highlight">{contactData.companyName}</span>
          </h1>

          <p className="hero-subtitle">
            Her er dit resultat for testen samt anbefalinger til handling mod en styrket ESG-rapportering
          </p>
        </div>
      </div>

      {/* Section Scores */}
      <div className="section-scores">
        <div className="section-scores-container">
          <h2>Jeres resultat pr. kategori</h2>
          <div className="sections-grid">
            {Object.entries(sectionScores).map(([sectionKey, sectionData]) => (
              <div key={sectionKey} className="section-card">
                <h3>{getSectionName(sectionKey)}</h3>
                <div className="section-score">
                  <span className="section-points">{sectionData.score}</span>
                  <span className="section-max">/ {sectionData.max}</span>
                </div>
                <div className="section-percentage">{sectionData.percentage}%</div>
                <div 
                  className="section-bar"
                  style={{ 
                    background: `linear-gradient(90deg, ${getScoreColor(recommendation.level)} ${sectionData.percentage}%, #e5e7eb ${sectionData.percentage}%)` 
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score Section */}
      <div className="score-section">
        <div className="score-container">
          <div className="score-visual">
            <div
              className="score-circle"
              style={{
                '--score-color': getScoreColor(recommendation.level),
                '--score-percentage': `${getScorePercentage(score)}%`
              }}
            >
              <div className="score-progress"></div>
              <div className="score-content">
                <span className="score-number">{score}</span>
                <span className="score-total">/ {MAX_SCORE}</span>
              </div>
            </div>

            <div className="score-details">
              <div className="score-percentage" style={{ color: getScoreColor(recommendation.level) }}>
                {getScorePercentage(score)}% ESG-parat
              </div>
              <div className="score-icon">{getScoreIcon(recommendation.level)}</div>
            </div>
          </div>

          <div className="score-analysis">
            <h2 className="analysis-title" style={{ color: getScoreColor(recommendation.level) }}>
              {recommendation.title}
            </h2>
            <p className="analysis-description">{recommendation.text}</p>

            <div className="score-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Jeres score</span>
                <span className="breakdown-value">{score} ud af {MAX_SCORE} point</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">ESG-niveau</span>
                <span className="breakdown-value">
                  {recommendation.level === 'beginner'
                    ? 'Opstart'
                    : recommendation.level === 'intermediate'
                    ? 'Mellem'
                    : 'Avanceret'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="next-steps-section">
        <div className="section-header">
          <h3>Jeres næste skridt på ESG-rejsen</h3>
          <p>👉 {recommendation.cta}</p>
        </div>
        
        {/* Section-specific recommendations */}
        <div className="section-recommendations">
          {Object.entries(sectionScores).map(([sectionKey, sectionData]) => {
            const rec = getSectionRecommendation(sectionKey, sectionData)
            if (!rec) return null
            return (
              <div key={sectionKey} className="section-recommendation">
                <strong>{getSectionName(sectionKey)}:</strong> {rec}
              </div>
            )
          })}
        </div>
      </div>

      {/* BluWave CTA */}
      <div className="bluwave-cta">
        <div className="cta-content">
          <h3>Vil du gøre ESG-rapportering lettere – og få reel forretningsværdi ud af det?</h3>
          <p>Med BluWave-platformen kan I arbejde med ESG enkelt, effektivt og compliant:</p>
          <div className="cta-features">
            <div className="cta-feature">✅ Automatisk CO₂-beregning og klimaregnskab</div>
            <div className="cta-feature">✅ Brugervenlig struktur til ESG-dokumentation</div>
            <div className="cta-feature">✅ Data og indsigter til at styrke jeres forretning</div>
          </div>
          <p className="cta-closing">Kom i gang med ESG – med fokus på både krav og konkrete gevinster.</p>
          <button 
            className="demo-btn"
            onClick={() => window.open('https://bluwave.dk', '_blank')}
          >
            Book en demo 👉
          </button>
        </div>
      </div>

      {/* Email confirmation */}
      <div className="email-confirmation">
        <div className="confirmation-content">
          <div className="confirmation-visual">
            <div className="confirmation-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" />
              </svg>
            </div>
            <div className="pulse-ring"></div>
          </div>

          <div className="confirmation-text">
            <h3>Din ESG-analyse er på vej</h3>
            <p>
              Vi sender din ESG-analyse til <strong>{contactData.email}</strong> inden for få minutter. Rapporten indeholder alle jeres svar, anbefalinger og næste skridt.
            </p>
            <p className="email-note">
              Tjek venligst din spam-mappe, hvis du ikke modtager mailen inden for 10 minutter.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="company-summary">
        <p style={{ textAlign: 'center', fontWeight: 600, marginTop: '1rem' }}>
          Reporting Progress – Power Your Business
        </p>
      </div>
    </div>
  )
}

export default ResultsDisplay
