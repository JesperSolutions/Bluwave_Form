import React, { useState } from 'react'
import './ResultsDisplay.css'

const ResultsDisplay = ({ results, contactData, downloadableData }) => {
  const { score, sectionScores, recommendation } = results
  const MAX_SCORE = 17
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailForm, setEmailForm] = useState({
    recipients: '',
    message: '',
    subject: `ESG Selvtest Resultat - ${contactData.companyName}`
  })

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

  // Generate email content that matches the template design
  const generateEmailContent = () => {
    const emailContent = `
Emne: ${emailForm.subject}

${emailForm.message ? `${emailForm.message}\n\n---\n\n` : ''}

🏢 ESG SELVTEST RESULTAT

Virksomhed: ${contactData.companyName}
Kontaktperson: ${contactData.contactPerson}

📊 RESULTAT
Score: ${score}/${MAX_SCORE} point (${getScorePercentage(score)}%)
Niveau: ${recommendation.level === 'beginner' ? 'Opstartsfasen 🌱' : recommendation.level === 'intermediate' ? 'Har fat i tingene 🌿' : 'Godt i gang 🌳'}

${recommendation.title}
${recommendation.text}

🎯 NÆSTE SKRIDT
${downloadableData.results.nextSteps}

📋 SEKTIONSRESULTATER
${Object.entries(sectionScores).map(([key, section]) => 
  `${getSectionName(key)}: ${section.score}/${section.max} point (${section.percentage}%)`
).join('\n')}

---
Genereret: ${downloadableData.submissionDate}
ESG Selvtest - Bluwave
Reporting Progress – Power Your Business

🌐 Vil du vide mere om ESG? Kontakt os på ja@bluwave.dk
    `.trim()
    
    return emailContent
  }

  // Download functions
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

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(downloadableData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ESG-Data-${contactData.companyName}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleEmailShare = () => {
    const emailContent = generateEmailContent()
    const mailtoLink = `mailto:${emailForm.recipients}?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(emailContent)}`
    window.location.href = mailtoLink
    setShowEmailModal(false)
  }

  const handleCopyToClipboard = () => {
    const emailContent = generateEmailContent()
    navigator.clipboard.writeText(emailContent).then(() => {
      alert('Email indhold kopieret til udklipsholder!')
    }).catch(() => {
      // Fallback - show in new window
      const newWindow = window.open('', '_blank')
      newWindow.document.write(`<pre style="font-family: Arial; padding: 20px; white-space: pre-wrap;">${emailContent}</pre>`)
    })
  }

  return (
    <div className="results-display">
      {/* Branded Header - Matching Email Template */}
      <div className="results-hero">
        <div className="hero-background">
          {/* Bluwave Logo */}
          <div className="brand-logo">
            <div className="logo-circle">
              <div className="logo-icon">🌿</div>
            </div>
          </div>
          
          <h1 className="hero-title">Jeres ESG Selvtest Resultat</h1>
          <p className="hero-subtitle">Dit ESG-resultat, {contactData.companyName}!</p>
        </div>
      </div>

      {/* Score Section - Matching Email Design */}
      <div className="score-section">
        <div className="score-emoji">{getScoreIcon(recommendation.level)}</div>
        
        <div className="score-circle-container">
          <div className="score-circle" style={{ borderColor: getScoreColor(recommendation.level) }}>
            <div className="score-number" style={{ color: getScoreColor(recommendation.level) }}>{score}</div>
            <div className="score-max">/ {MAX_SCORE}</div>
          </div>
        </div>
        
        <div className="score-percentage" style={{ color: getScoreColor(recommendation.level) }}>
          {getScorePercentage(score)}% ESG-parat
        </div>
        
        <h2 className="recommendation-title">{recommendation.title}</h2>
        <p className="recommendation-text">{recommendation.text}</p>
      </div>

      {/* Company Info - Matching Email Grid */}
      <div className="company-info-section">
        <h3>Virksomhedsoplysninger</h3>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-label">VIRKSOMHED</div>
            <div className="info-value">{contactData.companyName}</div>
          </div>
          <div className="info-card">
            <div className="info-label">KONTAKTPERSON</div>
            <div className="info-value">{contactData.contactPerson}</div>
          </div>
          <div className="info-card">
            <div className="info-label">BRANCHE</div>
            <div className="info-value">{contactData.industry}</div>
          </div>
          <div className="info-card">
            <div className="info-label">MEDARBEJDERE</div>
            <div className="info-value">{contactData.employees}</div>
          </div>
        </div>
      </div>

      {/* Contact Preference - Matching Email Style */}
      <div className="contact-preference-section">
        <h3>Kontakt præference</h3>
        <div className="preference-card">
          <div className="preference-icon">
            {contactData.contactPreference === 'yes' ? '📞' : '📧'}
          </div>
          <div className="preference-content">
            <div className="preference-title">
              {contactData.contactPreference === 'yes' 
                ? 'Vi kontakter jer snart!' 
                : 'Kun resultat ønsket'}
            </div>
            <div className="preference-description">
              {contactData.contactPreference === 'yes'
                ? `En af vores ESG-eksperter vil kontakte jer på ${contactData.email} inden for 2 arbejdsdage med personlige anbefalinger.`
                : 'I har valgt kun at modtage resultatet. I kan altid kontakte os på ja@bluwave.dk hvis I senere ønsker rådgivning.'}
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps - Matching Email Style */}
      <div className="next-steps-section">
        <h3>Jeres næste skridt</h3>
        <div className="next-steps-content">
          {downloadableData.results.nextSteps}
        </div>
      </div>

      {/* Download & Share Section - New Branded Design */}
      <div className="download-share-section">
        <div className="download-header">
          <div className="download-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" fill="currentColor" />
            </svg>
          </div>
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
        </div>

        {/* Download Options */}
        <div className="download-options">
          <button onClick={handleDownloadReport} className="download-btn primary">
            <span className="btn-icon">📄</span>
            Download Rapport (TXT)
          </button>
          
          <button onClick={handleDownloadJSON} className="download-btn secondary">
            <span className="btn-icon">💾</span>
            Download Data (JSON)
          </button>
          
          <button onClick={() => setShowEmailModal(true)} className="download-btn secondary">
            <span className="btn-icon">📧</span>
            Del via Email
          </button>
          
          <button onClick={handleCopyToClipboard} className="download-btn secondary">
            <span className="btn-icon">📋</span>
            Kopier Indhold
          </button>
        </div>

        {/* Social Share */}
        <div className="social-share">
          <p className="share-label">Del på sociale medier:</p>
          <div className="social-buttons">
            <button 
              onClick={() => {
                const text = `Vi har netop gennemført en ESG-selvtest og scorede ${score}/${MAX_SCORE} point! 🌿 #ESG #Bæredygtighed`
                const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`
                window.open(url, '_blank')
              }}
              className="social-btn linkedin"
            >
              LinkedIn
            </button>
            
            <button 
              onClick={() => {
                const text = `Vi scorede ${score}/${MAX_SCORE} point i ESG-selvtest! 🌱 Se hvordan jeres virksomhed klarer sig:`
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
                window.open(url, '_blank')
              }}
              className="social-btn twitter"
            >
              Twitter
            </button>
          </div>
        </div>

        <p className="download-note">
          🌳 <strong>Tænk på miljøet</strong> – del digitalt når det er muligt.
        </p>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="email-modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="email-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Del ESG-resultater via email</h3>
              <button onClick={() => setShowEmailModal(false)} className="close-btn">×</button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Modtagere (email adresser, adskilt med komma):</label>
                <input
                  type="email"
                  multiple
                  value={emailForm.recipients}
                  onChange={(e) => setEmailForm({...emailForm, recipients: e.target.value})}
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
              
              <div className="form-group">
                <label>Emne:</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Personlig besked (valgfri):</label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                  placeholder="Tilføj en personlig besked til dine resultater..."
                  rows="3"
                />
              </div>
              
              <div className="email-preview">
                <h4>Forhåndsvisning:</h4>
                <div className="preview-content">
                  <pre>{generateEmailContent()}</pre>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button onClick={() => setShowEmailModal(false)} className="btn-cancel">
                Annuller
              </button>
              <button onClick={handleEmailShare} className="btn-send" disabled={!emailForm.recipients}>
                Åbn i Email App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branded Footer - Matching Email Template */}
      <div className="branded-footer">
        <h3>Tak for jeres deltagelse!</h3>
        <p>Vi håber denne analyse giver jer værdifuld indsigt i jeres ESG-rejse.</p>
        <p>Har I spørgsmål eller brug for hjælp til at komme videre, er I altid velkomne til at kontakte os.</p>
        
        <p className="footer-date">
          Genereret {downloadableData.submissionDate}<br />
          ESG Selvtest - Bluwave
        </p>
        
        <p className="footer-tagline">
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

export default ResultsDisplay