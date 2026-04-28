from ..models import VerifiedClaim, AgentFinding
import os
from ..database import get_db_connection

class CorrelationAgent:
    async def investigate(self, claim: VerifiedClaim) -> AgentFinding:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        evidence = []
        score = 0.1
        severity = "Low"
        
        # 1. Check if invoice has been reported by ANOTHER user
        cursor.execute("SELECT claimant_id FROM claim_invoices WHERE invoice_number = ?", (claim.invoice_number,))
        rows = cursor.fetchall()
        for r in rows:
            if r['claimant_id'] != claim.claimant_id and claim.invoice_number != "UNKNOWN":
                evidence.append(f"Invoice #{claim.invoice_number} match found for claimant '{claim.claimant_id}' AND another unrelated claimant '{r['claimant_id']}'.")
                score += 0.5
                
        # 1.5. Check dependent history bursts
        cursor.execute("SELECT dependent_count FROM claimant_dependents WHERE claimant_id = ?", (claim.claimant_id,))
        dep_row = cursor.fetchone()
        if dep_row and dep_row['dependent_count'] > 10:
            evidence.append(f"CRITICAL ANOMALY: Claimant has historically filed claims for {dep_row['dependent_count']} different dependents.")
            score += 0.8
                
        # 2. Check Provider Watchlist
        cursor.execute("SELECT risk_level, recent_claims_volume FROM provider_watchlist WHERE provider_name = ?", (claim.hospital_name,))
        prog_row = cursor.fetchone()
        if prog_row:
            if prog_row['risk_level'] == 'High':
                evidence.append(f"Provider '{claim.hospital_name}' is on a HIGH risk watch-list.")
                score += 0.3
                
            if prog_row['recent_claims_volume'] > 100:
                evidence.append(f"Provider '{claim.hospital_name}' shows a surge with {prog_row['recent_claims_volume']} claims in the last 14 days.")
                score += 0.2
        else:
             evidence.append(f"Provider '{claim.hospital_name}' has no negative history.")
             
        conn.close()

        score = min(score, 1.0)
        
        if score > 0.8: severity = "Critical"
        elif score > 0.5: severity = "High"
        elif score > 0.3: severity = "Medium"
        else: severity = "Low"
        
        desc = "Correlation analysis complete."
        if score > 0.6:
            desc += " Found severe anomalies matching known patterns."
        else:
            desc += " No significant historical anomalies detected."
            
        if not evidence:
            evidence.append("No database matches found.")

        return AgentFinding(
            agent_name="🕸️ Data Correlation Agent",
            severity=severity,
            finding_type="Correlation",
            score=score,
            description=desc,
            evidence_highlights=evidence
        )
