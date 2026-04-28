import React from 'react';
import { 
    LayoutDashboard, 
    Search, 
    Activity, 
    ShieldAlert, 
    Users, 
    Archive, 
    Settings, 
    Bell,
    ChevronDown
} from 'lucide-react';

const Sidebar = ({ currentView }) => {
    return (
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Branding */}
            <div className="p-8 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00338D] rounded-xl flex items-center justify-center text-white font-black shadow-lg">P</div>
                    <div>
                        <h1 className="font-black tracking-widest text-[#00338D] leading-tight">PRUDENTIAL</h1>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Investigator v2.0</p>
                    </div>
                </div>
            </div>

            {/* Navigation Groups */}
            <div className="px-4 flex-grow space-y-8">
                <div>
                    <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Investigation</h3>
                    <div className="space-y-1">
                        <div className="nav-item nav-item-active">
                            <Activity size={20} />
                            <span className="text-sm font-bold">Investigation Hub</span>
                        </div>
                        <div className="nav-item">
                            <ShieldAlert size={20} />
                            <span className="text-sm font-semibold">Risk Worklist</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Operations</h3>
                    <div className="space-y-1">
                        <div className="nav-item">
                            <Users size={20} />
                            <span className="text-sm font-semibold">Policyholders</span>
                        </div>
                        <div className="nav-item">
                            <Archive size={20} />
                            <span className="text-sm font-semibold">Case Archive</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Profile Area */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                    </div>
                    <div className="flex-grow">
                        <p className="text-xs font-black text-slate-800">A. Thompson</p>
                        <p className="text-[10px] text-slate-400 font-bold">Lead Investigator</p>
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
