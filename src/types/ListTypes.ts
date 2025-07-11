export type IListStructure = {
    category: string;
    description: string;
    name: string;
    time: string;
    date: string;
    has_subtask: boolean;
    completed: boolean;
    id: number | string;
    subTasks?: string[];
}

export type ICategoryContext = {
    selectedCategory: string | null;
    setSelectedCategory: (category: string) => void;
}

export type IFilterContextType = {
    selectedFilterQuery: string | null;
    setSelectedFilterQuery: (query: string) => void;
}