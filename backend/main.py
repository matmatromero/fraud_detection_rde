from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import VerifiedClaim, InvestigationReport, AgentFinding, InvestigationReport
from .agents.forensic import ForensicAgent
from .agents.clinical import ClinicalAgent
from .agents.correlation import CorrelationAgent
import asyncio
import os
from contextlib import asynccontextmanager
from .database import setup_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_db()
    yield

app = FastAPI(title="Prudential Agentic Fraud Investigator", lifespan=lifespan)

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/investigate", response_model=InvestigationReport)
async def run_investigation(claim: VerifiedClaim):
    # Initialize Agents
    forensic = ForensicAgent()
    clinical = ClinicalAgent(api_key=os.getenv("GEMINI_API_KEY", "mock_key"))
    correlation = CorrelationAgent()
    
    # Run investigations in parallel (Agentic Execution)
    results = await asyncio.gather(
        forensic.investigate(claim),
        clinical.investigate(claim),
        correlation.investigate(claim)
    )
    
    # Lead Investigator Synthesis (Agentic Reasoning Phase)
    all_scores = [r.score for r in results]
    avg_score = sum(all_scores) / len(all_scores)
    
    # Identify Conflict/Consensus
    high_findings = [r for r in results if r.score > 0.6]
    conflicts = len(high_findings) > 0 and len(high_findings) < len(results)
    
    tier = "Low"
    action = "Approve"
    if avg_score > 0.7:
        tier = "Critical"
        action = "Refer to SIU"
    elif avg_score > 0.4:
        tier = "High"
        action = "Escalate for Manual Audit"
        
    synthesis = f"Investigation complete for {claim.claim_id}. "
    if conflicts:
        synthesis += f"IDENTIFIED CASE CONFLICT: Specialist signals are divergent. {high_findings[0].agent_name} reports high risk, while others show nominal markers. "
    
    if tier in ["Critical", "High"]:
        synthesis += f"The Lead Investigator has synthesized a {tier} risk verdict based on {', '.join([r.agent_name for r in high_findings])}. Bespoke narrative: Patterns identified strongly suggest a coordinated fraud cohort signature."
    else:
        synthesis += "The Lead Investigator found no significant anomalies. All specialist signals are within normal operating bounds."

    report = InvestigationReport(
        claim_id=claim.claim_id,
        overall_risk_score=avg_score,
        risk_tier=tier,
        summary_brief=synthesis,
        findings=results,
        recommended_action=action
    )
    
    return report
