import { IListStructure } from "@/types/ListTypes";
import { getISODateFormat } from "@/utils/Formatters";

const today = getISODateFormat(new Date())

export const mockTodoList: IListStructure[] = [
  {
    id: 1,
    description: 'Descr Today Task',
    date: today,
    completed: false,
    tag: 'Work',
    has_subtask: false,
    name: 'Today Task',
  },
  {
    id: 2,
    description: 'Descr Old Task',
    date: '2023-01-01',
    completed: false,
    tag: 'Work',
    name: 'Old Task',
    has_subtask: false,
  },
  {
    id: 3,
    description: 'Descr Done Task',
    date: today,
    completed: true,
    tag: 'Work',
    has_subtask: false,
    name: 'Done Task'
  },
];
