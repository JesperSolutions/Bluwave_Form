import React, { useState } from 'react'
import './ContactForm.css'

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: '',
    employees: ''
  })

  const [errors, setErrors] = useState({})

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
      onSubmit(formData)
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
              <span className="icon">🏢</span>
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
              <span className="icon">👤</span>
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
              <span className="icon">✉️</span>
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
              <span className="icon">📞</span>
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+45 12 34 56 78"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="industry">
              <span className="icon">🏭</span>
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
              <span className="icon">👥</span>
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
              <option value="1-9">1-9 medarbejdere</option>
              <option value="10-49">10-49 medarbejdere</option>
              <option value="50-249">50-249 medarbejdere</option>
              <option value="250+">250+ medarbejdere</option>
            </select>
            {errors.employees && <span className="error-message">{errors.employees}</span>}
          </div>
        </div>

        <div className="form-navigation">
          <button type="button" className="back-btn" disabled>
            <span>←</span> Forrige
          </button>
          <button type="submit" className="next-btn">
            Næste <span>→</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm