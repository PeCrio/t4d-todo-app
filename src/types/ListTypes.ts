export type IListStructure = {
    tag: string;
    description: string;
    name: string;
    time: string;
    date: string;
    has_subtask: boolean;
    completed: boolean;
    id: number | string;
    subTasks?: string[];
}

export type ITagContext = {
    selectedTag: string | null;
    setSelectedTag: (tag: string) => void;
}

export type IFilterContextType = {
    selectedFilterQuery: string | null;
    setSelectedFilterQuery: (query: string) => void;
}