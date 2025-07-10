
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
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <NavBar toggleSidebar={toggleSidebar} />

      {/* Main Layout Container */}

      <div className="flex flex-1 pt-[64px]">
        {/* Sidebar Container */}
        <div
          className={`
            fixed top-0 left-0 h-screen w-64 bg-[#142948] border-r border-gray-700
            transition-transform duration-300 ease-in-out z-40 
            ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }             
            lg:translate-x-0 lg:static lg:h-auto lg:w-[260px] lg:flex-shrink-0 lg:border-r            pt-[64px] 
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
            w-full flex-1 p-4 transition-all duration-300 ease-in-out
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
