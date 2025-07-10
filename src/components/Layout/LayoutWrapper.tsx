
"use client";

import React, { useState } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Navbar */}
      <div className="sticky top-0 z-[10]">
        <NavBar toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Layout Container */}

      <div className="pt-[70px]">
        {/* Sidebar Container */}
        <div
          className={`
            fixed top-[80px] left-0 h-screen w-64 bg-theme-blue border-r border-gray-700
            transition-transform duration-300 ease-in-out z-[2]
            ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }             
            lg:translate-x-0 lg:w-[260px] lg:flex-shrink-0 lg:border-r pt-[64px] 
            lg:pt-0
            overflow-y-auto 
          `}
        >
          <SideBar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-30 lg:hidden" 
            onClick={toggleSidebar}
          ></div>
        )}

        {/*Main Content Area */}
        <main
          className={`
            p-4 transition-all duration-300 ease-in-out ml-[280px]
            lg:p-8
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;