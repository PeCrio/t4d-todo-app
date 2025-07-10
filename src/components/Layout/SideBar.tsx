
import { FaTimes } from 'react-icons/fa';

interface SideBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface CategoryItemProps {
  label: string;
  onClick?: () => void;
}

const categories = [
  'All Todos',
  'Work',
  'Personal',
  'Shopping',
  'Miscellaneous',
];

const CategoryItem = ({ label, onClick }: CategoryItemProps) => (
  <li
    className="p-4 text-white cursor-pointer border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200"
    onClick={onClick}
  >
    {label}
  </li>
);



const SideBar = ({ toggleSidebar }: SideBarProps) => {

  return (
    <aside className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 text-theme-orange">
        <h2 className="text-xl font-bold">Categories</h2>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 focus:outline-none"
        >
          <FaTimes className="text-xl text-theme-orange" />
        </button>
      </div>
      <ul className="list-none p-0 m-0 flex-grow overflow-y-auto">
        {categories.map((category) => (
          <CategoryItem key={category} label={category} />
        ))}
      </ul>
    </aside>
  );
};

export default SideBar