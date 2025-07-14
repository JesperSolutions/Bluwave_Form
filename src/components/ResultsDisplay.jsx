import React, { useState, useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import './ResultsDisplay.css'

const ResultsDisplay = ({ results, contactData, downloadableData }) => {
  const { score, sectionScores, recommendation } = results
  const MAX_SCORE = 17
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const resultsRef = useRef(null)

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

  // Generate PDF of the results
  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return
    
    setIsGeneratingPDF(true)
    try {
      // Hide download section during PDF generation
      const downloadSection = document.querySelector('.download-share-section')
      if (downloadSection) downloadSection.style.display = 'none'
      
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      const fileName = `ESG-Rapport-${contactData.companyName}-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
      
      // Show download section again
      if (downloadSection) downloadSection.style.display = 'block'
      
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Der opstod en fejl ved generering af PDF. Prøv venligst igen.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Generate email content for sharing
  const generateEmailContent = () => {
    const emailContent = `
Emne: ESG Selvtest Resultat - ${contactData.companyName}

Hej,

Vi har netop gennemført en ESG-selvtest og vil gerne dele vores resultater med jer.

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

🌐 Vil du vide mere om ESG? Kontakt os på ja@bluwave.dk
    `.trim()
    
    return emailContent
  }

  // Share via email (opens default email client)
  const handleEmailShare = () => {
    const emailContent = generateEmailContent()
    const subject = `ESG Selvtest Resultat - ${contactData.companyName}`
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`
    window.location.href = mailtoLink
  }

  // Print the results
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="results-display" ref={resultsRef}>
      {/* Branded Header - Matching Email Template */}
      <div className="results-hero">
        <div className="brand-logo">
          <div className="logo-circle">
            <div className="logo-icon">🌿</div>
          </div>
        </div>
        <h1 className="hero-title">Jeres ESG Selvtest Resultat</h1>
        <p className="hero-subtitle">Dit ESG-resultat, {contactData.companyName}!</p>
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="currentColor" />
            </svg>
          </div>
          <h3>Download og del dine resultater</h3>
          <p>
            {contactData.contactPreference === 'yes' ? (
              <>
                <strong>Vi kontakter jer snart!</strong> I mellemtiden kan I downloade jeres ESG-rapport eller dele den med jeres team.
              </>
            ) : (
              <>
                Download jeres ESG-rapport eller del den med jeres team. Rapporten indeholder alle jeres svar og anbefalinger.
              </>
            )}
          </p>
        </div>

        {/* Download Options */}
        <div className="download-options">
          <button 
            onClick={handleDownloadPDF} 
            className="download-btn primary"
            disabled={isGeneratingPDF}
          >
            <span className="btn-icon">{isGeneratingPDF ? '⏳' : '📄'}</span>
            {isGeneratingPDF ? 'Genererer PDF...' : 'Download PDF Rapport'}
          </button>
          
          <button onClick={handlePrint} className="download-btn secondary">
            <span className="btn-icon">🖨️</span>
            Print Rapport
          </button>
          
          <button onClick={handleEmailShare} className="download-btn secondary">
            <span className="btn-icon">📧</span>
            Del via Email
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

      </div>

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

export default ResultsDisplay