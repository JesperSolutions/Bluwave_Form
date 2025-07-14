import React, { useState } from 'react'
import './ResultsDisplay.css'

const ResultsDisplay = ({ results, contactData, downloadableData }) => {
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

  // Download results as JSON
  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(downloadableData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ESG-Selvtest-${contactData.companyName}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Download results as text report
  const handleDownloadReport = () => {
    const report = generateTextReport(downloadableData)
    const dataBlob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ESG-Rapport-${contactData.companyName}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Generate email content for manual sending
  const handleEmailContent = () => {
    const emailContent = generateEmailContent(downloadableData)
    navigator.clipboard.writeText(emailContent).then(() => {
      alert('Email indhold kopieret til udklipsholder! Du kan nu indsætte det i din email.')
    }).catch(() => {
      // Fallback - show in new window
      const newWindow = window.open('', '_blank')
      newWindow.document.write(`<pre style="font-family: Arial; padding: 20px; white-space: pre-wrap;">${emailContent}</pre>`)
    })
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
            Dit ESG-resultat, <span className="highlight">{contactData.companyName}!</span>
          </h1>

          <p className="hero-subtitle">
            Her er dit personlige testresultat samt anbefalinger til næste skridt, baseret på dine svar.
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

      {/* Next Steps Section - Enhanced */}
      <div className="next-steps-section">
        <div className="section-header">
          <div className="steps-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#89B348"/>
            </svg>
          </div>
          <h3>Jeres næste skridt på ESG-rejsen</h3>
          <div className="main-recommendation">
            <div className="recommendation-icon">👉</div>
            <p>{recommendation.cta}</p>
          </div>
        </div>
        
        {/* Section-specific recommendations - Enhanced */}
        {Object.entries(sectionScores).some(([sectionKey, sectionData]) => 
          getSectionRecommendation(sectionKey, sectionData)
        ) && (
          <div className="section-recommendations">
            <h4>Specifikke anbefalinger baseret på jeres svar:</h4>
            <div className="recommendations-grid">
              {Object.entries(sectionScores).map(([sectionKey, sectionData]) => {
                const rec = getSectionRecommendation(sectionKey, sectionData)
                if (!rec) return null
                return (
                  <div key={sectionKey} className="section-recommendation">
                    <div className="rec-header">
                      <div className="rec-icon">💡</div>
                      <strong>{getSectionName(sectionKey)}</strong>
                    </div>
                    <p>{rec}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Contact Section - Moved here for better flow */}
      <div className="contact-section">
        <div className="contact-container">
          <div className="contact-header">
            <div className="contact-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="white"/>
              </svg>
            </div>
            <div className="contact-badge">VI KONTAKTER JER</div>
          </div>
          
          <h3>Vi er klar til at hjælpe jer videre</h3>
          
          <p className="contact-description">
            {contactData.contactPreference === 'yes' ? (
              <>
                En af vores ESG-eksperter kontakter jer på <strong>{contactData.email}</strong> inden for 2 arbejdsdage. Vi kommer med konkrete forslag til, hvordan {contactData.companyName} kan tage de næste skridt på jeres ESG-rejse.
              </>
            ) : (
              <>
                I har valgt kun at modtage resultatet. Hvis I senere ønsker personlig rådgivning, er I altid velkomne til at kontakte os på <strong>ja@bluwave.dk</strong>.
              </>
            )}
          </p>
          
          <div className="contact-features">
            <div className="feature-grid">
              <div className="contact-feature">
                <div className="feature-icon">✓</div>
                <span>Personlig rådgivning</span>
              </div>
              <div className="contact-feature">
                <div className="feature-icon">✓</div>
                <span>BluWave platform demo</span>
              </div>
              <div className="contact-feature">
                <div className="feature-icon">✓</div>
                <span>Konkrete handlingsplaner</span>
              </div>
              <div className="contact-feature">
                <div className="feature-icon">✓</div>
                <span>ESG-værktøjer og support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email confirmation */}
      <div className="email-confirmation">
        <div className="confirmation-content">
          <div className="confirmation-visual">
            <div className="confirmation-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="confirmation-text">
            <h3>Download eller del dine resultater</h3>
            <p>
              {contactData.contactPreference === 'yes' ? (
                <>
                  <strong>Vi kontakter jer snart!</strong> I mellemtiden kan I downloade jeres detaljerede ESG-rapport eller dele den med jeres team.
                </>
              ) : (
                <>
                  Download jeres komplette ESG-analyse eller del den med jeres team. Rapporten indeholder alle jeres svar og personlige anbefalinger.
                </>
              )}
            </p>
            
            {/* Download Options */}
            <div className="download-options">
              <button onClick={handleDownloadReport} className="download-btn primary">
                📄 Download Rapport (TXT)
              </button>
              <button onClick={handleDownloadJSON} className="download-btn secondary">
                💾 Download Data (JSON)
              </button>
              <button onClick={handleEmailContent} className="download-btn secondary">
                📧 Kopier Email Indhold
              </button>
            </div>
            
            <p className="download-note">
              🌳 <strong>Tænk på miljøet</strong> – del digitalt når det er muligt.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="company-summary">
        <p style={{ textAlign: 'center', fontWeight: 600, color: '#4b5563' }}>
          <strong>Reporting Progress – Power Your Business</strong>
        </p>
      </div>
    </div>
  )
}

// Helper function to generate text report
function generateTextReport(data) {
  const { company, results, sectionBreakdown, detailedAnswers, submissionDate } = data
  
  return `
ESG SELVTEST RESULTAT
=====================

VIRKSOMHEDSOPLYSNINGER
----------------------
Virksomhed: ${company.name}
Kontaktperson: ${company.contactPerson}
Email: ${company.email}
Telefon: ${company.phone || 'Ikke angivet'}
Branche: ${company.industry}
Medarbejdere: ${company.employees}

RESULTAT OVERSIGT
-----------------
Total Score: ${results.totalScore}/${results.maxScore} point (${results.percentage}%)
Niveau: ${results.level === 'beginner' ? 'Opstartsfasen' : results.level === 'intermediate' ? 'Har fat i tingene' : 'Godt i gang'}

${results.title}
${results.description}

NÆSTE SKRIDT
------------
${results.nextSteps}

DETALJEREDE SVAR
----------------
${detailedAnswers.map((qa, index) => 
  `${index + 1}. ${qa.question}
   Svar: ${qa.answer === 'ja' ? '✅ Ja' : qa.answer === 'nej' ? '❌ Nej' : '❓ Ved ikke'}`
).join('\n\n')}

SEKTION BREAKDOWN
-----------------
${Object.entries(sectionBreakdown).map(([key, section]) => {
  const sectionNames = {
    section1: 'Forståelse og bevidsthed',
    section2: 'Mål og data', 
    section3: 'Strategi og forretning',
    section4: 'Risici og fremtidssikring'
  }
  return `${sectionNames[key]}: ${section.score}/${section.max} point (${section.percentage}%)`
}).join('\n')}

Genereret: ${submissionDate}
ESG Selvtest - Bluwave
Reporting Progress – Power Your Business
`.trim()
}

// Helper function to generate email content
function generateEmailContent(data) {
  const { company, results, submissionDate } = data
  
  return `Emne: ESG Selvtest Resultat - ${company.name}

Hej ${company.contactPerson},

Her er resultatet af jeres ESG selvtest:

🏢 VIRKSOMHED: ${company.name}
📊 RESULTAT: ${results.totalScore}/${results.maxScore} point (${results.percentage}%)
🎯 NIVEAU: ${results.level === 'beginner' ? 'Opstartsfasen 🌱' : results.level === 'intermediate' ? 'Har fat i tingene 🌿' : 'Godt i gang 🌳'}

${results.title}
${results.description}

NÆSTE SKRIDT:
${results.nextSteps}

Med venlig hilsen,
ESG Selvtest Team

---
Genereret: ${submissionDate}
Reporting Progress – Power Your Business`
}
export default ResultsDisplay