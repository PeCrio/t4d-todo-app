"use client";

import { IFilterContextType } from '@/types/ListTypes';
import React, { ReactNode, useState, createContext, useContext } from 'react';


const FilterContext = createContext<IFilterContextType | null>(null);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [selectedFilterQuery, setSelectedFilterQuery] = useState<string | null>(null);
  return (
    <FilterContext.Provider value={{ selectedFilterQuery, setSelectedFilterQuery }}>
        {children}
    </FilterContext.Provider>
  )
}


export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('Something went wrong');
  }
  return context;
};