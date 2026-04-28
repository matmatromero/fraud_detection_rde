# Agentic Fraud Investigator: User Walkthrough Guide

Welcome to the **Prudential Agentic Fraud Investigator**. This system utilizes advanced AI agents to silently review, corroborate, and adjudicate medical claims *before* any money leaves the door. 

This guide will walk you through interacting with the platform as an Executive or Fraud Analyst.

---

## 1. Accessing the System
Open your web browser and navigate to the secure Cloud Application URL provided to you by your system administrator. 

No technical setup is required on your end. The AI agents and data processing happen securely in the backend.

---

## 2. The Dashboard (Command Center)
Upon opening the application, you will land on the **Agent Dashboard**. 

- **Executive Metrics (Top Bar):** At the top, you will see real-time Key Performance Indicators (KPIs) such as total "Bi-Annual Claims Cost Avoided" and "Anomalies Blocked". These actively update as the AI halts fraudulent payments.
- **Pending Claims Queue:** Below the metrics is your workflow queue. This lists incoming claims that require your attention.

**Action:** Look for a claim with a "Pending Review" status and click the **Process &rarr;** button on the far right.

---

## 3. The 4-Step Investigation Process
Clicking "Process" launches the investigation timeline for that specific claim. The system is broken down into four intelligent steps:

### Step 1: Intake Summary
- **What happens:** The **Intake Discovery Agent** automatically pulls context from disparate databases (Policy, Identity, OCR document scraping).
- **Your Role:** Review the aggregated high-level facts. You will see a "Claim Summary" narrative confirming the core details (Admission dates, benefits claimed, and total amount).

### Step 2: Evidence Review
- **What happens:** The system shows you exactly what documents were submitted.
- **Your Role:** On the left, you can review the submitted medical records (e.g., Doctor's Summary). On the right, you can see snippets of text that the AI has extracted directly from those documents to verify policy coverages.
- **Action:** Once satisfied, click the blue **Submit Extracted Facts to Agentic Gate &rarr;** button at the bottom right.

### Step 3: Agentic Fraud Gate (The AI Investigation)
This is where the magic happens. The claim is securely passed to three distinct AI specialized agents working in tandem. Click **"Launch Multi-Agent Scan"** to begin the automated investigation:

1. 🕵️ **Forensic Document Agent:** Scans the uploaded PDFs or images for digital alterations, font misalignment, or metadata tampering. 
2. 🩺 **Clinical Logic Agent:** Acts as an automated medical expert. It verifies if the hospital stay length rationally aligns with the diagnosis and checks historical records for "diagnosis-grooming" patterns.
3. 🕸️ **Data Correlation Agent:** Searches massive historical databases to see if the Claimant, Dependents, or the Hospital belongs to known "bad actor" networks.

Wait briefly for the AI agents to synthesize their final verdict.

### Step 4: Final Adjudication (The Verdict)
Once the Multi-Agent Gate finishes, it will generate a comprehensive narrative report and assess a final **Risk Tier**.

- **🟢 Cleared Case:** If no fraud patterns are detected, the system will highlight the investigation green. You can click "Proceed to Benefit Assessment" to view the final automated payout generation.
- **🔴 Critical/Blocked Case:** If severe anomalies are found (like a digitally altered PDF mixed with an impossible medical diagnosis), the agents will flag the case as **Blocked**. The system halts the pipeline and refuses to authorize a payout. The claim is automatically marked for manual Special Investigations Unit (SIU) follow-up.

Note: Even if a case is determined to be fraudulent, you can review the "Evidence Highlights" left by each AI Agent to understand exactly *why* the claim was rejected within seconds.

---

## Need Help?
If you experience any graphical issues or the system appears "Pending" for longer than 30 seconds, simply refresh your browser window to securely reload the dashboard queue.
