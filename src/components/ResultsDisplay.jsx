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

  const getSectionRecommendation = (sectionKey, sectionData) => {
    if (sectionData.score >= 4) return null // No recommendation needed if score is max
    
    const recommendations = {
      section1: 'Identificer de ESG-faktorer der er mest relevante for jeres branche og forening.',
      section2: 'Vælg få først - det får det lettere at komme i gang.',
      section3: 'Sørg for at hele teamet forstår ESG og gør det til en del af virksomheden.',
      section4: 'Få overblik over ESG-risici og forbered jer på kommende rapporteringskrav.'
    }
    return recommendations[sectionKey]
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
        <h1 className="hero-title">ESG-resultat for <strong>{contactData.companyName}</strong></h1>
        <p className="hero-subtitle">Her er dit personlige testresultat samt anbefalinger til næste skridt, baseret på dine svar.</p>
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

      {/* Section Scores - New Addition */}
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
                <div className="section-bar" style={{
                  background: `linear-gradient(90deg, ${getScoreColor(recommendation.level)} ${sectionData.percentage}%, #e5e7eb ${sectionData.percentage}%)`
                }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Steps - Enhanced with Section Recommendations */}
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

        {/* Section-specific recommendations for areas needing improvement */}
        {Object.entries(sectionScores).some(([key, data]) => getSectionRecommendation(key, data)) && (
          <div className="section-recommendations">
            <h4>Specifikke anbefalinger baseret på jeres svar:</h4>
            <div className="recommendations-grid">
              {Object.entries(sectionScores).map(([sectionKey, sectionData]) => {
                const recommendation = getSectionRecommendation(sectionKey, sectionData)
                if (!recommendation) return null
                
                return (
                  <div key={sectionKey} className="section-recommendation">
                    <div className="rec-header">
                      <div className="rec-icon">💡</div>
                      <strong>{getSectionName(sectionKey)}</strong>
                    </div>
                    <p>{recommendation}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* BluWave CTA Section */}
      <div className="bluwave-cta-section">
        <h3>Vil du gøre ESG-rapportering lettere – og få reel forretningsværdi ud af det?</h3>
        <p>Med <strong>BluWave</strong>-platformen kan I arbejde med ESG <strong>enkelt, effektivt og compliant</strong>:</p>
        
        <div className="cta-features">
          <div className="cta-feature">
            <span className="feature-check">✅</span>
            <span>Automatisk CO₂-beregning og klimaregnskab</span>
          </div>
          <div className="cta-feature">
            <span className="feature-check">✅</span>
            <span>Brugervenlig struktur til ESG-dokumentation</span>
          </div>
          <div className="cta-feature">
            <span className="feature-check">✅</span>
            <span>Data og indsigter til at styrke jeres forretning</span>
          </div>
        </div>
        
        <p className="cta-closing">Kom i gang med ESG – med fokus på både krav og konkrete gevinster.</p>
        <div className="cta-action-box">
          <p><strong>Denne del må godt være mere tydelig – fx i en boks</strong></p>
          <p className="cta-action">Book en demo 👉 <a href="https://bluwave.dk" target="_blank" rel="noopener noreferrer">bluwave.dk</a></p>
        </div>
      </div>

      {/* Download & Share Section */}
      <div className="download-share-section">
        <div className="download-header">
          <div className="download-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="currentColor" />
            </svg>
          </div>
          <h3>Download og del dine resultater</h3>
          <p>Din ESG-rapport er sendt til <strong>{contactData.email}</strong>. Du kan også downloade eller dele den her:</p>
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

        <p className="email-note">
          <em>Tjek venligst din spam-mappe, hvis du ikke modtager mailen inden for 10 minutter.</em>
        </p>
      </div>

      {/* Branded Footer - Matching Email Template */}
      <div className="branded-footer">
        <p className="environment-note">
          🌳 <strong>Tænk på miljøet</strong> – <em>print kun denne rapport, hvis det er nødvendigt.</em>
        </p>
        
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