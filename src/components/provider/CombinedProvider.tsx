import { ReactNode } from 'react';
import { FilterProvider } from '@/store/FilterContext';
import { TagProvider } from '@/store/TagContext';

export const CombinedProviders = ({ children }: { children: ReactNode }) => {
  return (
    <TagProvider>
      <FilterProvider>
        {children}
      </FilterProvider>
    </TagProvider>
  );
};
