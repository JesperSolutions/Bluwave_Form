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
          "📋 Få overblik over ESG-faktorer relevante for jeres branche",
          "🎯 Sæt ét konkret mål at starte med",
          "📚 Uddann jer selv og teamet i ESG-grundlæggende",
          "💬 Start dialogen om bæredygtighed internt"
        ]
      }
    } else if (score <= 9) {
      return {
        title: "I har fat i mange af de rigtige ting",
        description: "Måske uden at kalde det ESG. Nu er det tid til at strukturere arbejdet og forberede jer på, at kunder og myndigheder vil kræve mere dokumentation. I har et godt fundament at bygge videre på.",
        nextSteps: [
          "📊 Implementer systemer til dataindsamling og dokumentation",
          "📋 Forbered jer på øgede rapporteringskrav",
          "💬 Kommuniker aktivt om jeres ESG-indsats",
          "🔄 Strukturer og systematiser jeres arbejde"
        ]
      }
    } else {
      return {
        title: "I er godt på vej",
        description: "Måske endda foran mange andre SMV'er. I har potentiale til at bruge ESG aktivt som en del af jeres strategi og som konkurrencefordel. Fokuser nu på at optimere jeres processer og kommunikation.",
        nextSteps: [
          "🚀 Optimer og effektivisér jeres ESG-processer",
          "💼 Integrer ESG strategisk i forretningsmodellen",
          "🏆 Bliv frontløber og del jeres erfaringer",
          "📈 Brug ESG som konkurrencefordel"
        ]
      }
    }
  }

  const analysis = getDetailedAnalysis(score)

  return (
    <div className="results-display">
      <div className="results-header">
        <div className="header-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#89B348"/>
            <path d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z" fill="#89B348"/>
            <path d="M5 6L5.5 8.5L8 9L5.5 9.5L5 12L4.5 9.5L2 9L4.5 8.5L5 6Z" fill="#89B348"/>
          </svg>
        </div>
        <h2>Dit ESG-resultat, {contactData.contactPerson}!</h2>
        <p>Her er din personlige analyse baseret på {contactData.companyName}'s svar</p>
      </div>

      <div className="score-section">
        <div className="score-visual">
          <div 
            className="score-circle"
            style={{ borderColor: getScoreColor(recommendation.level) }}
          >
            <span className="score-number" style={{ color: getScoreColor(recommendation.level) }}>{score}</span>
            <span className="score-total">/ 13</span>
          </div>
          <div className="score-percentage" style={{ color: getScoreColor(recommendation.level) }}>
            {getScorePercentage(score)}%
          </div>
          <div className="score-icon">{getScoreIcon(recommendation.level)}</div>
        </div>
        
        <div className="score-details">
          <h3 className="recommendation-title" style={{ color: getScoreColor(recommendation.level) }}>
            {analysis.title}
          </h3>
          <p className="recommendation-text">{analysis.description}</p>
        </div>
      </div>

      <div className="next-steps-section">
        <h3>Jeres næste skridt</h3>
        <div className="steps-grid">
          {analysis.nextSteps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                <span className="step-text">{step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-section">
        <h3>Hvad sker der nu?</h3>
        {contactData.contactPreference === 'yes' ? (
          <div className="contact-card will-contact">
            <div className="contact-visual">
              <div className="contact-icon">📞</div>
              <div className="contact-badge">Vi kontakter jer</div>
            </div>
            <div className="contact-content">
              <h4>Vi er klar til at hjælpe jer videre</h4>
              <p>
                En af vores ESG-eksperter kontakter jer på <strong>{contactData.email}</strong> inden for 2 arbejdsdage. 
                Vi kommer med konkrete forslag til, hvordan {contactData.companyName} kan tage de næste skridt på jeres ESG-rejse.
              </p>
              <div className="contact-benefits">
                <div className="benefit">✅ Personlig rådgivning</div>
                <div className="benefit">✅ Skræddersyede løsninger</div>
                <div className="benefit">✅ Konkrete handlingsplaner</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="contact-card no-contact">
            <div className="contact-visual">
              <div className="contact-icon">📧</div>
              <div className="contact-badge">Kun resultat</div>
            </div>
            <div className="contact-content">
              <h4>I har valgt kun at modtage resultatet</h4>
              <p>
                Vi respekterer jeres valg. I kan altid kontakte os på <strong>esg@bluwave.dk</strong> 
                hvis I senere ønsker hjælp til jeres ESG-arbejde.
              </p>
              <div className="cta-section">
                <h5>Hvad I går glip af:</h5>
                <div className="missed-benefits">
                  <div className="missed-benefit">❌ Personlig ESG-strategi</div>
                  <div className="missed-benefit">❌ Branchespecifikke anbefalinger</div>
                  <div className="missed-benefit">❌ Implementeringshjælp</div>
                  <div className="missed-benefit">❌ Løbende support</div>
                </div>
                <button className="change-mind-btn">
                  Jeg vil gerne kontaktes alligevel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="company-summary">
        <h3>Jeres virksomhedsprofil</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-label">Virksomhed</div>
            <div className="summary-value">{contactData.companyName}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Kontaktperson</div>
            <div className="summary-value">{contactData.contactPerson}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Branche</div>
            <div className="summary-value">{contactData.industry}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Medarbejdere</div>
            <div className="summary-value">{contactData.employees}</div>
          </div>
        </div>
      </div>

      <div className="email-confirmation">
        <div className="confirmation-content">
          <div className="confirmation-icon">📧</div>
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
  )
}

export default ResultsDisplay