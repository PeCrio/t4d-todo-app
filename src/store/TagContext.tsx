"use client";

import { ITagContext } from '@/types/ListTypes';
import React, { ReactNode, useState, createContext, useContext } from 'react';


const TagContext = createContext<ITagContext | null>(null);

export const TagProvider = ({ children }: { children: ReactNode }) => {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
  return (
    <TagContext.Provider value={{ selectedTag, setSelectedTag }}>
        {children}
    </TagContext.Provider>
  )
}


export const useTag = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('Something went wrong');
  }
  return context;
};