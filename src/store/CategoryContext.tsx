"use client";

import { ICategoryContext } from '@/types/ListTypes';
import React, { ReactNode, useState, createContext, useContext } from 'react';


const CategoryContext = createContext<ICategoryContext | null>(null);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
        {children}
    </CategoryContext.Provider>
  )
}


export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('Something went wrong');
  }
  return context;
};