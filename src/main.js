import './style.css'
import { ESGAssessment } from './components/ESGAssessment.js'

document.querySelector('#app').innerHTML = `
  <div class="app-container">
    ${ESGAssessment()}
  </div>
`

// Initialize the form after DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const { initializeForm } = await import('./components/FormHandler.js')
  initializeForm()
})