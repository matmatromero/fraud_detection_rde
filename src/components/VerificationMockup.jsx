import React, { useState } from 'react';
import { 
    AlertTriangle, 
    CheckCircle2, 
    FileText, 
    Database, 
    ShieldAlert, 
    Search,
    ChevronDown,
    Activity,
    FileCheck,
    AlertCircle,
    Info,
    Sparkles,
    Eye,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InvestigationDashboard from './InvestigationDashboard';

const CLEAN_MOCK = {
    claim_id: "C-2026-1353457",
    claimant_id: "USER_1122",
    claimant_name: "Jane Doe",
    group_name: "Brasfield & Gorrie...",
    benefit_type: "HIP",
    hospital_name: "UAB HOSPITAL",
    hospitalization_date: "2025-11-12",
    discharge_date: "2026-03-11",
    diagnosis: "Prematurity",
    claim_amount: 13500.00,
    documents: [],
    verification_summary: "Facts extracted: UAB Hospital stay verified. ID Match.",
    invoice_number: "INV-1100",
    is_fraud: false
};

const FRAUD_MOCK = {
    claim_id: "C-2026-9999999",
    claimant_id: "USER_8812",
    claimant_name: "John Doe",
    group_name: "Test Group LLC",
    benefit_type: "HIP",
    hospital_name: "General City Hospital",
    hospitalization_date: "2024-03-10",
    discharge_date: "2024-03-15",
    diagnosis: "Severe Acute Gastric Infection",
    claim_amount: 12500.00,
    documents: [],
    verification_summary: "Facts extracted: 5-day stay. ID Match.",
    invoice_number: "INV-9283",
    is_fraud: true
};

const CLAIMS_LIST = [CLEAN_MOCK, FRAUD_MOCK];

const VerificationMockup = () => {
    const [view, setView] = useState('list'); // 'list' or 'details'
    const [activeTab, setActiveTab] = useState('Summary');
    const [discoveryData, setDiscoveryData] = useState(null);
    const [isDiscovering, setIsDiscovering] = useState(false);
    const [claimData, setClaimData] = useState(null);
    const [fraudStatus, setFraudStatus] = useState('Pending'); // Pending, Cleared, Blocked
    const [investigationReport, setInvestigationReport] = useState(null);
    const [showGuide, setShowGuide] = useState(false);
    
    // Global KPIs (Pre-seeded with $1.2M+ historical savings)
    const [kpis, setKpis] = useState({
        costAvoided: 1245600,
        detectionRate: 100,
        leakageRate: 0,
        totalBlocked: 42
    });

    const tabs = ['Summary', 'Claim Details', 'Fraud Detection Agent', 'Benefit Assessment Details'];

    const handleInvestigationComplete = (report) => {
        setInvestigationReport(report);
        if (report.overall_risk_score > 0.6) {
            setFraudStatus('Blocked');
            // Update KPIs in real-time
            setKpis(prev => ({
                ...prev,
                costAvoided: prev.costAvoided + claimData.claim_amount,
                totalBlocked: prev.totalBlocked + 1
            }));
        } else {
            setFraudStatus('Cleared');
        }
    };

    const KPIHeader = () => (
        <div className="bg-[#1A1C1E] text-white px-8 py-2.5 flex items-center justify-between border-b border-slate-700 shadow-inner">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Executive Fraud Command Center</span>
            </div>
            <div className="flex gap-12">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Bi-Annual Claims Cost Avoided</span>
                    <span className="text-sm font-black text-emerald-400">${kpis.costAvoided.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end border-l border-slate-700 pl-8">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Fraud Detected Before Payment</span>
                    <span className="text-sm font-black text-white">{kpis.detectionRate}%</span>
                </div>
                <div className="flex flex-col items-end border-l border-slate-700 pl-8">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Fraud Leakage Rate</span>
                    <span className="text-sm font-black text-blue-400">{kpis.leakageRate.toFixed(1)}%</span>
                </div>
                <div className="flex flex-col items-end border-l border-slate-700 pl-8">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Anomalies Blocked</span>
                    <span className="text-sm font-black text-white">{kpis.totalBlocked}</span>
                </div>
            </div>
        </div>
    );

    const handleSelectClaim = async (claim) => {
        setClaimData(claim);
        setFraudStatus('Pending');
        setInvestigationReport(null);
        setActiveTab('Summary');
        setView('details');
        
        // Trigger Agentic Discovery
        setIsDiscovering(true);
        setDiscoveryData(null);
        
        // Simulate Discovery Agent Backend Call
        await new Promise(r => setTimeout(r, 2000));
        setDiscoveryData({
            aggregator: "Intake Discovery Agent",
            log: [
                "Querying Claims Repository (SQL)... Done.",
                "Source: OCR Engine indexing medical_report.pdf...",
                "Source: Policy Engine syncing HIP coverage...",
                "Entity Extraction: Diagnosis confirmed as " + claim.diagnosis
            ],
            sources: ["Claims DB", "OCR Engine", "Policy Database"],
            status: "Success"
        });
        setIsDiscovering(false);
    };

    const steps = [
        { name: 'Summary', label: '1. Intake Summary', icon: Activity },
        { name: 'Claim Details', label: '2. Evidence Review', icon: FileText },
        { name: 'Fraud Detection Agent', label: '3. Agentic Fraud Gate', icon: ShieldAlert },
        { name: 'Benefit Assessment Details', label: '4. Final Adjudication', icon: FileCheck }
    ];

    const WorkflowStepper = () => {
        const currentStepIndex = Math.max(0, steps.findIndex(s => s.name === activeTab));
        
        return (
            <div className="bg-white border-b px-8 py-6 shadow-sm overflow-hidden flex justify-center">
                <div className="flex items-center w-full max-w-4xl relative">
                    {/* Connecting LineBackground */}
                    <div className="absolute top-[22px] left-[5%] right-[5%] h-0.5 bg-slate-100 z-0" />
                    
                    {/* Active Progress Line */}
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ 
                            width: `${(currentStepIndex / (steps.length - 1)) * 90}%`
                        }}
                        className="absolute top-[22px] left-[5%] h-0.5 bg-blue-600 z-0 transition-all duration-500"
                    />

                    {steps.map((step, idx) => {
                        const isCompleted = idx < currentStepIndex;
                        const isActive = idx === currentStepIndex;
                        const isLocked = step.name === 'Benefit Assessment Details' && fraudStatus !== 'Cleared';
                        const StepIcon = step.icon;

                        return (
                            <div 
                                key={step.name} 
                                className="flex flex-col items-center flex-1 relative z-10"
                                onClick={() => {
                                    if (isLocked) return;
                                    setActiveTab(step.name);
                                }}
                            >
                                {/* Step Circle */}
                                <motion.div 
                                    className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                                        isActive 
                                            ? 'bg-blue-600 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white' 
                                            : isCompleted 
                                                ? 'bg-white border-blue-600 text-blue-600' 
                                                : isLocked
                                                    ? 'bg-slate-50 border-slate-200 text-slate-300 opacity-60 cursor-not-allowed'
                                                    : 'bg-white border-slate-200 text-slate-400'
                                    }`}
                                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 size={20} />
                                    ) : isLocked ? (
                                        <Lock size={18} />
                                    ) : (
                                        <StepIcon size={20} />
                                    )}
                                </motion.div>

                                {/* Step Label */}
                                <span className={`mt-3 text-[10px] font-black uppercase tracking-widest transition-colors text-center ${
                                    isActive ? 'text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                                }`}>
                                    {step.label}
                                </span>

                                {/* Status Active Indicator */}
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeStep"
                                        className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-blue-600"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (view === 'list') {
        return (
            <div className="w-full h-full flex flex-col font-sans bg-[#F4F6F8]">
                <div className="bg-[#0070F0] text-white px-6 py-3 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                        <span className="font-black tracking-widest text-lg">accenture</span>
                        <span className="opacity-50">|</span>
                        <span className="font-bold flex items-center gap-2">
                            <ShieldAlert size={18} /> Prudential
                        </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-bold">
                        <span>Agent Dashboard</span>
                        <span>Queue ▾</span>
                        <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center cursor-pointer">
                            M
                        </div>
                    </div>
                </div>

                <KPIHeader />
                
                <div className="p-8 max-w-6xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Pending Claims Queue</h1>
                        <button 
                            onClick={() => setShowGuide(!showGuide)}
                            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-100 transition border border-blue-200 shadow-sm"
                        >
                            <Info size={16} /> 
                            {showGuide ? "Hide How-to Guide" : "📖 How to use this UI"}
                        </button>
                    </div>

                    <AnimatePresence>
                    {showGuide && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white border-l-4 border-l-blue-500 rounded-r shadow-md mb-8 overflow-hidden"
                        >
                            <div className="p-6">
                                <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><CheckCircle2 size={20} className="text-blue-500"/> Step-by-Step UI Guide</h2>
                                <div className="grid grid-cols-2 gap-8 text-sm text-slate-700">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-bold text-blue-600 mb-1">Starting a Claim</h3>
                                            <p className="mb-1">1. Find a pending claim in the list below (e.g. John Doe).</p>
                                            <p>2. Click the <span className="bg-slate-100 border px-1 py-0.5 rounded text-xs font-bold">Process &rarr;</span> button at the far right.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-blue-600 mb-1">Step 1: Intake Summary</h3>
                                            <p className="mb-1">3. Wait a few seconds for the initial Intake Agent to finish scanning.</p>
                                            <p>4. When you are done reading, <b>look at the top of the next screen</b> and click the second circle titled <b>2. EVIDENCE REVIEW</b>.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-blue-600 mb-1">Step 2: Evidence Review</h3>
                                            <p className="mb-1">5. Review the extracted medical document on the left.</p>
                                            <p>6. Scroll to the very bottom right and click the blue button: <b>Submit Extracted Facts to Agentic Gate &rarr;</b>.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 border-l pl-8">
                                        <div>
                                            <h3 className="font-bold text-blue-600 mb-1">Step 3: Agentic Fraud Gate</h3>
                                            <p className="mb-1">7. Once you are on the 3rd tab, click <b>Launch Multi-Agent Scan</b>.</p>
                                            <p>8. Watch the three AI agents process the forensic and clinical logs in real-time.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-blue-600 mb-1">Step 4: Final Outcome</h3>
                                            <p className="mb-1">9. <b>If Cleared (Green):</b> Click the new green "Proceed to Benefit Assessment" button at the bottom.</p>
                                            <p>10. <b>If Fraud (Red):</b> The system locks automatically.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-blue-600 mb-1">Returning to this Page</h3>
                                            <p>11. At any time, click <b>&larr; Back to Queue</b> in the top-left dark blue navigation bar to choose another user from this list.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Claim ID</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Claimant</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Benefit</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Admitted</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {CLAIMS_LIST.map((c, i) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                        <td className="p-4 font-bold text-slate-800">{c.claim_id}</td>
                                        <td className="p-4 text-sm text-slate-600">{c.claimant_name}</td>
                                        <td className="p-4 text-sm text-slate-600">{c.benefit_type}</td>
                                        <td className="p-4 text-sm text-slate-600">{c.hospitalization_date}</td>
                                        <td className="p-4 text-sm font-bold text-slate-700">${c.claim_amount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">Pending Review</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleSelectClaim(c)}
                                                className="bg-white border text-blue-600 px-4 py-1.5 rounded text-xs font-bold shadow-sm hover:bg-blue-50"
                                            >
                                                Process &rarr;
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col font-sans bg-[#FAFBFD]">
            {/* Header */}
            <div className="bg-[#0070F0] text-white px-6 py-3 flex items-center justify-between shadow-md z-10 relative">
                <div className="flex items-center gap-3">
                    <span className="font-black tracking-widest text-lg">accenture</span>
                    <span className="opacity-50">|</span>
                    <span className="font-bold flex items-center gap-2">
                        <ShieldAlert size={18} /> Prudential
                    </span>
                </div>
                <div className="flex items-center gap-6 text-sm font-bold">
                    <span className="cursor-pointer" onClick={() => setView('list')}>&larr; Back to Queue</span>
                    <span>Agent Dashboard</span>
                    <span>Queue ▾</span>
                    <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center cursor-pointer">
                        M
                    </div>
                </div>
            </div>

            <KPIHeader />


            {/* Sub-header / Case Details */}
            <div className="bg-white border-b px-8 py-4 flex items-center justify-between text-xs font-bold text-slate-500 shadow-sm z-0 relative">
                <div className="flex justify-between w-full mx-auto items-center">
                    <span>Case ID : <span className="text-slate-800">QB-4127</span></span>
                    <span>Claim ID : <span className="text-slate-800">{claimData.claim_id}</span></span>
                    <span>Claim Type : <span className="text-slate-800">New</span></span>
                    <span>Channel : <span className="text-slate-800">Web</span></span>
                    <span>Claimant : <span className="text-slate-800">{claimData.claimant_name}</span></span>
                    <span>Group Name : <span className="text-slate-800">{claimData.group_name}</span></span>
                    <span>Claimed Benefit : <span className="text-slate-800">{claimData.benefit_type}</span></span>
                    <div className="flex gap-2">
                        <button className="bg-white border text-slate-800 px-3 py-1.5 rounded items-center flex gap-2 hover:bg-slate-50 transition">
                            <FileText size={14} /> View Extracted Info.
                        </button>
                        <button className="bg-slate-900 text-white px-4 py-1.5 rounded-full hover:bg-slate-800 transition">
                            Take Action
                        </button>
                    </div>
                </div>
            </div>

            <WorkflowStepper />
            <div className="flex-grow p-8 w-full mx-auto overflow-y-auto">
                <AnimatePresence mode="wait">
                    {/* --- SUMMARY TAB --- */}
                    {activeTab === 'Summary' && (
                        <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                            
                            {/* Discovery Agent Activity Panel */}
                            {isDiscovering && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-slate-900 rounded-xl p-8 border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.1)] relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-20">
                                        <Database size={100} className="text-blue-500" />
                                    </div>
                                    <div className="relative z-10 flex flex-col items-center justify-center text-center py-4">
                                        <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4 border border-blue-500/50 animate-pulse">
                                            <Search className="text-blue-400" size={32} />
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Intake Discovery Agent</h3>
                                        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse mb-8 italic">Aggregating Enterprise Data Sources...</p>
                                        
                                        <div className="w-full max-w-md space-y-3">
                                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-blue-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '100%' }}
                                                    transition={{ duration: 2 }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                <span>Claims DB</span>
                                                <span>OCR Pipeline</span>
                                                <span>Policy Sync</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {!isDiscovering && discoveryData && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-600 rounded text-white"><Search size={16}/></div>
                                        <div>
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Intake Discovery Agent</p>
                                            <p className="text-xs text-blue-800 font-bold">Claim footprint synthesized from 3 enterprise sources.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {discoveryData.sources.map(s => (
                                            <span key={s} className="text-[8px] font-bold bg-white border px-2 py-0.5 rounded text-slate-500">{s}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Claim Summary Box */}
                            <div className="bg-[#F8EDFF] border border-purple-100 p-4 rounded text-sm text-slate-700 leading-relaxed relative">
                                <div className="absolute top-4 left-4 text-purple-600 border border-purple-300 rounded p-0.5">
                                    <Sparkles size={14} />
                                </div>
                                <h3 className="font-bold text-slate-800 inline-block ml-8">Claim Summary</h3>
                                <p className="mt-1">
                                    Claim {claimData.claim_id}, a Hospital Indemnity Claim Form submitted on 04/13/2026, concerns {claimData.claimant_name}, seeking benefits for hospitalization due to {claimData.diagnosis.toLowerCase()}. The event began on {claimData.hospitalization_date} when {claimData.claimant_name} was born/admitted and subsequently admitted to the ICU/Hospital. The hospitalization for {claimData.diagnosis.toLowerCase()} spanned from an admission date of {claimData.hospitalization_date} to a discharge date of {claimData.discharge_date}. Key documents received include Medical Records, a Medical Authorization Letter, and a Claim Summary Document. The claim encompasses Hospital Indemnity Plan ({claimData.benefit_type}) benefits. A total payable amount of ${claimData.claim_amount.toFixed(2)} has been approved.
                                </p>
                            </div>

                            <div className="flex gap-6">
                                {/* Preliminary Summary Box */}
                                <div className="bg-white border rounded shadow-sm p-5 flex-grow">
                                    <h3 className="font-bold text-sm text-slate-800 mb-4">Preliminary Summary</h3>
                                    <div className="bg-blue-50/50 rounded border border-blue-100 p-3 mb-4 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-600 flex items-center gap-2">MemberEligibility <CheckCircle2 size={14} className="text-emerald-500"/></span>
                                    </div>
                                    <div className="bg-blue-50 rounded border border-blue-100 p-4 relative mb-4">
                                        <span className="text-xs font-black text-blue-600 uppercase">HIP</span>
                                        <div className="flex gap-16 mt-2">
                                            <span className="text-xs font-bold flex items-center gap-2">Enrolled <CheckCircle2 size={14} className="text-emerald-500"/></span>
                                            <span className="text-xs font-bold flex items-center gap-2">Policy Cert. Identified <CheckCircle2 size={14} className="text-emerald-500"/></span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between border-t pt-4">
                                        <span className="text-xs font-bold text-slate-500 flex items-center gap-2">Discrepancy Check <AlertCircle size={14} className="text-red-400"/></span>
                                        <span className="text-xs font-bold text-slate-500 flex items-center gap-2">State Check <AlertCircle size={14} className="text-red-400"/></span>
                                        <span className="text-xs font-bold text-slate-500 flex items-center gap-2">Document Adequacy <CheckCircle2 size={14} className="text-emerald-500"/></span>
                                    </div>
                                </div>

                                {/* Coverage Outcome Summary Box */}
                                <div className="bg-white border rounded shadow-sm p-5 w-1/3">
                                    <h3 className="font-bold text-sm text-slate-800 mb-4">Coverage Outcome Summary</h3>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600 mb-8">
                                        <span>Coverage Status:</span>
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Approved</span>
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> NIGO</span>
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Denied</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center mt-12">
                                        <div className="w-20">
                                            <span className="text-xs font-bold block mb-1 text-center">3 coverages</span>
                                            <div className="h-3 bg-emerald-500 rounded-sm w-full"></div>
                                            <span className="text-xs font-bold block mt-1 text-center text-slate-600">{claimData.benefit_type}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Adjudication Summary Table */}
                            <div className="bg-white border rounded shadow-sm p-5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-sm text-slate-800">Adjudication Summary</h3>
                                    <button className="text-blue-600 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2">
                                        <FileCheck size={14} /> Claim Adjudication Report
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs font-bold text-slate-500">Showing Results for:</span>
                                    <span className="bg-slate-700 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1 font-bold"> <CheckCircle2 size={12}/> {claimData.benefit_type}</span>
                                </div>

                                <div className="flex items-center gap-6 mb-6 pb-2 border-b">
                                    <span className="text-sm font-bold text-blue-600 flex items-center gap-1"><Sparkles size={14} /> {claimData.benefit_type}: <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14}/> Approved (Approved)</span></span>
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">Policy Exclusion Results <CheckCircle2 size={14} className="text-emerald-500"/></span>
                                </div>

                                <table className="w-full text-left text-xs mb-4">
                                    <thead className="bg-[#F4F6F8] text-slate-500 font-black uppercase">
                                        <tr>
                                            <th className="p-3 w-1/5 tracking-wider">Coverage</th>
                                            <th className="p-3 tracking-wider">Info</th>
                                            <th className="p-3 tracking-wider">Benefit Type</th>
                                            <th className="p-3 tracking-wider">Payable Units</th>
                                            <th className="p-3 tracking-wider">Payable Amount</th>
                                            <th className="p-3 tracking-wider">Automation Outcome</th>
                                            <th className="p-3 tracking-wider">Examiner Decision</th>
                                            <th className="p-3 tracking-wider">IGO Date</th>
                                            <th className="p-3 tracking-wider">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-bold text-slate-700">
                                        {claimData.is_fraud ? (
                                            <tr className="border-b">
                                                <td className="p-3 text-blue-600">{claimData.diagnosis}</td>
                                                <td className="p-3"><Info size={14} className="text-slate-400"/></td>
                                                <td className="p-3">{claimData.benefit_type}</td>
                                                <td className="p-3">5</td>
                                                <td className="p-3">$12500.00</td>
                                                <td className="p-3">Awaiting Security Check</td>
                                                <td className="p-3">-</td>
                                                <td className="p-3">04/13/2026</td>
                                                <td className="p-3">-</td>
                                            </tr>
                                        ) : (
                                            <>
                                                <tr className="border-b">
                                                    <td className="p-3 text-blue-600">Premature Infant and NICU Benefit</td>
                                                    <td className="p-3"><Info size={14} className="text-slate-400"/></td>
                                                    <td className="p-3">{claimData.benefit_type}</td>
                                                    <td className="p-3">1</td>
                                                    <td className="p-3">-</td>
                                                    <td className="p-3 text-slate-500">Recommend for Approval</td>
                                                    <td className="p-3">-</td>
                                                    <td className="p-3">04/13/2026</td>
                                                    <td className="p-3">-</td>
                                                </tr>
                                                <tr className="border-b bg-slate-50">
                                                    <td className="p-3 text-blue-600">Newborn Hospital Admission</td>
                                                    <td className="p-3"><Info size={14} className="text-slate-400"/></td>
                                                    <td className="p-3">{claimData.benefit_type}</td>
                                                    <td className="p-3">1</td>
                                                    <td className="p-3">$1500.00</td>
                                                    <td className="p-3 text-emerald-600">Recommend for Approval</td>
                                                    <td className="p-3">-</td>
                                                    <td className="p-3">04/13/2026</td>
                                                    <td className="p-3">-</td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="p-3 text-blue-600">Newborn ICU Confinement</td>
                                                    <td className="p-3"><Info size={14} className="text-slate-400"/></td>
                                                    <td className="p-3">{claimData.benefit_type}</td>
                                                    <td className="p-3">30</td>
                                                    <td className="p-3">$12000.00</td>
                                                    <td className="p-3 text-emerald-600">Recommend for Approval</td>
                                                    <td className="p-3">-</td>
                                                    <td className="p-3">04/13/2026</td>
                                                    <td className="p-3">-</td>
                                                </tr>
                                            </>
                                        )}
                                        <tr className="bg-[#F8F9FB] border-t-2 border-slate-200">
                                            <td colSpan="4" className="p-3 text-right font-black text-slate-800 text-sm">Total</td>
                                            <td colSpan="5" className="p-3 font-black text-slate-800 text-sm">${claimData.claim_amount.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* --- CLAIM DETAILS TAB (Split Pane view) --- */}
                    {activeTab === 'Claim Details' && (
                        <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-4">
                            {/* Left Side: PDF Viewer Mock */}
                            <div className="w-[45%] bg-white border rounded shadow-sm flex flex-col pt-3 min-h-[700px]">
                                <div className="px-4 pb-3 flex items-center gap-4 border-b">
                                    <div className="border rounded px-3 py-1 flex items-center justify-between text-sm w-64 shadow-sm bg-slate-50 cursor-pointer">
                                        <span className="font-bold text-slate-700">Medical Record_After Visit...</span>
                                        <ChevronDown size={14} />
                                    </div>
                                    <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                        {claimData.benefit_type}
                                    </div>
                                    <div className="flex-grow"></div>
                                    <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded border border-blue-100 flex items-center gap-2 cursor-pointer">
                                        <FileCheck size={14} /> Policy Certificate
                                    </span>
                                </div>
                                <div className="flex-grow bg-[#EFEFEF] p-4 flex flex-col items-center overflow-y-auto">
                                    <div className="w-full bg-[#323639] py-2 px-4 flex justify-between text-white shadow">
                                        <div className="flex gap-4 items-center">
                                            <span>Sidebar</span>
                                            <span><Search size={14}/></span>
                                        </div>
                                        <div className="flex gap-4 items-center text-sm">
                                            <span className="opacity-50 cursor-pointer">-</span>
                                            <span className="bg-slate-700 px-2 py-0.5 rounded">50%</span>
                                            <span className="opacity-50 cursor-pointer">+</span>
                                            <span>1 / 4</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-full bg-white mt-4 shadow-lg p-8 opacity-90 border relative flex flex-col">
                                        <h1 className="text-blue-500 font-black text-xl mb-4 border-b-2 border-blue-500 pb-2">AFTER VISIT SUMMARY</h1>
                                        <p className="text-xs mb-2"><b>Patient:</b> {claimData.claimant_name}</p>
                                        <p className="text-xs mb-6"><b>Date:</b> {claimData.discharge_date} <b>Facility:</b> {claimData.hospital_name}</p>
                                        
                                        <h3 className="text-orange-500 font-black mb-2 text-sm">Instructions</h3>
                                        <div className="w-full h-32 bg-blue-50 border border-blue-100 mb-4 p-4 text-xs font-mono text-slate-500">
                                            ... [Illegible un-extracted medical notes] ...<br/>
                                            Blood pressure: 120/80<br/>
                                            ... [Scribbles] ...
                                        </div>
                                        <div className="absolute top-1/2 left-1/4 transform -rotate-12 opacity-5 pointer-events-none">
                                            <h1 className="text-[100px] font-black text-slate-900 border-[10px] border-slate-900 px-4">MEDICAL RECORD</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Excerpts Panel */}
                            <div className="w-[55%] bg-[#FDFDFD] border rounded shadow-sm p-6 overflow-y-auto h-[700px]">
                                <div className="space-y-6">
                                    {/* Excerpt Block */}
                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                                            <Sparkles size={16} className="text-blue-600"/> Benefit Summary
                                        </h4>
                                        <p className="pl-6 text-xs text-slate-700 leading-relaxed text-justify mb-4">
                                            <b>Claim Overview:</b> {claimData.claimant_name} is seeking coverage for the {claimData.benefit_type} Benefit. These benefits are related to their admission.
                                            <b>Policy Content:</b> The policy provides benefits for hospital-related events at $500/day. The Admission Date of {claimData.hospitalization_date} and Discharge Date of {claimData.discharge_date} were determined from the Medical Records.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                                            <Sparkles size={16} className="text-blue-600"/> Excerpts from Medical Record
                                        </h4>
                                        <p className="pl-6 text-xs text-slate-700 leading-relaxed text-justify mb-4">
                                            PATIENT: {claimData.claimant_name.toUpperCase()}, ADMIT DATE: {claimData.hospitalization_date}. D/C DATE: {claimData.discharge_date}. Facility: {claimData.hospital_name}. Reason for hospitalization: {claimData.diagnosis}. Assessment: Complete. 
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-1">
                                            <Sparkles size={16} className="text-blue-600"/> Policy Exclusion Results <CheckCircle2 size={12} className="text-emerald-500 inline"/>
                                        </h4>
                                        <p className="pl-6 text-xs text-slate-700 leading-relaxed text-justify mb-4">
                                            No relevant policy exclusion found.<br/>
                                            Matching Policy Exclusions Found: No. Matched Exclusion Condition Description: NA.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-1">
                                            <Sparkles size={16} className="text-blue-600"/> Medical Code Type: ICD10. Medical Code:
                                        </h4>
                                        <p className="pl-6 text-xs text-slate-700 leading-relaxed text-justify mb-4">
                                            Status & Status Reason: <span className="text-emerald-600">Approved (Approved)</span>
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-1">
                                            <Sparkles size={16} className="text-blue-600"/> Outcome Summary:
                                        </h4>
                                        <p className="pl-6 text-xs text-slate-700 leading-relaxed text-justify mb-4">
                                            Benefit level Status and Status Reason: Approved (Approved).<br/>
                                            Payouts: A total payable amount of ${claimData.claim_amount.toFixed(2)} is approved. Provides a 25% increase to these benefits and is not a direct standalone payout.
                                        </p>
                                    </div>
                                    
                                    <div className="pt-4 border-t w-full flex justify-end">
                                        <button onClick={() => setActiveTab('Fraud Detection Agent')} className="bg-blue-600 text-white shadow-md font-bold text-sm px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                                            Submit Extracted Facts to Agentic Gate &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- FRAUD DETECTION AGENT (Gate) TAB --- */}
                    {activeTab === 'Fraud Detection Agent' && (
                        <motion.div key="fraud" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-4">
                                <InvestigationDashboard 
                                    initialClaim={claimData} 
                                    onComplete={handleInvestigationComplete}
                                />
                            </div>
                            {fraudStatus === 'Cleared' && (
                                <div className="mt-8 flex justify-end">
                                     <button 
                                        onClick={() => setActiveTab('Benefit Assessment Details')} 
                                        className="bg-emerald-600 text-white px-8 py-3 rounded shadow-lg font-bold text-sm hover:bg-emerald-700 flex items-center gap-2 animate-bounce-slow"
                                    >
                                        Proceed to Benefit Assessment <CheckCircle2 size={18} />
                                    </button>
                                </div>
                            )}
                            {fraudStatus === 'Blocked' && (
                                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-red-800">Process Halted. Benefit Assessment is Locked.</span>
                                        <span className="text-xs text-red-600">The claim must be escalated to the Special Investigations Unit (SIU).</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* --- BENEFIT ASSESSMENT DETAILS TAB --- */}
                    {activeTab === 'Benefit Assessment Details' && (
                        <motion.div key="benefit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="p-8 bg-white border border-slate-200 rounded shadow-sm text-center py-20">
                                <h2 className="text-2xl font-bold text-emerald-600 mb-4 flex justify-center items-center gap-3">
                                    <ShieldAlert size={28} /> Benefit Adjudication Cleared
                                </h2>
                                <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
                                    The Multi-Agent AI Fraud Investigator has rigorously cross-referenced the medical excerpts extracted from the Claimant's PDF against the provider database, clinical models, and historical billing networks. No fraud was detected. This claim has been automatically adjudicated for payment.
                                </p>
                                <div className="mt-10 p-6 bg-slate-800 text-white max-w-lg mx-auto rounded-xl shadow-lg">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Final Payout Generated</p>
                                    <p className="text-4xl font-black">${claimData.claim_amount.toFixed(2)}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VerificationMockup;
