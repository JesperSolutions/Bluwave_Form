export function ESGAssessment() {
  return `
    <div class="assessment-container">
      <header class="header">
        <h1>Er din virksomhed klar til ESG-rapportering?</h1>
        <p class="subtitle">En selvtest for små og mellemstore virksomheder (SMV'er)</p>
        <p class="description">
          Formålet med denne test er at give et hurtigt overblik over, hvor ESG-parat jeres virksomhed er – 
          og samtidig vise, hvorfor ESG er vigtig for forretningen.
        </p>
      </header>

      <div class="form-container">
        <form id="esg-assessment-form">
          <div class="contact-section">
            <h2>Få dit personlige resultat</h2>
            <p>Udfyld dine kontaktoplysninger for at modtage en detaljeret analyse af din virksomheds ESG-parathed.</p>
            
            <div class="contact-form">
              <div class="form-group">
                <label for="firstName">Fornavn *</label>
                <input type="text" id="firstName" name="firstName" required>
              </div>
              
              <div class="form-group">
                <label for="lastName">Efternavn *</label>
                <input type="text" id="lastName" name="lastName" required>
              </div>
              
              <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required>
              </div>
              
              <div class="form-group">
                <label for="phone">Telefon</label>
                <input type="tel" id="phone" name="phone">
              </div>
              
              <div class="form-group full-width">
                <label for="company">Virksomhed *</label>
                <input type="text" id="company" name="company" required>
              </div>
              
              <div class="form-group">
                <label for="position">Stilling</label>
                <input type="text" id="position" name="position">
              </div>
              
              <div class="form-group">
                <label for="companySize">Virksomhedsstørrelse</label>
                <select id="companySize" name="companySize">
                  <option value="">Vælg størrelse</option>
                  <option value="1-10">1-10 medarbejdere</option>
                  <option value="11-50">11-50 medarbejdere</option>
                  <option value="51-250">51-250 medarbejdere</option>
                  <option value="250+">250+ medarbejdere</option>
                </select>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Del 1: Har I styr på det grundlæggende?</h2>
            
            <div class="question">
              <p class="question-text">1. Har I i ledelsen en fælles forståelse af, hvad ESG (miljø, sociale forhold og god ledelse) betyder for jeres virksomhed?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q1_ja" name="q1" value="ja" required>
                  <label for="q1_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q1_nej" name="q1" value="nej">
                  <label for="q1_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q1_ved_ikke" name="q1" value="ved_ikke">
                  <label for="q1_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>

            <div class="question">
              <p class="question-text">2. Har I formuleret en holdning til klima, sociale ansvar og governance?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q2_ja" name="q2" value="ja" required>
                  <label for="q2_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q2_nej" name="q2" value="nej">
                  <label for="q2_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q2_ved_ikke" name="q2" value="ved_ikke">
                  <label for="q2_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>

            <div class="question">
              <p class="question-text">3. Har I identificeret, hvilke ESG-faktorer der er væsentlige for jeres virksomhed og jeres branche?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q3_ja" name="q3" value="ja" required>
                  <label for="q3_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q3_nej" name="q3" value="nej">
                  <label for="q3_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q3_ved_ikke" name="q3" value="ved_ikke">
                  <label for="q3_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Del 2: Har I sat mål – og måler I fremdrift?</h2>
            
            <div class="question">
              <p class="question-text">4. Har I konkrete mål for fx CO₂-reduktion, diversitet, medarbejdertrivsel eller ansvarlig leverandørstyring?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q4_ja" name="q4" value="ja" required>
                  <label for="q4_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q4_nej" name="q4" value="nej">
                  <label for="q4_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q4_ved_ikke" name="q4" value="ved_ikke">
                  <label for="q4_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>

            <div class="question">
              <p class="question-text">5. Har I processer til at indsamle og dokumentere data om jeres ESG-indsats?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q5_ja" name="q5" value="ja" required>
                  <label for="q5_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q5_nej" name="q5" value="nej">
                  <label for="q5_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q5_ved_ikke" name="q5" value="ved_ikke">
                  <label for="q5_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>

            <div class="question">
              <p class="question-text">6. Kommunikerer I allerede i dag om jeres ansvar og resultater – fx på hjemmeside, i tilbud eller i dialog med kunder?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q6_ja" name="q6" value="ja" required>
                  <label for="q6_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q6_nej" name="q6" value="nej">
                  <label for="q6_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q6_ved_ikke" name="q6" value="ved_ikke">
                  <label for="q6_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Del 3: Er ESG en del af jeres strategi og forretning?</h2>
            
            <div class="question">
              <p class="question-text">7. Er ESG en del af jeres strategi og værdigrundlag – eller blot noget, I "skal" gøre?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q7_ja" name="q7" value="ja" required>
                  <label for="q7_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q7_nej" name="q7" value="nej">
                  <label for="q7_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q7_ved_ikke" name="q7" value="ved_ikke">
                  <label for="q7_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>

            <div class="question">
              <p class="question-text">8. Har jeres vigtigste kunder eller samarbejdspartnere spurgt ind til jeres ESG-indsats?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q8_ja" name="q8" value="ja" required>
                  <label for="q8_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q8_nej" name="q8" value="nej">
                  <label for="q8_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q8_ved_ikke" name="q8" value="ved_ikke">
                  <label for="q8_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>

            <div class="question">
              <p class="question-text">9. Har I oplevet, at ESG-krav er blevet en konkurrenceparameter (f.eks. i udbud, partnerskaber eller investeringer)?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q9_ja" name="q9" value="ja" required>
                  <label for="q9_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q9_nej" name="q9" value="nej">
                  <label for="q9_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q9_ved_ikke" name="q9" value="ved_ikke">
                  <label for="q9_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Del 4: License to operate, risici og fremtidssikring</h2>
            
            <div class="question">
              <p class="question-text">10. Ville I kunne dokumentere jeres ESG-arbejde, hvis I blev spurgt i morgen?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q10_ja" name="q10" value="ja" required>
                  <label for="q10_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q10_nej" name="q10" value="nej">
                  <label for="q10_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q10_ved_ikke" name="q10" value="ved_ikke">
                  <label for="q10_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>

            <div class="question">
              <p class="question-text">11. Er I klar over, at krav til ESG-rapportering allerede gælder store virksomheder – og at de krav nu bevæger sig ud i leverandørkæden?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q11_ja" name="q11" value="ja" required>
                  <label for="q11_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q11_nej" name="q11" value="nej">
                  <label for="q11_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q11_ved_ikke" name="q11" value="ved_ikke">
                  <label for="q11_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>

            <div class="question">
              <p class="question-text">12. Har I overblik over de risici, der kan ramme jeres forretning, hvis I ikke arbejder systematisk med ESG (f.eks. mistet forretning, skadet omdømme, medarbejderflugt eller højere finansieringsomkostninger)?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q12_ja" name="q12" value="ja" required>
                  <label for="q12_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q12_nej" name="q12" value="nej">
                  <label for="q12_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q12_ved_ikke" name="q12" value="ved_ikke">
                  <label for="q12_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>

            <div class="question">
              <p class="question-text">13. Ville det styrke jeres brand, rekruttering og relationer, hvis I kunne vise ansvar og resultater på ESG?</p>
              <div class="options">
                <div class="option">
                  <input type="radio" id="q13_ja" name="q13" value="ja" required>
                  <label for="q13_ja">Ja</label>
                </div>
                <div class="option">
                  <input type="radio" id="q13_nej" name="q13" value="nej">
                  <label for="q13_nej">Nej</label>
                </div>
                <div class="option">
                  <input type="radio" id="q13_ved_ikke" name="q13" value="ved_ikke">
                  <label for="q13_ved_ikke">Ved ikke</label>
                </div>
              </div>
            </div>
          </div>

          <div class="submit-section">
            <button type="submit" class="submit-btn" id="submit-btn">
              <span class="btn-text">Få mit ESG-resultat</span>
            </button>
            <div id="form-message"></div>
          </div>
        </form>

        <div id="result-section" style="display: none;"></div>
      </div>
    </div>
  `
}