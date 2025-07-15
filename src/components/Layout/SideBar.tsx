
"use client";

import { useTag } from '@/store/TagContext';
import { IListStructure } from '@/types/ListTypes';
import { LocalStorageService } from '@/utils/LocalStorageService';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { RxReset } from "react-icons/rx";

interface SideBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface TagItemProps {
  label: string;
  onClick?: () => void;
  activeTag?: string | null;
}

const TagItem = ({ label, onClick, activeTag }: TagItemProps) => (
  <li
    className={`p-4 capitalize text-white cursor-pointer border-b border-gray-700 transition-colors duration-200 ${activeTag === label ? 'bg-theme-orange' : 'hover:bg-gray-800'}`}
    onClick={onClick}
  >
    {label}
  </li>
);



const SideBar = ({ toggleSidebar }: SideBarProps) => {
  const [tags, setTags] = useState([''])
  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedTag, selectedTag } = useTag();

  const getTodoTags = () => {
    setTimeout(()=>{
      const getAllTodos = LocalStorageService.get() as IListStructure[];
      const uniqueTags = new Set(getAllTodos.map((allTodos)=> allTodos.tag).filter(Boolean) ?? [])
      setTags([...uniqueTags]);
      setIsLoading(false);
    },500)
  }

  useEffect(()=>{
    window.addEventListener('_New_List_Added', getTodoTags);

    getTodoTags();

    return () =>{
      window.removeEventListener('_New_List_Added', getTodoTags);
    }
  },[])

  return (
    <aside className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 text-theme-orange">
        <h2 className="text-xl font-bold">Tags</h2>
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
          {tags.map((tag) => (
            <TagItem key={tag} label={tag} activeTag={selectedTag} onClick={()=>setSelectedTag(tag)}/>
          ))}
          <div className='text-center'>
            <button className='bg-white rounded-[3px] mt-5 px-4 flex items-center gap-[3px] m-auto cursor-pointer' onClick={()=>setSelectedTag('')}>
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