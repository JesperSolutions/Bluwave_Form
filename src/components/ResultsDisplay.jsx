import React from 'react'
import './ResultsDisplay.css'

const ResultsDisplay = ({ results, contactData }) => {
  const { score, recommendation } = results

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
    return Math.round((score / 13) * 100)
  }

  const getDetailedAnalysis = (score) => {
    if (score <= 5) {
      return {
        title: "I er i startfasen",
        description: "ESG er nok ikke en topprioritet endnu, men det kan blive det hurtigt. Start med at få overblik og sæt ét konkret mål. Vi anbefaler at begynde med at identificere de mest relevante ESG-faktorer for jeres branche og formulere en grundlæggende holdning til bæredygtighed.",
        nextSteps: [
          "Få overblik over ESG-faktorer relevante for jeres branche",
          "Sæt ét konkret mål at starte med",
          "Uddann jer selv og teamet i ESG-grundlæggende",
          "Start dialogen om bæredygtighed internt"
        ]
      }
    } else if (score <= 9) {
      return {
        title: "I har fat i mange af de rigtige ting",
        description: "Måske uden at kalde det ESG. Nu er det tid til at strukturere arbejdet og forberede jer på, at kunder og myndigheder vil kræve mere dokumentation. I har et godt fundament at bygge videre på.",
        nextSteps: [
          "Implementer systemer til dataindsamling og dokumentation",
          "Forbered jer på øgede rapporteringskrav",
          "Kommuniker aktivt om jeres ESG-indsats",
          "Strukturer og systematiser jeres arbejde"
        ]
      }
    } else {
      return {
        title: "I er godt på vej",
        description: "Måske endda foran mange andre SMV'er. I har potentiale til at bruge ESG aktivt som en del af jeres strategi og som konkurrencefordel. Fokuser nu på at optimere jeres processer og kommunikation.",
        nextSteps: [
          "Optimer og effektivisér jeres ESG-processer",
          "Integrer ESG strategisk i forretningsmodellen",
          "Bliv frontløber og del jeres erfaringer",
          "Brug ESG som konkurrencefordel"
        ]
      }
    }
  }

  const analysis = getDetailedAnalysis(score)

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
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z" fill="currentColor"/>
              <path d="M5 6L5.5 8.5L8 9L5.5 9.5L5 12L4.5 9.5L2 9L4.5 8.5L5 6Z" fill="currentColor"/>
            </svg>
          </div>
          
          <h1 className="hero-title">
            Dit ESG-resultat, <span className="highlight">{contactData.contactPerson}!</span>
          </h1>
          
          <p className="hero-subtitle">
            Her er din personlige analyse baseret på <strong>{contactData.companyName}</strong>'s svar
          </p>
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
                '--score-percentage': `${(score / 13) * 100}%`
              }}
            >
              <div className="score-progress"></div>
              <div className="score-content">
                <span className="score-number">{score}</span>
                <span className="score-total">/ 13</span>
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
              {analysis.title}
            </h2>
            <p className="analysis-description">{analysis.description}</p>
            
            <div className="score-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Jeres score</span>
                <span className="breakdown-value">{score} ud af 13 point</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">ESG-niveau</span>
                <span className="breakdown-value">{recommendation.level === 'beginner' ? 'Begynder' : recommendation.level === 'intermediate' ? 'Mellem' : 'Avanceret'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="next-steps-section">
        <div className="section-header">
          <h3>Jeres næste skridt på ESG-rejsen</h3>
          <p>Baseret på jeres resultat anbefaler vi disse konkrete handlinger</p>
        </div>
        
        <div className="steps-grid">
          {analysis.nextSteps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-header">
                <div className="step-number">{index + 1}</div>
                <div className="step-icon">
                  {index === 0 ? '📋' : index === 1 ? '🎯' : index === 2 ? '📚' : '💬'}
                </div>
              </div>
              <div className="step-content">
                <h4 className="step-title">{step.split(' ').slice(1).join(' ')}</h4>
                <p className="step-description">
                  {index === 0 && "Identificer de ESG-faktorer der er mest relevante for jeres branche og forretning."}
                  {index === 1 && "Vælg et specifikt område at fokusere på først - det gør det lettere at komme i gang."}
                  {index === 2 && "Sørg for at hele teamet forstår ESG og hvorfor det er vigtigt for virksomheden."}
                  {index === 3 && "Skab en kultur hvor bæredygtighed er en naturlig del af beslutningsprocessen."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="section-header">
          <h3>Hvad sker der nu?</h3>
        </div>
        
        {contactData.contactPreference === 'yes' ? (
          <div className="contact-card will-contact">
            <div className="contact-visual">
              <div className="contact-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                </svg>
              </div>
              <div className="contact-badge success">Vi kontakter jer</div>
            </div>
            
            <div className="contact-content">
              <h4>Vi er klar til at hjælpe jer videre</h4>
              <p>
                En af vores ESG-eksperter kontakter jer på <strong>{contactData.email}</strong> inden for 2 arbejdsdage. 
                Vi kommer med konkrete forslag til, hvordan {contactData.companyName} kan tage de næste skridt på jeres ESG-rejse.
              </p>
              
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-icon">✅</div>
                  <span>Personlig rådgivning</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✅</div>
                  <span>Skræddersyede løsninger</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✅</div>
                  <span>Konkrete handlingsplaner</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✅</div>
                  <span>Løbende support</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="contact-card no-contact">
            <div className="contact-visual">
              <div className="contact-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                </svg>
              </div>
              <div className="contact-badge neutral">Kun resultat</div>
            </div>
            
            <div className="contact-content">
              <h4>I har valgt kun at modtage resultatet</h4>
              <p>
                Vi respekterer jeres valg. I kan altid kontakte os på <strong>esg@bluwave.dk</strong> 
                hvis I senere ønsker hjælp til jeres ESG-arbejde.
              </p>
              
              <div className="cta-section">
                <h5>Hvad I går glip af ved ikke at blive kontaktet:</h5>
                <div className="missed-benefits">
                  <div className="missed-benefit">
                    <div className="missed-icon">❌</div>
                    <span>Personlig ESG-strategi tilpasset jeres branche</span>
                  </div>
                  <div className="missed-benefit">
                    <div className="missed-icon">❌</div>
                    <span>Konkrete implementeringsplaner</span>
                  </div>
                  <div className="missed-benefit">
                    <div className="missed-icon">❌</div>
                    <span>Hjælp til rapportering og dokumentation</span>
                  </div>
                  <div className="missed-benefit">
                    <div className="missed-icon">❌</div>
                    <span>Løbende support og vejledning</span>
                  </div>
                </div>
                
                <button className="change-mind-btn">
                  <span>Jeg vil gerne kontaktes alligevel</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Company Summary */}
      <div className="company-summary">
        <div className="section-header">
          <h3>Jeres virksomhedsprofil</h3>
        </div>
        
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">🏢</div>
            <div className="summary-content">
              <span className="summary-label">Virksomhed</span>
              <span className="summary-value">{contactData.companyName}</span>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">👤</div>
            <div className="summary-content">
              <span className="summary-label">Kontaktperson</span>
              <span className="summary-value">{contactData.contactPerson}</span>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">🏭</div>
            <div className="summary-content">
              <span className="summary-label">Branche</span>
              <span className="summary-value">{contactData.industry}</span>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-icon">👥</div>
            <div className="summary-content">
              <span className="summary-label">Medarbejdere</span>
              <span className="summary-value">{contactData.employees}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Confirmation */}
      <div className="email-confirmation">
        <div className="confirmation-content">
          <div className="confirmation-visual">
            <div className="confirmation-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
            </div>
            <div className="pulse-ring"></div>
          </div>
          
          <div className="confirmation-text">
            <h3>Din detaljerede rapport er på vej</h3>
            <p>
              Vi sender en omfattende ESG-analyse til <strong>{contactData.email}</strong> inden for få minutter.
              Rapporten indeholder alle jeres svar, detaljerede anbefalinger og konkrete næste skridt for {contactData.companyName}.
            </p>
            <p className="email-note">
              Tjek venligst din spam-mappe, hvis du ikke modtager emailen inden for 10 minutter.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsDisplay