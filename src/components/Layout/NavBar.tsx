import React from "react";
import { FaBars } from "react-icons/fa";

interface NavBarProps {
  toggleSidebar: () => void;
}

const NavBar = ({ toggleSidebar }: NavBarProps) => {
  return (
    <nav className="bg-[#142948] text-[#f1884d] p-4 flex items-center shadow-md fixed w-full top-0 z-50">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 mr-4 focus:outline-none"
      >
        <FaBars className="text-2xl text-[#f1884d]" />
      </button>
      <h1 className="text-2xl font-bold flex-grow text-left">My Todo App</h1>
    </nav>
  );
};

export default NavBar;
