import React, { useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'libphonenumber-js'
import 'react-phone-number-input/style.css'
import './ContactForm.css'

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState({})

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

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone: value || ''
    }))
    
    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }))
    }
  }

  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }))
    validateField(fieldName)
  }

  const validateField = (fieldName) => {
    const newErrors = { ...errors }
    const value = formData[fieldName]

    switch (fieldName) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Fulde navn er påkrævet'
        } else if (value.trim().length < 2) {
          newErrors.fullName = 'Navn skal være mindst 2 tegn'
        } else {
          delete newErrors.fullName
        }
        break

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'E-mail er påkrævet'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Indtast en gyldig e-mail adresse'
        } else {
          delete newErrors.email
        }
        break

      case 'phone':
        if (!formData.phone) {
          newErrors.phone = 'Telefonnummer er påkrævet'
        } else if (!isValidPhoneNumber(formData.phone)) {
          newErrors.phone = 'Indtast et gyldigt telefonnummer'
        } else {
          delete newErrors.phone
        }
        break

      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Besked er påkrævet'
        } else if (value.trim().length < 10) {
          newErrors.message = 'Besked skal være mindst 10 tegn'
        } else {
          delete newErrors.message
        }
        break

      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Fulde navn er påkrævet'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Navn skal være mindst 2 tegn'
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail er påkrævet'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Indtast en gyldig e-mail adresse'
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Telefonnummer er påkrævet'
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = 'Indtast et gyldigt telefonnummer'
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Besked er påkrævet'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Besked skal være mindst 10 tegn'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      message: true
    })

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Call parent submit handler
      onSubmit(formData)
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: ''
      })
      setTouched({})
      setErrors({})
      
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ submit: 'Der opstod en fejl. Prøv venligst igen.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-form-wrapper">
      <div className="contact-form-container">
        {/* Leaf Icon at Top */}
        <div className="form-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#89B348"/>
            <path d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z" fill="#89B348"/>
            <path d="M5 6L5.5 8.5L8 9L5.5 9.5L5 12L4.5 9.5L2 9L4.5 8.5L5 6Z" fill="#89B348"/>
          </svg>
        </div>

        <div className="form-header">
          <h2>Kontakt os</h2>
          <p>Udfyld formularen nedenfor, så vender vi tilbage til dig hurtigst muligt.</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              <span className="label-text">Fulde navn</span>
              <span className="required-asterisk" aria-label="påkrævet">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => handleBlur('fullName')}
              placeholder="Indtast dit fulde navn"
              className={`form-input ${errors.fullName && touched.fullName ? 'error' : ''}`}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              aria-invalid={errors.fullName && touched.fullName ? 'true' : 'false'}
              autoComplete="name"
            />
            {errors.fullName && touched.fullName && (
              <span id="fullName-error" className="error-message" role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span className="label-text">E-mail adresse</span>
              <span className="required-asterisk" aria-label="påkrævet">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="din@email.dk"
              className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={errors.email && touched.email ? 'true' : 'false'}
              autoComplete="email"
            />
            {errors.email && touched.email && (
              <span id="email-error" className="error-message" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              <span className="label-text">Telefonnummer</span>
              <span className="required-asterisk" aria-label="påkrævet">*</span>
            </label>
            <PhoneInput
              id="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phone')}
              defaultCountry="DK"
              placeholder="Indtast telefonnummer"
              className={`phone-input ${errors.phone && touched.phone ? 'error' : ''}`}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
              autoComplete="tel"
            />
            {errors.phone && touched.phone && (
              <span id="phone-error" className="error-message" role="alert">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Message Field */}
          <div className="form-group">
            <label htmlFor="message" className="form-label">
              <span className="label-text">Besked/Kommentarer</span>
              <span className="required-asterisk" aria-label="påkrævet">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={() => handleBlur('message')}
              placeholder="Skriv din besked her (minimum 10 tegn)..."
              rows="4"
              className={`form-textarea ${errors.message && touched.message ? 'error' : ''}`}
              aria-describedby={errors.message ? 'message-error' : undefined}
              aria-invalid={errors.message && touched.message ? 'true' : 'false'}
              autoComplete="off"
            />
            <div className="character-count">
              {formData.message.length}/10 minimum
            </div>
            {errors.message && touched.message && (
              <span id="message-error" className="error-message" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="submit-error" role="alert">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            aria-describedby="submit-button-description"
          >
            {isSubmitting ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                <span>Sender...</span>
              </>
            ) : (
              <>
                <span>Send besked</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
          <p id="submit-button-description" className="sr-only">
            Klik for at sende din besked. Vi svarer inden for 24 timer.
          </p>
        </form>
      </div>
    </div>
  )
}

export default ContactForm