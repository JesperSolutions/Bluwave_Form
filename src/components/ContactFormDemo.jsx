import React, { useState } from 'react'
import ContactForm from './ContactForm'

const ContactFormDemo = () => {
  const [submittedData, setSubmittedData] = useState(null)

  const handleFormSubmit = (formData) => {
    console.log('Form submitted with data:', formData)
    setSubmittedData(formData)
    
    // Show success message
    alert(`Tak for din besked, ${formData.fullName}! Vi vender tilbage til dig på ${formData.email} hurtigst muligt.`)
  }

  const handleReset = () => {
    setSubmittedData(null)
  }

  return (
    <div>
      {!submittedData ? (
        <ContactForm onSubmit={handleFormSubmit} />
      ) : (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
          padding: '2rem 1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem 2rem',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#1f2937', marginBottom: '1rem' }}>Besked sendt!</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Tak for din besked, {submittedData.fullName}. Vi vender tilbage til dig på {submittedData.email} hurtigst muligt.
            </p>
            <button 
              onClick={handleReset}
              style={{
                background: 'linear-gradient(135deg, #89B348 0%, #7da63f 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Send ny besked
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactFormDemo