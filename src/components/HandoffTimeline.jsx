import React from 'react';
import { Clock, CheckCircle2, ArrowDown, Share2, Database, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const HandoffTimeline = ({ initialClaim }) => {
    const events = [
        {
            title: "Legacy QuickBase Intake",
            time: "09:12 AM",
            icon: <Database size={14} />,
            status: "Completed",
            color: "text-slate-400 bg-slate-50",
            active: false
        },
        {
            title: "Policy Verification",
            time: "10:45 AM",
            icon: <ShieldCheck size={14} />,
            status: "Verified (IGO)",
            color: "text-emerald-500 bg-emerald-50",
            active: false
        },
        {
            title: "Agent Handoff",
            time: "Just Now",
            icon: <Share2 size={14} />,
            status: "Handing off to Fraud AI...",
            color: "text-blue-500 bg-blue-50",
            active: true
        }
    ];

    return (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-screen fixed right-0 top-0 p-8 z-50">
            <div className="mb-10">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Claim Provenance</h3>
                <h2 className="text-sm font-black text-slate-800">Sequence of Events</h2>
            </div>

            <div className="space-y-12 relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100"></div>

                {events.map((event, idx) => (
                    <div key={idx} className="relative pl-10">
                        <div className={`absolute left-0 w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 ${event.color}`}>
                            {event.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 mb-0.5">{event.time}</span>
                            <h4 className={`text-xs font-black ${event.active ? 'text-blue-900 underline decoration-blue-200' : 'text-slate-600'}`}>
                                {event.title}
                            </h4>
                            <p className="text-[10px] font-medium text-slate-400 mt-1">{event.status}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Claim Mini-Card */}
            <div className="mt-auto pt-8 border-t border-slate-100">
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Verified Data Context</p>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-medium text-slate-500">Claim ID</span>
                            <span className="text-[10px] font-black font-mono">{initialClaim?.claim_id || "CLM-2881"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-medium text-slate-500">Auth Code</span>
                            <span className="text-[10px] font-black uppercase text-emerald-600">Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HandoffTimeline;
