import React, { useState } from 'react'
import './ContactForm.css'

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    countryCode: '+45',
    phone: '',
    industry: '',
    employees: '',
    contactPreference: ''
  })

  const [errors, setErrors] = useState({})

  const countryCodes = [
    { code: '+45', country: 'DK', flag: '🇩🇰', name: 'Danmark' },
    { code: '+46', country: 'SE', flag: '🇸🇪', name: 'Sverige' },
    { code: '+47', country: 'NO', flag: '🇳🇴', name: 'Norge' },
    { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Tyskland' },
    { code: '+44', country: 'UK', flag: '🇬🇧', name: 'Storbritannien' },
    { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Holland' },
    { code: '+33', country: 'FR', flag: '🇫🇷', name: 'Frankrig' },
    { code: '+1', country: 'US', flag: '🇺🇸', name: 'USA' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.companyName.trim()) newErrors.companyName = 'Virksomhedsnavn er påkrævet'
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Kontaktperson er påkrævet'
    if (!formData.email.trim()) newErrors.email = 'E-mail er påkrævet'
    if (!formData.industry.trim()) newErrors.industry = 'Branche er påkrævet'
    if (!formData.employees.trim()) newErrors.employees = 'Antal medarbejdere er påkrævet'
    if (!formData.contactPreference.trim()) newErrors.contactPreference = 'Kontakt præference er påkrævet'
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Indtast en gyldig email'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Combine country code and phone number
      const fullPhone = formData.phone ? `${formData.countryCode} ${formData.phone}` : ''
      onSubmit({
        ...formData,
        phone: fullPhone
      })
    }
  }

  return (
    <div className="contact-form-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '20%' }}></div>
      </div>
      
      <div className="contact-form-header">
        <div className="step-indicator">
          <span className="step-text">Trin 1 af 5</span>
          <span className="progress-text">20% færdig</span>
        </div>
        <h2>Virksomhedsoplysninger</h2>
        <p>Indtast jeres virksomhedsoplysninger for at modtage jeres personlige ESG-vurdering og anbefalinger.</p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="companyName">
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21h18v-2H3v2zM5 10h4V8H5v2zm0 4h4v-2H5v2zM5 6h4V4H5v2zm6 4h8V8h-8v2zm0 4h8v-2h-8v2zm0-8h8V4h-8v2z" fill="currentColor"/>
              </svg>
              Virksomhedsnavn *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Indtast virksomhedens navn"
              className={errors.companyName ? 'error' : ''}
            />
            {errors.companyName && <span className="error-message">{errors.companyName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="contactPerson">
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9H21ZM12 17.5L6.5 12H17.5L12 17.5Z" fill="currentColor"/>
              </svg>
              Kontaktperson *
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="Indtast navn på kontaktperson"
              className={errors.contactPerson ? 'error' : ''}
            />
            {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="kontakt@virksomhed.dk"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
              </svg>
              Telefon
            </label>
            <div className="phone-input-container">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="country-code-select"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="12 34 56 78"
                className="phone-input"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="industry">
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
              Branche *
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={errors.industry ? 'error' : ''}
            >
              <option value="">Vælg branche</option>
              <option value="byggeri">Byggeri og anlæg</option>
              <option value="energi">Energi og forsyning</option>
              <option value="finans">Finans og forsikring</option>
              <option value="handel">Handel og detailhandel</option>
              <option value="industri">Industri og produktion</option>
              <option value="it">IT og teknologi</option>
              <option value="konsulent">Konsulent og rådgivning</option>
              <option value="landbrug">Landbrug og fødevarer</option>
              <option value="logistik">Logistik og transport</option>
              <option value="sundhed">Sundhed og social</option>
              <option value="turisme">Turisme og oplevelser</option>
              <option value="anden">Anden branche</option>
            </select>
            {errors.industry && <span className="error-message">{errors.industry}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="employees">
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4C16 2.9 16.9 2 18 2S20 2.9 20 4 19.1 6 18 6 16 5.1 16 4M6 2C7.1 2 8 2.9 8 4S7.1 6 6 6 4 5.1 4 4 4.9 2 6 2M12 2C13.1 2 14 2.9 14 4S13.1 6 12 6 10 5.1 10 4 10.9 2 12 2Z" fill="currentColor"/>
              </svg>
              Antal medarbejdere *
            </label>
            <select
              id="employees"
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              className={errors.employees ? 'error' : ''}
            >
              <option value="">Vælg antal medarbejdere</option>
              <option value="1-3">1-3 medarbejdere</option>
              <option value="1-3">1-3 medarbejdere</option>
              <option value="4-9">4-9 medarbejdere</option>
              <option value="10-49">10-49 medarbejdere</option>
              <option value="50-249">50-249 medarbejdere</option>
              <option value="250+">250+ medarbejdere</option>
            </select>
            {errors.employees && <span className="error-message">{errors.employees}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="contactPreference">
              <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2M12 17L7 12H10V8H14V12H17L12 17Z" fill="currentColor"/>
              </svg>
              Kontakt præference *
            </label>
            <select
              id="contactPreference"
              name="contactPreference"
              value={formData.contactPreference}
              onChange={handleChange}
              className={errors.contactPreference ? 'error' : ''}
            >
              <option value="">Vælg kontakt præference</option>
              <option value="yes">Ja, I må gerne kontakte mig med rådgivning og tilbud</option>
              <option value="no">Nej, jeg ønsker kun at modtage resultatet</option>
            </select>
            {errors.contactPreference && <span className="error-message">{errors.contactPreference}</span>}
          </div>
        </div>

        <div className="form-navigation">
          <button type="button" className="back-btn" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
            </svg>
            Forrige
          </button>
          <button type="submit" className="next-btn">
            Næste
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm