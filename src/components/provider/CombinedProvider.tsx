import { ReactNode } from 'react';
import { CategoryProvider } from '@/store/CategoryContext';
import { FilterProvider } from '@/store/FilterContext';

export const CombinedProviders = ({ children }: { children: ReactNode }) => {
  return (
    <CategoryProvider>
      <FilterProvider>
        {children}
      </FilterProvider>
    </CategoryProvider>
  );
};
