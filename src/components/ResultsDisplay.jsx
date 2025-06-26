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
        <h2>Dit ESG-resultat, {contactData.contactPerson}!</h2>
        <p>Her er din personlige analyse baseret på {contactData.companyName}'s svar</p>
      </div>

      <div className="score-card">
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

      <div className="next-steps">
        <h3>Jeres næste skridt</h3>
        <div className="steps-list">
          {analysis.nextSteps.map((step, index) => (
            <div key={index} className="step-item">
              <span className="step-text">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-status">
        <h3>Kontakt præference</h3>
        {contactData.contactPreference === 'yes' ? (
          <div className="contact-confirmation">
            <div className="contact-icon">📞</div>
            <div>
              <h4>Vi kontakter jer snart!</h4>
              <p>
                Baseret på jeres svar vil en af vores ESG-eksperter kontakte jer 
                på <strong>{contactData.email}</strong> inden for 2 arbejdsdage med personlige anbefalinger 
                og konkrete forslag til, hvordan {contactData.companyName} kan komme videre med ESG.
              </p>
            </div>
          </div>
        ) : (
          <div className="no-contact">
            <div className="contact-icon">📧</div>
            <div>
              <h4>Resultat sendt til jer</h4>
              <p>
                I har valgt kun at modtage resultatet. Vi respekterer dette valg. 
                I kan altid kontakte os på <strong>esg@bluwave.dk</strong> hvis I senere 
                ønsker rådgivning eller har spørgsmål til jeres ESG-rejse.
              </p>
            </div>
          </div>
        )}
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