from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class ClaimDocument(BaseModel):
    id: str
    type: str  # e.g., "Medical Report", "Invoice", "ID"
    url: str
    verified: bool = False

class VerifiedClaim(BaseModel):
    claim_id: str
    claimant_id: str
    benefit_type: str  # e.g., "Hospital Indemnity", "Critical Illness"
    hospital_name: str
    hospitalization_date: date
    discharge_date: date
    diagnosis: str
    claim_amount: float
    invoice_number: str = "UNKNOWN"
    documents: List[ClaimDocument]
    verification_summary: str  # The output from Step 8 (verification step)

class AgentFinding(BaseModel):
    agent_name: str
    severity: str  # "Low", "Medium", "High", "Critical"
    finding_type: str # "Forensic", "Clinical", "Correlation"
    score: float # 0.0 to 1.0
    description: str
    evidence_highlights: List[str]

class InvestigationReport(BaseModel):
    claim_id: str
    overall_risk_score: float
    risk_tier: str
    summary_brief: str
    findings: List[AgentFinding]
    recommended_action: str # "Approve", "Refer to SIU", "Additional Verification"

class DiscoveryPacket(BaseModel):
    claim_id: str
    claimant_name: str
    aggregation_summary: str
    sources_indexed: List[str]
    discovery_log: List[str]
    entities: dict # Extracted entities like Amount, Provider, etc.
    initial_risk_score: float = 0.0

