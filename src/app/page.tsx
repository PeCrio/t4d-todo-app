"use client";

import { FiPlus } from "react-icons/fi";
import { dummyData } from "@/data/dummy-list";
import { useCallback, useEffect, useState } from "react";
import { IListStructure } from "@/types/ListTypes";
import StatusDiv from "@/components/StatusDiv";
import TodoFormModal from "@/components/TodoFormModal";
import Overlay from "@/components/Overlay";
import { LocalStorageService } from "@/utils/LocalStorageService";
import { useCategory } from "@/store/CategoryContext";

export default function Home() {
  const [completed, setCompleted] = useState<IListStructure[]>([]);
  const [todo, setTodo] = useState<IListStructure[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [allTodoList, setAllTodoList] = useState<IListStructure[]>([]);
  const [mode, setMode] = useState<'add' | 'edit' | 'delete'>('add');

  const { selectedCategory } = useCategory();
  useEffect(() => {
    const existing = LocalStorageService.get<IListStructure[]>();
    if (!existing || existing.length === 0) {
      LocalStorageService.set(dummyData);
    }
  }, []);

  
  const refreshTodoList = useCallback(() => {
    setPageLoading(true);
    setTimeout(() => {
      try {
        const stored = LocalStorageService.get<IListStructure[]>() ?? [];

        const locallySavedData = selectedCategory
          ? stored.filter((list) => list.category === selectedCategory)
          : stored;

        if (locallySavedData) {
          setAllTodoList(locallySavedData);
          setCompleted(locallySavedData.filter((list) => list.completed));
          setTodo(locallySavedData.filter((list) => !list.completed));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setPageLoading(false);
      }
    }, 500);
  }, [selectedCategory]);
  
  useEffect(()=>{
    refreshTodoList();
  },[selectedCategory, refreshTodoList]);

  const addNewTask = () => {
    setMode("add");
    setModalOpen(true);
  }
  

  return (
    <div className="w-full">
      <main className="w-full py-4">
        <div className="flex justify-end">
          <div className="flex items-center cursor-pointer gap-[10px] bg-theme-blue text-white w-fit p-2 px-4 rounded-sm hover:scale-95" onClick={addNewTask}>
            <span><FiPlus /></span>
            <span>Add New Task</span>
          </div>
        </div>
        <div className="flex items-center justify-between todo-task-div">
          <span>Today</span>
          <span>Pending</span>
          <span>All Tasks</span>
          <span>Past Due-Date</span>
        </div>
        <div>
          <p className="text-xl text-theme-blue font-semibold py-4">Todo Lists</p>
          {
            pageLoading ? 
            <div className="w-full relative h-[40vh]">
              <div className="loader w-full m-auto"></div>
            </div>
            : allTodoList && allTodoList.length > 0
            ?
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              <StatusDiv data={todo} status="Todo" refreshTodoList={refreshTodoList} />
              <StatusDiv data={completed} status="Completed" refreshTodoList={refreshTodoList} />
            </div>
            :
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              No data found
            </div>
          }
        </div>
      </main>
      <Overlay isOpen={modalOpen}>
        <TodoFormModal
          setModalOpen={setModalOpen}
          refreshTodoList={refreshTodoList}
          mode={mode}
          setMode={setMode}
        />
      </Overlay>
    </div>
  );
}