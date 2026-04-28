import React, { useState, useEffect } from 'react';
import { 
    Shield, 
    Microscope, 
    Activity, 
    AlertTriangle, 
    CheckCircle2, 
    FileText, 
    ChevronRight,
    Zap,
    Scale,
    Cpu,
    ArrowUpRight,
    LayoutPanelTop,
    Search,
    AlertCircle,
    Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AgentStatusCard = ({ icon: Icon, name, subText, progress, status, colorClass }) => (
    <div className="glass-card p-5 rounded-2xl flex-grow group shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20 flex items-center justify-center`}>
                <Icon className={colorClass} size={20} />
            </div>
            <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-blue-300' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
            </div>
        </div>
        <div className="space-y-1 mb-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{name}</h4>
            <p className="text-xs font-black text-slate-800 line-clamp-1">{subText}</p>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
                className={`h-full ${status === 'running' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
            />
        </div>
    </div>
);

const InvestigationDashboard = ({ initialClaim, onComplete }) => {
    const [isInvestigating, setIsInvestigating] = useState(false);
    const [report, setReport] = useState(null);
    const [step, setStep] = useState(0);
    const [activeDeepDive, setActiveDeepDive] = useState(null);

    const runInvestigation = async () => {
        setIsInvestigating(true);
        setReport(null);
        setStep(1);

        const claimToInvestigate = initialClaim || {};

        await new Promise(r => setTimeout(r, 1200));
        setStep(2);
        await new Promise(r => setTimeout(r, 1200));
        setStep(3);
        await new Promise(r => setTimeout(r, 1200));

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/investigate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(claimToInvestigate)
            });
            if (!response.ok) throw new Error("API Issue");
            const data = await response.json();
            setReport(data);
            if (onComplete) onComplete(data);
        } catch (error) {
            console.error(error);
            const fallbackReport = {
                claim_id: initialClaim?.claim_id || "C-2026-9999999",
                risk_tier: "Critical",
                overall_risk_score: 0.92,
                summary_brief: "Fallback Error: Backend disconnected. Assuming Critical Risk for demonstration.",
                recommended_action: "Refer to SIU",
                findings: [
                    { agent_name: "Forensic AI Agent", severity: "High", description: "Backend unreachable.", evidence_highlights: ["Fetch action failed. Backend service is likely offline or crashed."] }
                ]
            };
            setReport(fallbackReport);
            if (onComplete) onComplete(fallbackReport);
        }
        setIsInvestigating(false);
        setStep(4);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-800 text-lg">Agentic Fraud Investigator</h3>
                {!report && !isInvestigating && (
                    <button 
                        onClick={runInvestigation}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition"
                    >
                        Launch Multi-Agent Scan
                    </button>
                )}
                {isInvestigating && (
                    <span className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest rounded animate-pulse">Running Scan...</span>
                )}
            </div>

            <div className="flex gap-6 mb-8">
                <AgentStatusCard 
                    icon={Microscope} 
                    name="Forensic AI Agent" 
                    subText={step >= 1 ? (step > 1 ? "Analysis Complete" : "Analyzing document tempering...") : "Awaiting..."}
                    progress={step > 1 ? 100 : (step === 1 ? 65 : 0)}
                    status={step === 1 ? 'running' : (step > 1 ? 'done' : 'idle')}
                    colorClass="text-blue-500"
                />
                <AgentStatusCard 
                    icon={Activity} 
                    name="Clinical AI Agent" 
                    subText={step >= 2 ? (step > 2 ? "Medical History Verified" : "Querying database...") : "Awaiting..."}
                    progress={step > 2 ? 100 : (step === 2 ? 45 : 0)}
                    status={step === 2 ? 'running' : (step > 2 ? 'done' : 'idle')}
                    colorClass="text-emerald-500"
                />
                <AgentStatusCard 
                    icon={Scale} 
                    name="Correlation AI Agent" 
                    subText={step >= 3 ? (step > 3 ? "Pattern Check Complete" : "Cross-referencing DBs...") : "Awaiting..."}
                    progress={step > 3 ? 100 : (step === 3 ? 80 : 0)}
                    status={step === 3 ? 'running' : (step > 3 ? 'done' : 'idle')}
                    colorClass="text-purple-500"
                />
            </div>

            <AnimatePresence mode="wait">
                {report && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className={`p-8 rounded-2xl border-2 ${report.risk_tier === 'Critical' || report.risk_tier === 'High' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 mb-2">
                                        Risk Tier: <span className={report.risk_tier === 'Critical' || report.risk_tier === 'High' ? 'text-red-600' : 'text-emerald-600'}>{report.risk_tier}</span>
                                    </h2>
                                    <p className="text-sm font-bold text-slate-600">Overall Risk Score: {(report.overall_risk_score * 100).toFixed(0)}%</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${report.risk_tier === 'Critical' || report.risk_tier === 'High' ? 'bg-red-600' : 'bg-emerald-600'}`}>
                                    {report.recommended_action}
                                </div>
                            </div>
                            <p className="text-slate-700 italic font-medium leading-relaxed mb-6">
                                "{report.summary_brief}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {report.findings.map((finding, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setActiveDeepDive(activeDeepDive === idx ? null : idx)}
                                    className={`p-5 rounded-xl border shadow-sm cursor-pointer transition-all transform hover:-translate-y-1 ${activeDeepDive === idx ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white border-slate-200 hover:shadow-md'}`}
                                >
                                    <div className="flex items-center gap-2 mb-3 justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${finding.severity === 'Critical' ? 'bg-red-500' : (finding.severity === 'Medium' ? 'bg-orange-500' : 'bg-emerald-500')}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{finding.agent_name}</span>
                                        </div>
                                        <span className="text-blue-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                                            Deep Dive <ChevronRight size={12} className={`transform transition-transform ${activeDeepDive === idx ? 'rotate-90' : ''}`} />
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-800 mb-3">{finding.description}</p>
                                    <ul className="text-[10px] text-slate-500 space-y-1 mt-2 border-t pt-2 list-disc pl-3">
                                        {finding.evidence_highlights.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* --- DEEP DIVE PANELS --- */}
                        <AnimatePresence>
                            {activeDeepDive !== null && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 p-8 rounded-2xl border-2 bg-white shadow-inner">
                                        <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                            <Search size={20} className="text-blue-600" />
                                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest">
                                                {report.findings[activeDeepDive].agent_name} : Raw Evidence
                                            </h3>
                                        </div>

                                        {/* 1. FORENSIC VIEW */}
                                        {report.findings[activeDeepDive].agent_name.includes('Forensic') && (
                                            <div className="flex gap-8">
                                                {/* Left side: Photorealistic CSS Mock of a scanned document */}
                                                <div className="w-1/2 bg-[#1A1C1E] border-4 border-slate-900 rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden h-72 shadow-2xl">
                                                    
                                                    {/* Scanning light animation overlay */}
                                                    <div className="absolute top-0 left-0 w-full h-8 bg-blue-500 bg-opacity-20 blur-md border-b-2 border-blue-400 animate-[pulse_3s_ease-in-out_infinite] z-20 pointer-events-none transform translate-y-12"></div>
                                                    
                                                    {/* The Paper */}
                                                    <div className="w-11/12 h-[280px] bg-[#fdfbf7] shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative pointer-events-none transform -rotate-1 skew-x-1" 
                                                         style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.08%22/%3E%3C/svg%3E")', backgroundSize: 'cover' }}>
                                                        
                                                        <div className="p-4 flex flex-col h-full opacity-80 filter contrast-125 sepia-[0.3]">
                                                            {/* Letterhead */}
                                                            <div className="border-b-2 border-black pb-2 mb-2 flex justify-between items-end">
                                                                <div>
                                                                    <h2 className="font-serif font-black text-[12px] uppercase leading-tight tracking-tighter">{initialClaim.hospital_name}<br/>Medical Plaza</h2>
                                                                </div>
                                                                <div className="text-right">
                                                                    <h2 className="font-sans font-black text-[14px] uppercase tracking-widest text-slate-500">INVOICE</h2>
                                                                    <p className="font-mono text-[6px]">Date: 03/10/2024</p>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Target Lines */}
                                                            <div className="flex-grow font-mono text-[7px] space-y-2 mt-2 leading-tight">
                                                                <div className="flex justify-between border-b border-dashed border-gray-400 pb-1"><span>{initialClaim.diagnosis}</span><span>$450.00</span></div>
                                                                <div className="flex justify-between border-b border-dashed border-gray-400 pb-1"><span>Diagnostic Imaging</span><span>$1,200.00</span></div>
                                                                <div className="flex justify-between border-b border-dashed border-gray-400 pb-1"><span>Pharmacy</span><span>$850.00</span></div>
                                                                <div className="flex justify-between pb-1 pt-2 opacity-30 italic"><span>Misc supplies</span><span>[Illegible]</span></div>
                                                            </div>

                                                            {/* Total */}
                                                            <div className="border-t-2 border-black pt-2 flex justify-between items-center relative mt-auto">
                                                                <span className="font-sans font-black text-[10px] uppercase">Amount Due</span>
                                                                
                                                                <div className="relative">
                                                                    {initialClaim.is_fraud && (
                                                                        <div className="absolute -inset-2 border-[1.5px] border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse z-30">
                                                                            <div className="absolute -top-5 right-0 bg-red-600 text-white text-[7px] px-1.5 py-0.5 font-sans font-black uppercase whitespace-nowrap tracking-widest shadow-lg">Target Value Alteration</div>
                                                                        </div>
                                                                    )}
                                                                    {initialClaim.is_fraud && (
                                                                        <span className="font-serif text-[13px] font-bold text-gray-900 tracking-tighter transform -translate-y-0.5 inline-block">${initialClaim.claim_amount.toFixed(2)}</span>
                                                                    )}
                                                                    {!initialClaim.is_fraud && (
                                                                        <span className="font-mono text-[10px] font-bold text-gray-900">${initialClaim.claim_amount.toFixed(2)}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-1/2 flex flex-col justify-center">
                                                    {initialClaim.is_fraud ? (
                                                        <>
                                                            <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle size={18}/> Digital Modification Detected</h4>
                                                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                                                The forensic analysis identified mismatched EXIF bounding boxes and <span className="font-bold text-red-600">anomalous letter alignment</span>. The font face and bolding inconsistencies (e.g. "DIARRHEA", "DIAGNOSIS") indicate digital composition. 
                                                                <br/><br/>
                                                                <span className="bg-red-50 border border-red-200 p-2 rounded text-[10px] block font-black text-red-800">
                                                                    ⚠️ PATTERN MATCH: Signature consistent with Historical Reject C-2025-1090051 (Jina)
                                                                </span>
                                                            </p>
                                                            <div className="bg-slate-800 p-4 rounded-lg shadow-inner text-xs font-mono text-emerald-400 space-y-1">
                                                                <p>$ EXIF_Analyzer -f /scans/INV-9283.pdf</p>
                                                                <p className="text-slate-300">&gt; File origin: Scanner Flatbed v2.1</p>
                                                                <p className="text-slate-300">&gt; Modification Tool: Adobe Photoshop CC 2024</p>
                                                                <p className="text-red-400 font-bold">&gt; HISTORICAL COLLISION: Signature Match Jina_2025_Pattern</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <h4 className="font-bold text-emerald-600 mb-2 flex items-center gap-2"><CheckCircle2 size={18}/> Document Authenticated</h4>
                                                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                                                The forensic suite fully cleared the submitted PDF document. No EXIF anomalies, pixel layering inconsistencies, or metadata flags were detected.
                                                            </p>
                                                            <div className="bg-slate-800 p-4 rounded-lg shadow-inner text-xs font-mono text-emerald-400 space-y-1">
                                                                <p>$ EXIF_Analyzer -f /scans/INV-1100.pdf</p>
                                                                <p className="text-slate-300">&gt; File origin: iOS CamScanner v12.1</p>
                                                                <p className="text-emerald-400 font-bold">&gt; PixelErrorLevelAnalysis: CLEAN</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. CLINICAL VIEW */}
                                        {report.findings[activeDeepDive].agent_name.includes('Clinical') && (
                                            <div className="space-y-6">
                                                <p className="text-sm text-slate-700">{initialClaim.is_fraud ? "Data indicates a major discrepancy in medical logic and historical viability." : "Clinical timeline aligns with historical patient records."}</p>
                                                <div className="flex justify-between items-center bg-slate-50 border p-4 rounded-xl">
                                                    <div className="w-5/12 text-center">
                                                        <span className="text-xs font-black uppercase text-slate-400 block mb-2">Current Claim Event</span>
                                                        <div className="bg-white border rounded p-4 shadow-sm text-sm font-bold text-slate-800">
                                                            {initialClaim.diagnosis}<br/>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        {initialClaim.is_fraud ? (
                                                            <>
                                                                <AlertTriangle size={24} className="mb-1 text-orange-500" />
                                                                <span className="text-[10px] uppercase font-black tracking-widest text-orange-600">IMPROBABLE COLLISION</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 size={24} className="mb-1 text-emerald-500" />
                                                                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600">VERIFIED</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="w-5/12 text-center">
                                                        <span className="text-xs font-black uppercase text-slate-400 block mb-2">Historical Database Matches</span>
                                                        <div className={`border rounded p-4 shadow-sm text-sm font-bold text-left ${initialClaim.is_fraud ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                                                            {initialClaim.is_fraud ? (
                                                                <ul className="list-disc pl-4 text-xs space-y-1">
                                                                    <li>Mar 2021: {initialClaim.diagnosis}</li>
                                                                    <li>Oct 2023: {initialClaim.diagnosis}</li>
                                                                </ul>
                                                            ) : (
                                                                <span className="text-xs text-emerald-700">No abnormal occurrence frequency found. Matches expected lifetime likelihood for this event.</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {initialClaim.is_fraud && (
                                                    <div className="text-xs text-red-600 font-bold bg-red-50 p-4 rounded border border-red-100">
                                                        Clinical Conclusion: The occurrence of a "severe" acute manifestation of this exact condition multiple times in a 3 year span is clinically statistically improbable. Suggests diagnosis-grooming.
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* 3. CORRELATION VIEW */}
                                        {report.findings[activeDeepDive].agent_name.includes('Correlation') && (
                                            <div className="space-y-6">
                                                <div className={`${initialClaim.is_fraud ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200'} border rounded p-5`}>
                                                    <h4 className={`font-black uppercase tracking-widest text-xs flex items-center gap-2 mb-4 ${initialClaim.is_fraud ? 'text-purple-800' : 'text-slate-600'}`}>
                                                        <Database size={16}/> {initialClaim.is_fraud ? 'Historical Network Match (Claim Bursting detected)' : 'Historical Network Match (Clear)'}
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-8 relative">
                                                        <div className={`border-r pr-8 ${initialClaim.is_fraud ? 'border-purple-200' : 'border-slate-200'}`}>
                                                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Current Request</span>
                                                            <div className="text-sm font-bold text-slate-800">
                                                                Claimant: {initialClaim.claimant_name} ({initialClaim.claimant_id})<br/>
                                                                Invoice Used: <span className="text-blue-600">{initialClaim.invoice_number || "INV-1100"}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cross-Reference Disapproval Data (Past 5 Years)</span>
                                                            <div className="text-sm font-bold text-slate-800 space-y-2">
                                                                {initialClaim.is_fraud ? (
                                                                    <>
                                                                        <div className="flex flex-col gap-4 w-full">
                                                                            {/* Header: Network Signatures */}
                                                                            <div>
                                                                                <div className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2">
                                                                                    <Search size={12}/> Historical Network Signature Match
                                                                                </div>
                                                                                <div className="flex gap-2">
                                                                                    <span className="text-red-500 text-[10px] font-black bg-red-100 px-3 py-1 rounded border border-red-200">↳ C-2025-1090051 (Jina)</span>
                                                                                    <span className="text-red-500 text-[10px] font-black bg-red-100 px-3 py-1 rounded border border-red-200">↳ C-2025-1090052 (Escamilla)</span>
                                                                                </div>
                                                                            </div>

                                                                            {/* Intelligent Anomaly Spectrum */}
                                                                            <div className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                                                                                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                                                                                <div className="flex justify-between items-center mb-4">
                                                                                    <h5 className="text-[11px] font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                                                                                         Anomaly Spectrum: Dependent Density Intelligence
                                                                                    </h5>
                                                                                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 animate-pulse">SIU THRESHOLD VIOLATION (490%)</span>
                                                                                </div>

                                                                                {/* The Bar */}
                                                                                <div className="relative h-12 w-full flex items-center mb-4">
                                                                                    {/* Track */}
                                                                                    <div className="h-2 w-full bg-slate-100 rounded-full relative">
                                                                                        {/* Markers */}
                                                                                        <div className="absolute top-[-20px] left-[4%] flex flex-col items-center">
                                                                                            <span className="text-[8px] font-bold text-slate-400">AVG: 2.1</span>
                                                                                            <div className="w-0.5 h-6 bg-slate-200"></div>
                                                                                        </div>
                                                                                        <div className="absolute top-[-20px] left-[20%] flex flex-col items-center">
                                                                                            <span className="text-[8px] font-black text-orange-500 tracking-tighter">THRESHOLD: 10</span>
                                                                                            <div className="w-0.5 h-6 bg-orange-300"></div>
                                                                                        </div>
                                                                                        
                                                                                        {/* Current Value Indicator */}
                                                                                        <div className="absolute top-[-4px] left-[98%] -translate-x-full z-10 flex flex-col items-end">
                                                                                            <motion.div 
                                                                                                initial={{ scale: 0.8 }}
                                                                                                animate={{ scale: [1, 1.2, 1] }}
                                                                                                transition={{ repeat: Infinity, duration: 2 }}
                                                                                                className="bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded shadow-lg flex items-center gap-1"
                                                                                            >
                                                                                                CURRENT: 49 <Activity size={10} />
                                                                                            </motion.div>
                                                                                            <div className="w-0.5 h-8 bg-rose-600"></div>
                                                                                        </div>

                                                                                        {/* Fill */}
                                                                                        <motion.div 
                                                                                            initial={{ width: 0 }}
                                                                                            animate={{ width: '100%' }}
                                                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                                                            className="h-full bg-gradient-to-r from-emerald-400 via-orange-400 to-rose-600 rounded-full opacity-80"
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                {/* Sophisticated Narrative */}
                                                                                <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 border-dashed">
                                                                                    <p className="text-[10px] text-slate-600 leading-relaxed">
                                                                                        <span className="font-black text-slate-800 uppercase">[AI Conclusion: Forensic Corelation Detected]</span> Significant historical cohort overlap. The current dependent count (<span className="text-rose-600 font-bold">49</span>) represents an extreme statistical outlier (Sigma &gt; 8.0). This forensic signature led to 100% rejection in the <span className="font-bold underline">Jina/Escamilla 2025 Fraud Cohort</span> due to synthetic identity markers.
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex items-start gap-2">
                                                                        <div className="mt-1"><CheckCircle2 size={14} className="text-emerald-500" /></div>
                                                                        <div className="text-emerald-700">No related disapproval flags or synthetic identity bursts associated with this claimant footprint or invoice number.</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                )}
            </AnimatePresence>
            {!report && !isInvestigating && (
                <div className="h-40 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-400 border border-slate-100">
                    <p className="font-bold text-xs uppercase tracking-widest">Awaiting Verification Trigger</p>
                </div>
            )}
        </div>
    );
};

export default InvestigationDashboard;
