import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#08090D] font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Sidebar Spacer - takes space in flow on desktop, hides on mobile */}
            <div className="hidden lg:block w-[300px] flex-shrink-0 border-r border-white/5">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-h-screen min-w-0 relative">
                {/* Protocol Backdrop Glows */}
                <div className="fixed top-0 right-0 w-[70vw] h-[50vh] bg-blue-600/[0.03] blur-[160px] rounded-full pointer-events-none z-0"></div>
                <div className="fixed bottom-0 left-0 w-[40vw] h-[40vh] bg-purple-600/[0.02] blur-[160px] rounded-full pointer-events-none z-0"></div>

                <Topbar />
                <main className="flex-1 px-4 md:px-12 py-8 md:py-12 relative z-10 w-full max-w-[1400px] mx-auto">
                    {children}
                </main>

                {/* Dashboard Terminal Footer */}
                <footer className="px-6 md:px-12 py-8 md:py-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between opacity-40 gap-4 mt-auto">
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] font-heading italic text-center md:text-left">
                        LENK.tr // PRTCL-OS v2.4a // NODE: 0x2A4F
                    </span>
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-blue-500 animate-pulse">
                        Core Status: Optimized
                    </span>
                </footer>
            </div>
        </div>
    );
};

export default AppLayout;
