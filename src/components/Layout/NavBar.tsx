import { Button } from "../ui/Button";
import { DynamicIcons } from "../ui/DynamicIcons";


interface NavBarProps {
  toggleSidebar: () => void;
}


const NavBar = ({ toggleSidebar }: NavBarProps) => {
  return (
    <nav className="bg-theme-blue text-theme-orange p-6 flex items-center shadow-md fixed w-full top-0 z-50 border-b border-theme-orange">
      <Button
        onClick={toggleSidebar}
        className="lg:hidden p-2 mr-4 focus:outline-none cursor-pointer"
      >
        <DynamicIcons iconName="heroicons:bars-3-20-solid" width={32} height={32} className="text-2xl text-theme-orange"/>
      </Button>
      <h1 className="text-2xl font-bold flex-grow text-left"><i>VERS</i> Todo App</h1>
    </nav>
  );
};

export default NavBar;
