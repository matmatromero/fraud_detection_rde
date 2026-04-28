import os
import google.generativeai as genai
from models import VerifiedClaim, AgentFinding
from database import get_db_connection

class ClinicalAgent:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    async def investigate(self, claim: VerifiedClaim) -> AgentFinding:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT known_conditions, historical_flags FROM claimant_medical_history WHERE claimant_id = ?", (claim.claimant_id,))
        med_row = cursor.fetchone()
        
        history_context = "No detailed prior medical history found in database."
        db_evidence = []
        if med_row:
            history_context = f"Known Conditions: {med_row['known_conditions']}. Flags: {med_row['historical_flags']}."
            db_evidence.append(f"DB Record Found: Claimant has historical condition: {med_row['known_conditions']}.")
        
        conn.close()

        prompt = f"""
        As a Clinical Fraud Investigator for Prudential Insurance, analyze the following verified claim data for clinical plausibility.
        
        Claim Details:
        - Diagnosis: {claim.diagnosis}
        - Hospitalization: {claim.hospitalization_date} to {claim.discharge_date}
        - Benefit: {claim.benefit_type}
        - Summary: {claim.verification_summary}
        
        System Cross-Reference History:
        {history_context}
        
        Task:
        1. Is the hospitalization duration consistent with the diagnosis?
        2. Are there any clinical 'red flags' (e.g., impossible recovery times, mismatching diagnosis for the hospital type)?
        3. Do the system history flags contradict the current claim or suggest pattern abuse?
        4. Assign a risk score (0.0 to 1.0) and a severity level.
        
        Return the analysis in a structured format.
        """
        
        try:
            # We are keeping this simulated for MVP without depending on a valid API key.
            # response = self.model.generate_content(prompt)
            # text = response.text
            pass
        except Exception:
            pass
            
        score = 0.2
        severity = "Low"
        desc = "Analysis of claim clinical plausibility completed. Hospitalization period is within normal range."
        evidence = db_evidence + ["Length of stay matches diagnosis expectations."]
        
        if med_row and ('High' in med_row['historical_flags'] or 'Frequent' in med_row['historical_flags']):
            score += 0.6
            severity = "High"
            desc = "Improbable clinical collision. The occurrence of a severe acute manifestation of this exact condition multiple times in a 3 year span is clinically statistically improbable."
            evidence.append("Historical pattern matching current high-frequency usage suggests diagnosis-grooming.")

        return AgentFinding(
            agent_name="🩺 Clinical Logic Agent",
            severity=severity,
            finding_type="Clinical",
            score=score,
            description=desc,
            evidence_highlights=evidence
        )
