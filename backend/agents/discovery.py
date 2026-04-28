from models import VerifiedClaim, DiscoveryPacket
from database import get_db_connection
import asyncio

class DiscoveryAgent:
    """
    Agent responsible for Phase 0: Data Gathering and Triage.
    Aggregates data from Claims DB, Medical Records, and Policy Engine.
    """
    
    async def aggregate(self, claim: VerifiedClaim) -> DiscoveryPacket:
        # Simulate real-time retrieval from multi-sources
        log = [
            f"Initiating Discovery Sequence for {claim.claim_id}...",
            "Source: Connecting to Enterprise Claims DB (SQL)... Done.",
            f"Source: Fetching Medical Records for Claimant {claim.claimant_id}...",
            "Source: Running OCR on 'Hospital_Bill_Final.pdf'...",
            f"Source: Validating Policy Coverage for '{claim.benefit_type}'..."
        ]
        
        sources = ["Claims DB", "OCR Engine", "Policy Database", "Medical History"]
        
        entities = {
            "claimant": claim.claimant_id,
            "provider": claim.hospital_name,
            "diagnosis": claim.diagnosis,
            "amount_claimed": claim.claim_amount,
            "document_count": len(claim.documents) or 3
        }
        
        # Initial risk scan during discovery
        initial_score = 0.1
        if "Critical" in claim.verification_summary or "Discrepancy" in claim.verification_summary:
            log.append("Intake Alert: Found initial metadata discrepancy in header.")
            initial_score = 0.4
            
        return DiscoveryPacket(
            claim_id=claim.claim_id,
            claimant_name=getattr(claim, 'claimant_name', 'Unknown User'),
            aggregation_summary="Successfully aggregated profile from 4 enterprise sources.",
            sources_indexed=sources,
            discovery_log=log,
            entities=entities,
            initial_risk_score=initial_score
        )
