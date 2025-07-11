
"use client";
import { useCategory } from '@/store/CategoryContext';
import { IListStructure } from '@/types/ListTypes';
import { LocalStorageService } from '@/utils/LocalStorageService';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { RxReset } from "react-icons/rx";

interface SideBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface CategoryItemProps {
  label: string;
  onClick?: () => void;
  activeCategory?: string | null;
}

const CategoryItem = ({ label, onClick, activeCategory }: CategoryItemProps) => (
  <li
    className={`p-4 text-white cursor-pointer border-b border-gray-700 transition-colors duration-200 ${activeCategory === label ? 'bg-theme-orange' : 'hover:bg-gray-800'}`}
    onClick={onClick}
  >
    {label}
  </li>
);



const SideBar = ({ toggleSidebar }: SideBarProps) => {
  const [categories, setCategories] = useState([''])
  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedCategory, selectedCategory } = useCategory();

  const getTodoCategories = () => {
    setTimeout(()=>{
      const getAllTodos = LocalStorageService.get() as IListStructure[];
      const uniqueCategories = new Set(getAllTodos.map((allTodos)=> allTodos.category).filter(Boolean) ?? [])
      setCategories([...uniqueCategories]);
      setIsLoading(false);
    },500)
  }

  useEffect(()=>{
    window.addEventListener('_New_List_Added', getTodoCategories);

    getTodoCategories();

    return () =>{
      window.removeEventListener('_New_List_Added', getTodoCategories);
    }
  },[])

  return (
    <aside className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 text-theme-orange">
        <h2 className="text-xl font-bold">Categories</h2>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 focus:outline-none cursor-pointer"
        >
          <FaTimes className="text-xl text-theme-orange" />
        </button>
      </div>
      {
        isLoading ?
        <div className='min-h-[20vh]'>
          <div className="loader w-full m-auto"></div>
        </div>
        :
        <ul className="list-none p-0 m-0 flex-grow overflow-y-auto">
          {categories.map((category) => (
            <CategoryItem key={category} label={category} activeCategory={selectedCategory} onClick={()=>setSelectedCategory(category)}/>
          ))}
          <div className='text-center'>
            <button className='bg-white rounded-[3px] mt-5 px-4 flex items-center gap-[3px] m-auto cursor-pointer' onClick={()=>setSelectedCategory('')}>
              <RxReset />
              Reset
            </button>
          </div>
        </ul>
      }
    </aside>
  );
};

export default SideBar